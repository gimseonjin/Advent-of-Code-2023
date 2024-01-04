import { readFileLines } from "../../helper/FileReader";

type ScratchCard = {
  id: string;
  winningNumbers: number[];
  yourNumbers: number[];
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
  };
}

function countMatchedWinningNumbers(scratchCard: ScratchCard): number {
  const matchedWinningNumbers = scratchCard.yourNumbers.filter((number) =>
    scratchCard.winningNumbers.includes(number)
  );
  return matchedWinningNumbers.length;
}

function calculatePoints(matchedWinningNumbersCount: number): number {
  return matchedWinningNumbersCount === 0
    ? 0
    : 1 << (matchedWinningNumbersCount - 1);
}

async function main() {
  const raws = await readFileLines(__dirname, "input.txt");

  const totalPoint = raws
    .map((raw) => parseScratchCard(raw))
    .map((card) => countMatchedWinningNumbers(card))
    .map((count) => calculatePoints(count))
    .reduce((pre, cur) => pre + cur, 0);

    
  console.log(totalPoint);
}

main();
