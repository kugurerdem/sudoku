const
    {assign} = Object,

    numberOfCellsToRemoveByDifficulty = {
        easy: 30,
        medium: 40,
        hard: 50,
    },

    state = {
        page: 'Landing',
        difficulty: 'medium',
        initialSudokuArray: null,
        solvedSudokuArray: null,
        sudokuArray: null,
    },

    init = () => render(),

    render = () => {
        document.getElementById('sudoku').innerHTML = App()
    },

    App = () => {
        if(state.page == 'Landing')
            return LandingPage()

        else if(state.page == 'SudokuGame'){
            if(!state.initialSudokuArray){
                const [
                    initialSudokuArray,
                    solvedSudokuArray
                ] = generateSudokuArray(state.difficulty)

                assign(state, {
                    initialSudokuArray, solvedSudokuArray,
                    sudokuArray: initialSudokuArray
                })
            }

            return SudokuGame(state.sudokuArray)
        }

        return ``
    },

    LandingPage = () => `
        <h1> Choose Difficulty </h1>
        <div class="difficulty">
            <button class="easy" onclick="changeDifficulty(event)">Easy</button>
            <button class="medium" onclick="changeDifficulty(event)">Medium</button>
            <button class="hard" onclick="changeDifficulty(event)">Hard</button>
        </div>
    `,

    // sudokuArray is a 2D array
    // e.g. [ [1, 2, 3, 4, null, 6, null, 8, 9], ... ]
    SudokuGame = () => `
        <h1>Sudoku Game</h1>
        ${SudokuGrid()}
    `,

    SudokuGrid = () => `
        <div id="sudoku-grid" class="sudoku-grid">
            ${state.sudokuArray
                .map((_, idx) => SudokuRow(idx)).join('\n')}
        </div>`,


    SudokuRow = (rowIdx) => `
        <div class="sudoku-row">
            ${state.sudokuArray[rowIdx].map((_, colIdx) =>
                SudokuCell(rowIdx, colIdx)).join('\n')}
        </div>`,

    SudokuCell = (rowIdx, colIdx) => {
        const
            value = state.sudokuArray[rowIdx][colIdx],
            correctValue = state.solvedSudokuArray[rowIdx][colIdx],
            colorClass = (value && value != correctValue) ? 'red' : ''

        return `<input
            class="sudoku-cell ${colorClass}"
            maxlength="1"
            type="text"
            oninput="this.value=this.value.replace(/[^1-9]/g,'');"
            ${value ? `value="${value}" ${readOnly(rowIdx, colIdx)}` : ''},
            onKeyup="updateSudokuArray(event, ${rowIdx}, ${colIdx})"
        />`
    },

    readOnly = (rowIdx, colIdx) =>
        state.initialSudokuArray[rowIdx][colIdx]
            ? 'readonly'
            : ''

    changeDifficulty = (e) => {
        state.page = 'SudokuGame'
        state.difficulty = e.target.className
        render()
    },

    updateSudokuArray = (e, rowIdx, colIdx) => {
        if(e.target.value){
            state.sudokuArray[rowIdx][colIdx] = Number(e.target.value)

            const finished = isEqual(
                state.sudokuArray,
                state.solvedSudokuArray
            )

            if(finished) finishGame()

            render()
        }
    },

    finishGame = () => {
        // TODO: improve this function
        alert('You finished the game!')
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

        return [
            chunk(finalizedSudokuPuzzle, 9),
            chunk(normalizedRandomPuzzle, 9)
        ]
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

    // implement the opposite of chunk
    isEqual = (array1, array2) =>
        (array1.length == array2.length
            && array1.every((value, index) => value == array2[index]))


init()
