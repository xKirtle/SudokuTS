"use strict";
{
    const boardElement = document.getElementById('grid');
    let board = {
        groups: [],
        isPencilEnabled: false
    };
    function boardGeneration(difficulty) {
        const sudokuPuzzle = GenerateSudokuPuzzle();
        //Generate Groups
        for (let i = 1; i < 10; i++) {
            let group = {
                cells: [],
                element: document.createElement('div')
            };
            group.element.classList.add('Group');
            group.element.style.gridArea = 'Group' + i;
            //Create Cells
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
                //HTML display of the Cell
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
                    cell.value = sudokuPuzzle[cell.group][cell.index];
                    cellValue.textContent = sudokuPuzzle[cell.group][cell.index].toString();
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
            }
            board.groups.push(group);
            boardElement === null || boardElement === void 0 ? void 0 : boardElement.append(group.element);
        }
        //Options
        let optionsElement = document.createElement('div');
        optionsElement.classList.add('Options');
        //Number Selection
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
        //Mode Selection
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
    }
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
    function GenerateSudokuPuzzle() {
        //TODO: Actually generate a valid sudoku board
        let result = [
            //each line is a group
            [5, 4, 3, 2, 1, 9, 8, 7, 6],
            [9, 2, 1, 6, 8, 7, 3, 5, 4],
            [8, 7, 6, 5, 4, 3, 2, 1, 9],
            [9, 8, 7, 3, 2, 1, 6, 5, 4],
            [4, 6, 5, 7, 9, 8, 1, 3, 2],
            [3, 2, 1, 6, 5, 4, 9, 8, 7],
            [7, 6, 5, 4, 3, 2, 1, 9, 8],
            [2, 4, 3, 8, 1, 9, 5, 7, 6],
            [1, 9, 8, 7, 6, 5, 4, 3, 2]
        ];
        return result;
    }
    boardGeneration(0.5);
}
