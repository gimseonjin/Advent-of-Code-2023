/*
--- Part Two ---

Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

What is the sum of all of the calibration values?
*/

import { readFileLines } from "../../helper/FileReader";

const numberStringMap = new Map([
  ["zero", "0"],
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

function findFirstNumberInString({
  str,
  start,
  end,
  step,
}: {
  str: string;
  start: number;
  end: number;
  step: number;
}): string {
  for (let i = start; i !== end; i += step) {
    const target = Number(str[i]);
    if (!isNaN(target)) return str[i];

    const nextStr = str.slice(i, str.length);

    for (const [key, value] of numberStringMap) {
      if (nextStr.startsWith(key)) return value.toString();
    }
  }
  return "";
}

function getFirstNumber(str: string, isReverse: boolean): string {
  return isReverse
    ? findFirstNumberInString({
        str,
        start: str.length,
        end: -1,
        step: -1,
      })
    : findFirstNumberInString({ str, start: 0, end: str.length, step: 1 });
}

async function main() {
  const calibrations = await readFileLines(__dirname, "input.txt");

  const result = calibrations
    .map((calibration) => {
      const first = getFirstNumber(calibration, false);
      const second = getFirstNumber(calibration, true);
      return first + second;
    })
    .reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue),
      0
    );

  console.log(result);
}

main();
