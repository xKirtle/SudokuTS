"use strict";
{
    const boardElement = document.getElementById('grid');
    function boardGeneration(difficulty, arrayBoard) {
        let board = {
            groups: [],
            isPencilEnabled: false
        };
        //#region Generate Groups
        for (let i = 1; i < 10; i++) {
            let group = {
                cells: [],
                element: document.createElement('div')
            };
            group.element.classList.add('Group');
            group.element.style.gridArea = 'Group' + i;
            //#region Create Cells
            for (let j = 1; j < 10; j++) {
                let isReadOnly = Math.random() >= difficulty;
                let cell = {
                    value: undefined,
                    readOnly: isReadOnly,
                    pencilEnabled: false,
                    pencilValues: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    pencilElements: [],
                    group: i - 1,
                    index: j - 1,
                    element: document.createElement('div')
                };
                //#region HTML display of the Cell
                //Cell Value + Cell Pen Values
                cell.element.classList.add('Cell');
                cell.element.style.gridArea = 'Cell' + j;
                cell.element.addEventListener('mousedown', () => {
                    setSelectedCell(cell.group, cell.index);
                });
                //HTML display of the Cell Value
                let cellValue = document.createElement('div');
                cellValue.classList.add('CellValue');
                cellValue.style.gridArea = '1 / 1 / 4 / 4';
                if (isReadOnly) {
                    cell.value = arrayBoard[cell.group][cell.index];
                    cellValue.textContent = arrayBoard[cell.group][cell.index].toString();
                    cellValue.style.color = '#999';
                }
                cell.element.append(cellValue);
                //Create Pencil Cells
                for (let k = 1; k < 10; k++) {
                    let penElement = document.createElement('div');
                    penElement.classList.add('Pen', 'hidden-pen');
                    penElement.style.gridArea = 'Pen' + k;
                    penElement.textContent = k.toString();
                    cell.pencilElements.push(penElement);
                    cell.element.append(penElement);
                }
                group.cells.push(cell);
                group.element.append(cell.element);
                //#endregion
            }
            //#endregion
            board.groups.push(group);
            boardElement === null || boardElement === void 0 ? void 0 : boardElement.append(group.element);
        }
        //#endregion
        //#region Options
        let optionsElement = document.createElement('div');
        optionsElement.classList.add('Options');
        let numbersElement = document.createElement('div');
        numbersElement.classList.add('ControlNumbers');
        for (let i = 1; i < 10; i++) {
            let numberElement = document.createElement('div');
            numberElement.classList.add('Numbers');
            numberElement.style.gridArea = 'N' + i;
            numberElement.textContent = i.toString();
            numberElement.addEventListener('mousedown', () => {
                setSelectedCellValue(i);
            });
            numbersElement.append(numberElement);
        }
        optionsElement.append(numbersElement);
        //Pencil + Eraser
        let controlOptionsElement = document.createElement('div');
        controlOptionsElement.classList.add('ControlOptions');
        let pencilElement = document.createElement('div');
        pencilElement.classList.add('Numbers');
        pencilElement.style.paddingTop = '40px';
        pencilElement.style.gridArea = 'Pencil';
        pencilElement.textContent = 'Pencil';
        pencilElement.addEventListener('mousedown', () => {
            board.isPencilEnabled = !board.isPencilEnabled;
            if (board.isPencilEnabled) {
                pencilElement.classList.add('CellActive');
            }
            else {
                pencilElement.classList.remove('CellActive');
            }
        });
        controlOptionsElement.append(pencilElement);
        let eraserElement = document.createElement('div');
        eraserElement.classList.add('Numbers');
        eraserElement.style.padding = '40px';
        eraserElement.style.gridArea = 'Eraser';
        eraserElement.textContent = 'Erase';
        eraserElement.addEventListener('mousedown', () => {
            setSelectedCellValue();
        });
        controlOptionsElement.append(eraserElement);
        optionsElement.append(controlOptionsElement);
        boardElement === null || boardElement === void 0 ? void 0 : boardElement.append(optionsElement);
        //#endregion
        //Make keyboard be able to place numbers
        addEventListener('keydown', (event) => {
            if (event.key !== undefined) {
                let key = parseInt(event.key);
                if (key >= 1 && key <= 9) {
                    if (board.selectedCell != undefined) {
                        setSelectedCellValue(key);
                    }
                }
                if (event.key == 'Tab') {
                    if (board.selectedCell != undefined) {
                        let cellIndex = board.selectedCell.index;
                        if (cellIndex < 8) {
                            setSelectedCell(board.selectedCell.group, board.selectedCell.index + 1);
                        }
                        else {
                            setSelectedCell(board.selectedCell.group + 1, 0);
                        }
                        event.preventDefault();
                    }
                }
            }
        });
        //#region Functions
        function setSelectedCell(group, index) {
            var _a, _b;
            //Clear previous highlight
            board.groups.forEach(group => {
                group.element.classList.remove('CellSubActive');
                group.cells.forEach(cell => cell.element.classList.remove('CellActive', 'CellSubActive'));
            });
            (_a = board.selectedCell) === null || _a === void 0 ? void 0 : _a.pencilElements.forEach(x => x.classList.remove('CellActive', 'CellSubActive'));
            //Get new selected cell
            board.selectedCell = board.groups[group].cells[index];
            //Highlight Cell
            board.selectedCell.element.classList.add('CellActive');
            //Highlight Group
            (_b = board.selectedCell.element.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add('CellSubActive');
            //Highlight Row
            //let row = Math.trunc(group / 3) * 3 + Math.trunc(index / 3);
            let groupRow = Math.trunc(group / 3) * 3;
            let cellRow = Math.trunc(index / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board.groups[groupRow + i].cells[cellRow + j].element.classList.add('CellSubActive');
                }
            }
            //Highlight Column
            //let column = (group % 3) * 3 + index % 3;
            let groupColumn = group % 3;
            let cellColumn = index % 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board.groups[groupColumn + (i * 3)].cells[cellColumn + (j * 3)].element.classList.add('CellSubActive');
                }
            }
            //Highlight numbers with same value
            if (board.selectedCell.value == undefined)
                return;
            board.groups.forEach(group => group.cells.forEach(cell => {
                var _a;
                if (board.selectedCell != cell && ((_a = board.selectedCell) === null || _a === void 0 ? void 0 : _a.value) == cell.value) {
                    cell.element.classList.add('CellActive');
                }
            }));
            renderCellValues();
        }
        function setSelectedCellValue(value) {
            var _a;
            if (board.selectedCell == undefined || ((_a = board.selectedCell) === null || _a === void 0 ? void 0 : _a.readOnly))
                return;
            if (!board.isPencilEnabled || value == undefined) {
                board.selectedCell.value = value;
                if (board.selectedCell.pencilEnabled) {
                    board.selectedCell.pencilValues = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                    board.selectedCell.pencilEnabled = false;
                }
            }
            else {
                board.selectedCell.value = undefined;
                board.selectedCell.pencilEnabled = true;
                board.selectedCell.pencilValues[value - 1] = Number(!board.selectedCell.pencilValues[value - 1]);
            }
            setSelectedCell(board.selectedCell.group, board.selectedCell.index);
            renderCellValues();
            console.log(validBoard(board));
        }
        function renderCellValues() {
            board.groups.forEach(group => group.cells.forEach(cell => {
                var _a, _b;
                cell.element.children[0].textContent = null;
                cell.pencilElements.forEach(pencil => pencil.classList.add('hidden-pen'));
                if (!cell.pencilEnabled) {
                    //cell value should never be null here...
                    cell.element.children[0].textContent = (_b = (_a = cell.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
                }
                else {
                    for (let i = 0; i < 9; i++) {
                        if (cell.pencilValues[i]) {
                            cell.pencilElements[i].classList.remove('hidden-pen');
                        }
                    }
                }
            }));
        }
        //#endregion
        return board;
    }
    function validGroup(group) {
        let groupSet = new Set();
        for (let i = 0; i < 9; i++) {
            if (group.cells[i].value != undefined) {
                groupSet.add(group.cells[i].value);
            }
        }
        return groupSet.size == 9;
    }
    function validRow(cell) {
        let rowSet = new Set();
        let groupRow = Math.trunc(cell.group / 3) * 3;
        let cellRow = Math.trunc(cell.index / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board.groups[groupRow + i].cells[cellRow + j].value != undefined) {
                    rowSet.add(board.groups[groupRow + i].cells[cellRow + j].value);
                }
            }
        }
        return rowSet.size == 9;
    }
    function validColumn(cell) {
        let columnSet = new Set();
        let groupColumn = cell.group % 3;
        let cellColumn = cell.index % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board.groups[groupColumn + (i * 3)].cells[cellColumn + (j * 3)].value != undefined) {
                    columnSet.add(board.groups[groupColumn + (i * 3)].cells[cellColumn + (j * 3)].value);
                }
            }
        }
        return columnSet.size == 9;
    }
    function validBoard(board) {
        //Groups
        for (let i = 0; i < 9; i++) {
            if (!validGroup(board.groups[i]))
                return false;
        }
        //Rows
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!validRow(board.groups[i * 3].cells[j * 3]))
                    return false;
            }
        }
        //Columns
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!validColumn(board.groups[i].cells[j]))
                    return false;
            }
        }
        return true;
    }
    function GenerateSudokuPuzzle() {
        let dummyBoard = [
            [0, 5, 1, 3, 6, 2, 7, 0, 0],
            [0, 4, 0, 0, 5, 8, 0, 0, 0],
            [0, 0, 0, 4, 0, 0, 0, 2, 5],
            [0, 8, 0, 0, 0, 0, 9, 0, 3],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [7, 0, 5, 0, 0, 0, 0, 8, 0],
            [1, 2, 0, 0, 0, 9, 0, 0, 0],
            [0, 0, 0, 2, 8, 0, 0, 6, 0],
            [0, 0, 8, 5, 3, 4, 2, 9, 0]
        ];
        return rowBoardToGroupBoard(solve(dummyBoard));
        ;
        //#region Solver + Utils
        //Because our Board object is grouped by Groups (3x3 squares) and not rows. Our solver solves by rows
        function rowBoardToGroupBoard(board) {
            let resultBoard = [];
            for (let group = 0; group < 9; group++) {
                let groupArray = [];
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let column = j + (group % 3) * 3;
                        let row = i + Math.trunc(group / 3) * 3;
                        groupArray.push(board[row][column]);
                    }
                }
                resultBoard.push(groupArray);
            }
            return resultBoard;
        }
        function nextEmptySpot(board) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (board[i][j] == 0)
                        return [i, j];
                }
            }
            return [-1, -1];
        }
        function checkRow(board, row, value) {
            for (let i = 0; i < board[row].length; i++) {
                if (board[row][i] == value) {
                    return false;
                }
            }
            return true;
        }
        function checkColumn(board, column, value) {
            for (let i = 0; i < board.length; i++) {
                if (board[i][column] == value) {
                    return false;
                }
            }
            return true;
        }
        function checkSquare(board, row, column, value) {
            let rowIndex = Math.floor(row / 3) * 3;
            let colIndex = Math.floor(column / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[rowIndex + i][colIndex + j] == value)
                        return false;
                }
            }
            return true;
        }
        function checkValue(board, row, column, value) {
            if (checkRow(board, row, value) &&
                checkColumn(board, column, value) &&
                checkSquare(board, row, column, value)) {
                return true;
            }
            return false;
        }
        function solve(board) {
            let emptySpot = nextEmptySpot(board);
            let row = emptySpot[0];
            let col = emptySpot[1];
            // there is no more empty spots
            if (row == -1) {
                return board;
            }
            for (let num = 1; num < 10; num++) {
                if (checkValue(board, row, col, num)) {
                    board[row][col] = num;
                    solve(board);
                }
            }
            if (nextEmptySpot(board)[0] != -1) {
                board[row][col] = 0;
            }
            return board;
        }
        //#endregion
    }
    //TODO: Better code organization.. Classes?
    let board = boardGeneration(0.5, GenerateSudokuPuzzle());
}
