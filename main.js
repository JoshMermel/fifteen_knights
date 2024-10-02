// stuff to do
// - Uniform cell sizes
// - maybe stop having zeroRow and zeroCol as globals?

// Globals  for  caching  the  position  of  the  empty cell so we don't
// have to recompute this all the time.
zeroRow = 0;
zeroCol = 0;

function canDoMove(rowIdx, colIdx) {
	let rowDelta = Math.abs(rowIdx - zeroRow);
	let colDelta = Math.abs(colIdx - zeroCol);
	return (rowDelta == 1 && colDelta == 2) || (rowDelta == 2 && colDelta == 1);
}

// Attempts to swap the clicked cell into the empty cell.
// Does nothing if that move is illegal.
function tryMove(event) {
	const board = document.getElementById('board');
	const cell = event.target;
	const rowIdx = cell.parentElement.rowIndex;
	const colIdx = cell.cellIndex;

	if (canDoMove(rowIdx, colIdx)) {
		doMove(board, rowIdx, colIdx, cell.textContent);
	}
}

// Swaps (rowIdx, colIdx) with the empty cell.
function doMove(board, rowIdx, colIdx, val) {
	board.rows[zeroRow].cells[zeroCol].textContent = board.rows[rowIdx].cells[colIdx].textContent;
	board.rows[rowIdx].cells[colIdx].textContent = '';
	zeroRow = rowIdx;
	zeroCol = colIdx;
}

// Sets up a |rows| by |cols| gameboard.
function initGame(rows, cols) {
	const board = document.getElementById('board');
	board.innerHTML = '';
	let idx = 1;
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('tr');
		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('td');
			cell.style.border = '1px solid black';
			cell.style.textAlign = 'center';
			cell.style.width = "32px";
			cell.style.height = "32px";
			cell.textContent = idx;
			idx++;
			row.appendChild(cell);
		}
		board.append(row);
	}
	board.lastChild.lastChild.textContent = '';
	board.addEventListener('click', tryMove);
	zeroRow = rows-1;
	zeroCol = cols-1;
}

function scramble(n) {
	const board = document.getElementById('board');
	for (let i = 0; i < n; i++) {
		randomMove(board);
	}
}

function randomMove(board) {
	let num_rows = board.rows.length;
	let num_cols = board.rows[0].cells.length;

	let possible_moves = [
		[zeroRow-2, zeroCol-1],
		[zeroRow-2, zeroCol+1],
		[zeroRow-1, zeroCol+2],
		[zeroRow+1, zeroCol+2],
		[zeroRow+2, zeroCol+1],
		[zeroRow+2, zeroCol-1],
		[zeroRow+1, zeroCol-2],
		[zeroRow-1, zeroCol-2],
	].filter( pair => (pair[0] >= 0 && pair[0] < num_rows && pair[1] >= 0 && pair[1] < num_cols));

	if (possible_moves.length > 0) {
		const move = possible_moves[Math.floor(Math.random() * possible_moves.length)];
		doMove(board, move[0], move[1]);
	}
}

window.onload = function() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	let width = 4;
	let height = 4;

	if (urlParams.has('width')) {
		width = urlParams.get('width');
	}
	if (urlParams.has('height')) {
		height = urlParams.get('height');
	}

	initGame(height,width);
}
