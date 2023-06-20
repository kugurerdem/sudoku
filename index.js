const
    createSudokuRow = (colNumber) => `
        <div class="sudoku-row">
            ${repeat('<div class="sudoku-cell"></div>', colNumber)}
        </div>
    `,

    createSudokuGrid = (rowNumber, colNumber) => `
        <div class="sudoku-grid">
            ${repeat(createSudokuRow(colNumber), rowNumber)}
        </div>
    `,

    app = () => `
        <h1>Sudoku Game</h1>
        ${createSudokuGrid(9, 9)}
    `,

    repeat = (str, times) => Array(times).fill(str).join('')

document.getElementById('sudoku').innerHTML = app()
