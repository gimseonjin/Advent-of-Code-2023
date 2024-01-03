import { readFileLines } from "../../helper/FileReader";

type SymbolCoordinate = {
  symbol: string;
  x: number;
  y: number;
};

function findSymbolsInSchematic(engineSchematic: string[]): SymbolCoordinate[] {
  return engineSchematic.reduce((symbolList, row, i) => {
    row.split("").forEach((cell, j) => {
      if (isNaN(Number(cell)) && cell !== ".") {
        symbolList.push({ symbol: cell, x: i, y: j });
      }
    });
    return symbolList;
  }, [] as SymbolCoordinate[]);
}

function calculateSumOfAdjacentNumbers(
  symbolCoordinateList: SymbolCoordinate[],
  engineSchematic: string[]
) {
  const checked = engineSchematic.map((row) => Array(row.length).fill(false));

  return symbolCoordinateList.flatMap((symbolCoordinate) =>
    findNumbersAroundSymbol(symbolCoordinate, checked, engineSchematic)
  );
}

function findNumbersAroundSymbol(
  symbolCoordinate: SymbolCoordinate,
  checked: boolean[][],
  engineSchematic: string[]
) {
  const adjacentNumbers: number[] = [];
  const directions = [
    { dx: -1, dy: 0 }, // 상 (top)
    { dx: 1, dy: 0 }, // 하 (bottom)
    { dx: 0, dy: -1 }, // 좌 (left)
    { dx: 0, dy: 1 }, // 우 (right)
    { dx: -1, dy: -1 }, // 상좌 (top-left)
    { dx: -1, dy: 1 }, // 상우 (top-right)
    { dx: 1, dy: -1 }, // 하좌 (bottom-left)
    { dx: 1, dy: 1 }, // 하우 (bottom-right)
  ];

  for (const { dx, dy } of directions) {
    const x = symbolCoordinate.x + dx;
    const y = symbolCoordinate.y + dy;

    if (
      x >= 0 &&
      x < engineSchematic.length &&
      y >= 0 &&
      y < engineSchematic[0].length
    ) {
      const adjacent = Number(engineSchematic[x][y]);
      if (!isNaN(adjacent)) {
        const connectedNumbers = findSequentialNumbers(
          engineSchematic,
          checked,
          x,
          y
        );
        adjacentNumbers.push(Number(connectedNumbers));
      }
    }
  }

  return adjacentNumbers;
}

function findSequentialNumbers(
  engineSchematic: string[],
  checked: boolean[][],
  x: number,
  y: number
): string {
  let numStr = "";
  let left = y;

  // 왼쪽 방향으로 탐색
  while (
    left >= 0 &&
    !isNaN(Number(engineSchematic[x][left])) &&
    !checked[x][left]
  ) {
    numStr = engineSchematic[x][left] + numStr;
    checked[x][left] = true; // 좌표 체크
    left--;
  }

  let right = y + 1;

  // 오른쪽 방향으로 탐색
  while (
    right < engineSchematic[x].length &&
    !isNaN(Number(engineSchematic[x][right])) &&
    !checked[x][right]
  ) {
    numStr += engineSchematic[x][right];
    checked[x][right] = true; // 좌표 체크
    right++;
  }

  return numStr;
}

async function main() {
  const engineSchematic = await readFileLines(__dirname, "input.txt");

  const symbolCoordinateList = findSymbolsInSchematic(engineSchematic);

  const adjacentNumbers = calculateSumOfAdjacentNumbers(
    symbolCoordinateList,
    engineSchematic
  );

  const result = adjacentNumbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  console.log(result);
}

main();
