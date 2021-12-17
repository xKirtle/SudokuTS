const gridElement = document.getElementById('grid');

interface Board {
  groups: Group[];
}

interface Group {
  cells: Cell[];
}

interface Cell {
  value: number;
  readOnly: boolean;
  pencilEnable: boolean;
  pencilValues: [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function boardGeneration() {

}