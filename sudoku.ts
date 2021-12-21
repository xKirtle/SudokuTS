{
  interface Board {
    groups: Group[];
    selectedCell?: Cell;
    isPencilEnabled: boolean;
  }
  
  interface Group {
    cells: Cell[];
    readonly element: HTMLDivElement;
  }
  
  interface Cell {
    value?: number;
    valueElement: HTMLDivElement;
    readOnly: boolean;
    pencilEnabled: boolean;
    pencilValues: number[];
    pencilElements: HTMLDivElement[];
    readonly group: number;
    readonly index: number;
    readonly element: HTMLDivElement;
  }

  const boardElement = document.getElementById('grid');

  function boardGeneration(): Board {
    let board: Board = {
      groups: [],
      isPencilEnabled: false
    };

    //#region Generate Groups
    for (let i = 1; i < 10; i++) {
      let group: Group = {
        cells: [],
        element: document.createElement('div')
      };

      group.element.classList.add('Group');
      group.element.style.gridArea = 'Group' + i;

      //#region Create Cells
      for (let j = 1; j < 10; j++) {
        let cell: Cell = {
          value: undefined,
          valueElement: document.createElement('div'),
          readOnly: false,
          pencilEnabled: false,
          pencilValues: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          pencilElements: [],
          group: i-1,
          index: j-1,
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
        cell.valueElement.classList.add('CellValue');
        cell.valueElement.style.gridArea = '1 / 1 / 4 / 4';

        cell.element.append(cell.valueElement);

        //Create Pencil Cells
        for(let k = 1; k < 10; k++) {
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
      boardElement?.append(group.element);
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
      } else {
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
    boardElement?.append(optionsElement);
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
            } else {
              setSelectedCell(board.selectedCell.group + 1, 0);
            }

            event.preventDefault();
          }
        }

        //Shift Tab..
      }

      return board;
    });

    //#region Functions
    function setSelectedCell(group: number, index: number) {
      //Clear previous highlight
      board.groups.forEach(group => {
        group.element.classList.remove('CellSubActive');
        group.cells.forEach(cell => cell.element.classList.remove('CellActive', 'CellSubActive'));
      });
      board.selectedCell?.pencilElements.forEach(x => x.classList.remove('CellActive', 'CellSubActive'));
  
      //Get new selected cell
      board.selectedCell = board.groups[group].cells[index];
  
      //Highlight Cell
      board.selectedCell.element.classList.add('CellActive');
  
      //Highlight Group
      board.selectedCell.element.parentElement?.classList.add('CellSubActive');
  
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
      if (board.selectedCell.value == undefined) return;
  
      board.groups.forEach(group => group.cells.forEach(cell => {
        if (board.selectedCell != cell && board.selectedCell?.value == cell.value) {
          cell.element.classList.add('CellActive');
        }
      }));
  
      renderCellValues();
    }
  
    function setSelectedCellValue(value?: number) {
      if (board.selectedCell == undefined || board.selectedCell?.readOnly) return;
  
      if (!board.isPencilEnabled || value == undefined) {
        board.selectedCell.value = value;
  
        if (board.selectedCell.pencilEnabled) {
          board.selectedCell.pencilValues = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          board.selectedCell.pencilEnabled = false;
        }
      } else {
        board.selectedCell.value = undefined;
        board.selectedCell.pencilEnabled = true;
        board.selectedCell.pencilValues[value-1] = Number(!board.selectedCell.pencilValues[value-1]);
      }
  
      setSelectedCell(board.selectedCell.group, board.selectedCell.index);
      renderCellValues();

      if (validBoard(board)) {
        resetBoard();
      }
    }
  
    function renderCellValues() {
      board.groups.forEach(group => group.cells.forEach(cell => {
        cell.element.children[0].textContent = null;
        cell.pencilElements.forEach(pencil => pencil.classList.add('hidden-pen'));
  
        if (!cell.pencilEnabled) {
          //cell value should never be null here...
          cell.element.children[0].textContent = cell.value?.toString() ?? "";
        } else {
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

  function validBoard(board: Board): boolean {
    //Groups
    for (let i = 0; i < 9; i++) {
      if (!validGroup(board.groups[i])) return false;
    }

    //Rows
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (!validRow(board, board.groups[i * 3].cells[j * 3])) return false;
      }
    }

    //Columns
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (!validColumn(board, board.groups[i].cells[j])) return false;
      }
    }

    return true;

    function validGroup(group: Group): boolean {
      let groupSet = new Set();
      for (let i = 0; i < 9; i++) {
        if (group.cells[i].value != undefined) {
          groupSet.add(group.cells[i].value);
        }
      }
  
      return groupSet.size == 9;
    }
  
    function validRow(board: Board, cell: Cell): boolean {
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
  
    function validColumn(board: Board, cell: Cell): boolean {
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
  }

  function GenerateSudokuPuzzle() : number[][] {
    let emptyBoard: number[][] = [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ];

    for (let i: number = 0; i < 9; i++) {
      emptyBoard[Math.trunc(Math.random() * 9)][Math.trunc(Math.random() * 9)] = i;
    }

    let solvedBoard = solve(emptyBoard);
    console.log(solvedBoard);
    return rowBoardToGroupBoard(solvedBoard);

    //#region Solver + Utils
    //Because our Board object is grouped by Groups (3x3 squares) and not rows. Our solver solves by rows
    function rowBoardToGroupBoard(board: number[][]): number[][] {
      let resultBoard: number[][] = [];

      for (let group = 0; group < 9; group++) {
        let groupArray: number[] = [];
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
    function nextEmptySpot(board: number[][]): number[] {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == 0) 
                return [i, j];
        }
      }
      return [-1, -1];
    }
    
    function checkRow(board: number[][], row: number, value: number): boolean {
      for(let i = 0; i < board[row].length; i++) {
          if(board[row][i] == value) {
              return false;
          }
      }
    
      return true;
    }

    function checkColumn(board: number[][], column: number, value: number): boolean{
      for(let i = 0; i < board.length; i++) {
          if(board[i][column] == value) {
              return false;
          }
      }

      return true;
    }
    
    function checkSquare(board: number[][], row: number, column: number, value: number): boolean {
      let rowIndex = Math.floor(row / 3) * 3;
      let colIndex = Math.floor(column / 3) * 3;
      
      for (let i = 0; i < 3; i++){
          for (let j = 0; j < 3; j++){
              if (board[rowIndex + i][colIndex + j] == value)
                  return false;
          }
      }

      return true;
    }

    function checkValue(board: number[][], row: number, column: number, value: number): boolean {
      if(checkRow(board, row, value) &&
        checkColumn(board, column, value) &&
        checkSquare(board, row, column, value)) {
          return true;
      }
      
      return false; 
    }

    function solve(board: number[][]): number[][] {  
      let emptySpot = nextEmptySpot(board);
      let row = emptySpot[0];
      let col = emptySpot[1];

      // there is no more empty spots
      if (row == -1) {
          return board;
      }

      for(let num = 1; num < 10; num++) {
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

  function fillBoard(board: Board, solvedBoard: number[][], difficulty: number) {
    for (let i = 0; i < solvedBoard.length; i++) {
      for (let j = 0; j < solvedBoard[i].length; j++) {
        let cell: Cell = board.groups[i].cells[j];
        cell.value = undefined;
        cell.valueElement.style.color = 'white';
        cell.valueElement.textContent = '';

        if (Math.random() >= difficulty) {
          cell.value = solvedBoard[i][j];
          cell.valueElement.style.color = '#999';
          cell.valueElement.textContent = solvedBoard[i][j].toString();
        }
      }
    }
  }

  //Smaller -> easier
  let difficulty = 0.05;

  function resetBoard() {
    fillBoard(board, GenerateSudokuPuzzle(), difficulty);
  }

  //TODO: Better code organization.. Classes?
  let board =  boardGeneration();
  fillBoard(board, GenerateSudokuPuzzle(), difficulty);
}