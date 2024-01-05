import { readFileLines } from "../../helper/FileReader";

type ConversionMap = {
  type: MapType;
  list: ConversionRule[];
};

type ConversionRule = {
  destinationStart: number;
  sourceStart: number;
  length: number;
};

enum MapType {
  SeedToSoil = "seed-to-soil map:",
  SoilToFertilizer = "soil-to-fertilizer map:",
  FertilizerToWater = "fertilizer-to-water map:",
  WaterToLight = "water-to-light map:",
  LightToTemperature = "light-to-temperature map:",
  TemperatureToHumidity = "temperature-to-humidity map:",
  HumidityToLocation = "humidity-to-location map:",
}

function parseConversionData(raws: string[]) {
  const splitRaws = raws
    .reduce(
      (acc, val) => {
        if (val === "") {
          acc.push([]);
        } else {
          if (!acc.length || acc[acc.length - 1].length === 0) {
            acc.push([val]);
          } else {
            acc[acc.length - 1].push(val);
          }
        }
        return acc;
      },
      [[]] as string[][]
    )
    .filter((arr) => arr.length !== 0);

  const seeds = splitRaws[0][0]
    .split(":")[1]
    .trim()
    .split(" ")
    .map((value) => Number(value));

  const ConversionMaps: ConversionMap[] = splitRaws.slice(1).map((map) => {
    const type = map[0] as MapType;
    const list = map.slice(1).map((list) => {
      const [destinationStart, sourceStart, length] = list
        .split(" ")
        .map((value) => Number(value));

      return {
        destinationStart,
        sourceStart,
        length,
      };
    });

    return {
      type,
      list,
    };
  });

  return {
    seeds,
    ConversionMaps,
  };
}

function applyConversionToSeed(map: ConversionMap, seed: number) {
  const resultList = map.list.map((list) => {
    const { destinationStart, sourceStart, length } = list;

    if (sourceStart <= seed && seed < sourceStart + length) {
      return seed + destinationStart - sourceStart;
    }

    return seed;
  });

  return resultList.find((result) => result !== seed) ?? seed;
}

function convertSeedToLocation(
  seed: number,
  mapOrders: MapType[],
  ConversionMaps: ConversionMap[]
) {
  return mapOrders.reduce((currentResult, order) => {
    const target = ConversionMaps.find((almanac) => almanac.type === order);
    return applyConversionToSeed(target!, currentResult);
  }, seed);
}

async function main() {
  const raws = await readFileLines(__dirname, "input.txt");
  const { seeds, ConversionMaps } = parseConversionData(raws);

  const mapOrders = [
    MapType.SeedToSoil,
    MapType.SoilToFertilizer,
    MapType.FertilizerToWater,
    MapType.WaterToLight,
    MapType.LightToTemperature,
    MapType.TemperatureToHumidity,
    MapType.HumidityToLocation,
  ];

  const lowestLocationNumber = seeds
    .map((seed) => convertSeedToLocation(seed, mapOrders, ConversionMaps))
    .sort((a, b) => a - b)[0];

  console.log(lowestLocationNumber);
}

main();
