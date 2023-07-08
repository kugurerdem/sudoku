const
    numberOfCellsToRemoveByDifficulty = {
        easy: 30,
        medium: 40,
        hard: 50,
    },

    state = {
        page: 'Landing',
        difficulty: 'medium',
    },

    init = () => render(),

    render = () => {
        document.getElementById('sudoku').innerHTML = App()
    },

    App = () => {
        switch (state.page) {
            case 'Landing':
                return LandingPage()
            case 'SudokuGame':
                return SudokuGame(generateSudokuArray(state.difficulty))
        }
    },

    changeDifficulty = (e) => {
        state.page = 'SudokuGame'
        state.difficulty = event.target.className
        render()
    },

    LandingPage = () => `
        <h1> Choose Difficulty </h1>
        <div class="difficulty">
            <button class="easy" onclick="changeDifficulty(event)">Easy</button>
            <button class="medium" onclick="changeDifficulty(event)">Medium</button>
            <button class="hard" onclick="changeDifficulty(event)">Hard</button>
        </div>
    `,

    SudokuGame = (sudokuArray) => `
        <h1>Sudoku Game</h1>
        ${SudokuGrid(sudokuArray)}
    `,

    SudokuGrid = (sudokuArray) => `
        <div id="sudoku-grid" class="sudoku-grid">
            ${sudokuArray.map(row => SudokuRow(row)).join('\n')}
        </div>`,


    SudokuRow = (row) => `
        <div class="sudoku-row">
            ${row.map(cell => SudokuCell(cell)).join('\n')}
        </div>`,

    SudokuCell = (value) => `
        <input
            class="sudoku-cell"
            maxlength="1"
            type="text"
            oninput="this.value=this.value.replace(/[^0-9]/g,'');"
            ${value ? `value="${value}" readonly` : ''}
        />`,

    sudokuDOM2Array = (sudokuGrid) => {
        const
            sudokuRows = Array.from(sudokuGrid.children),
            sudokuCells = sudokuRows.map(row => Array.from(row.children)),
            sudokuArray =
                sudokuCells.map(row => row.map(cell => cell.value))

        return sudokuArray
    },

    chunk = (array, size) => {
        const
            firstChunk = array.slice(0, size),
            remainingChunks = array.slice(size)

        return [firstChunk].concat(
            remainingChunks.length > size
                ? chunk(remainingChunks, size)
                : [remainingChunks]
        )
    },

    generateSudokuArray = (difficulty) => {
        const
            randomPuzzle = puzzle.makepuzzle(),
            solvedRandomPuzzle = puzzle.solvepuzzle(randomPuzzle),
            normalizedRandomPuzzle =
                solvedRandomPuzzle.map(value => value + 1),

            numberOfCellsToRemove =
                numberOfCellsToRemoveByDifficulty[difficulty]

            finalizedSudokuPuzzle = nullifyArrayElements(
                normalizedRandomPuzzle,
                numberOfCellsToRemove
            )

        return chunk(finalizedSudokuPuzzle, 9)
    },

    // TODO: find a better name
    nullifyArrayElements = (array, numberOfElementsToNullify) => {
        const copiedArray = [...array]

        for(let i = 0; i < numberOfElementsToNullify; i++){
            const index = Math.floor(Math.random() * copiedArray.length);

            (copiedArray[index] == null)
                ? (i = i - 1)
                : (copiedArray[index] = null)
        }

        return copiedArray;
    }

init()
