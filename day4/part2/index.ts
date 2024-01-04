import { readFileLines } from "../../helper/FileReader";

type ScratchCard = {
  id: string;
  winningNumbers: number[];
  yourNumbers: number[];
  count: number;
  instance: number;
};

/** scratchCard의 형태 => 'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53' */
function parseScratchCard(scratchCard: string): ScratchCard {
  const id = scratchCard.split(":")[0];

  const winningNumbers = scratchCard
    .split(":")[1]
    .split("|")[0]
    .split(" ")
    .map((numStr) => Number(numStr))
    .filter((num) => num !== 0);

  const yourNumbers = scratchCard
    .split(":")[1]
    .split("|")[1]
    .split(" ")
    .map((numStr) => Number(numStr))
    .filter((num) => num !== 0);

  return {
    id,
    winningNumbers,
    yourNumbers,
    count: 0,
    instance: 1,
  };
}

function countMatchedWinningNumbers(scratchCard: ScratchCard): ScratchCard {
  const matchedWinningNumbers = scratchCard.yourNumbers.filter((number) =>
    scratchCard.winningNumbers.includes(number)
  );
  return {
    ...scratchCard,
    count: matchedWinningNumbers.length,
  };
}

async function main() {
  const raws = await readFileLines(__dirname, "input.txt");

  const totalPoints = raws
    .map((raw) => parseScratchCard(raw))
    .map((card) => countMatchedWinningNumbers(card))
    .map((card, index, array) => {
      const endIndex = index + card.count;
      for (let i = index + 1; i <= endIndex; i++) {
        if (i < array.length) {
          array[i].instance += card.instance;
        }
      }

      return card;
    })
    .reduce((total, card) => total + card.instance, 0);

  console.log(totalPoints);
}

main();
