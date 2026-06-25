/**
 * Deterministic QR-like Matrix Generator
 * Generates an authentic-looking 25x25 QR matrix for any string (e.g. User UID).
 * Includes three 7x7 Finder Patterns and an Alignment Pattern to look 100% realistic.
 */

export function generateQrMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

  // Helper to draw a square on the matrix
  const drawSquare = (row: number, col: number, s: number, fill: boolean) => {
    for (let r = 0; r < s; r++) {
      for (let c = 0; c < s; c++) {
        if (row + r < size && col + c < size) {
          matrix[row + r][col + c] = fill;
        }
      }
    }
  };

  // Helper to draw a Finder Pattern (7x7 nested square)
  const drawFinderPattern = (row: number, col: number) => {
    drawSquare(row, col, 7, true);   // Outer 7x7 black
    drawSquare(row + 1, col + 1, 5, false); // Inner 5x5 white
    drawSquare(row + 2, col + 2, 3, true);  // Center 3x3 black
  };

  // 1. Draw three Finder Patterns in the corners
  drawFinderPattern(0, 0);              // Top-Left
  drawFinderPattern(0, size - 7);       // Top-Right
  drawFinderPattern(size - 7, 0);       // Bottom-Left

  // 2. Draw standard timing lines (alternating dots between finders)
  for (let i = 8; i < size - 7; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Draw a small alignment pattern (5x5 nested square) at (size-9, size-9)
  const alignRow = size - 9;
  const alignCol = size - 9;
  drawSquare(alignRow, alignCol, 5, true);
  drawSquare(alignRow + 1, alignCol + 1, 3, false);
  matrix[alignRow + 2][alignCol + 2] = true;

  // 4. Fill the remaining data areas deterministically using a hash of the text
  // Simple custom hash function
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Seeded random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  let seedOffset = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip Finder Pattern zones (0-8 range for top-left/right/bottom-left)
      const inTopLeftFinder = r < 9 && c < 9;
      const inTopRightFinder = r < 9 && c >= size - 9;
      const inBottomLeftFinder = r >= size - 9 && c < 9;
      // Skip alignment pattern zone
      const inAlignment = r >= alignRow && r < alignRow + 5 && c >= alignCol && c < alignCol + 5;
      // Skip timing lines
      const inTimingLines = r === 6 || c === 6;

      if (!inTopLeftFinder && !inTopRightFinder && !inBottomLeftFinder && !inAlignment && !inTimingLines) {
        const rand = seededRandom(hash + r * 31 + c + seedOffset);
        matrix[r][c] = rand > 0.48; // Alternating density
        seedOffset += 1;
      }
    }
  }

  return matrix;
}
