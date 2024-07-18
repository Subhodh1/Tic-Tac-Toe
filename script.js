const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const board = document.getElementById('board');
const statusMessage = document.getElementById('status-message');
const restartButton = document.getElementById('restart-button');
const cells = document.querySelectorAll('[data-cell]');
let currentPlayer = X_CLASS;
let gameActive = true;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  currentPlayer = X_CLASS;
  gameActive = true;
  statusMessage.innerText = "Player X's turn";
  statusMessage.classList.remove('fade-in');
  setTimeout(() => {
    statusMessage.classList.add('fade-in');
  }, 300);
  cells.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
    cell.textContent = '';
    removeScratchLine();
  });
}

function handleClick(event) {
  const cell = event.target;
  const currentClass = currentPlayer === X_CLASS ? X_CLASS : O_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    const winningCombination = getWinningCombination(currentClass);
    if (winningCombination) {
      applyScratchLine(winningCombination);
    }
    endGame(currentClass);
  } else if (isDraw()) {
    endGame(null);
  } else {
    swapTurns();
  }
}

function endGame(winningClass) {
  gameActive = false;
  if (winningClass) {
    statusMessage.innerText = `${winningClass === X_CLASS ? "Player X" : "Player O"} wins!`;
  } else {
    statusMessage.innerText = 'Draw!';
  }
  statusMessage.classList.remove('fade-in');
  setTimeout(() => {
    statusMessage.classList.add('fade-in');
  }, 300);
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.textContent = currentClass.toUpperCase();
  cell.classList.add(currentClass);
}

function swapTurns() {
  currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
  statusMessage.innerText = `${currentPlayer === X_CLASS ? "Player X's turn" : "Player O's turn"}`;
  statusMessage.classList.remove('fade-in');
  setTimeout(() => {
    statusMessage.classList.add('fade-in');
  }, 300);
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function getWinningCombination(currentClass) {
  return WINNING_COMBINATIONS.find(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function applyScratchLine(winningCombination) {
    const line = document.createElement('div');
    line.classList.add('scratch-line');
  
    const firstCell = cells[winningCombination[0]];
    const lastCell = cells[winningCombination[2]];
  
    const boardRect = board.getBoundingClientRect();
    const firstCellRect = firstCell.getBoundingClientRect();
    const lastCellRect = lastCell.getBoundingClientRect();
  
    const startX = firstCellRect.left + firstCellRect.width / 2 - boardRect.left;
    const startY = firstCellRect.top + firstCellRect.height / 2 - boardRect.top;
    const endX = lastCellRect.left + lastCellRect.width / 2 - boardRect.left;
    const endY = lastCellRect.top + lastCellRect.height / 2 - boardRect.top;
  
    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) + 40; // Increase length even more
  
    line.style.width = `${length}px`;
    line.style.left = `${startX}px`; // Adjust start position horizontally
    line.style.top = `${startY + 50}px`; // Bring the line a bit downwards
  
    line.style.transformOrigin = '0 50%';
    line.style.transform = `rotate(${angle}rad)`;
  
    board.appendChild(line);
    setTimeout(() => {
      line.style.opacity = 1;
    }, 50);
  }
  
  
  
  

function removeScratchLine() {
  const lines = document.querySelectorAll('.scratch-line');
  lines.forEach(line => line.remove());
}
