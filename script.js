
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const playerX = document.getElementById("playerX");
const playerO = document.getElementById("playerO");
const boardElement = document.getElementById("board");
const winningLine = document.getElementById("winningLine");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Main diagonal
    [2, 4, 6]  // Reverse diagonal
];

function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (board[index] !== "" || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    cell.setAttribute(
        "aria-label",
        `Cell ${index + 1}: ${currentPlayer}`
    );

    checkWinner();
}

function checkWinner() {
    let winningCombination = null;

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            winningCombination = combination;
            break;
        }
    }

    if (winningCombination) {
        gameActive = false;

        statusText.textContent = `Player ${currentPlayer} wins!`;

        winningCombination.forEach(index => {
            cells[index].classList.add("winner");
        });

        playerX.classList.remove("active");
        playerO.classList.remove("active");

        drawWinningLine(winningCombination);
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;

        playerX.classList.remove("active");
        playerO.classList.remove("active");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent = `Player ${currentPlayer}'s turn`;

    playerX.classList.toggle("active", currentPlayer === "X");
    playerO.classList.toggle("active", currentPlayer === "O");
}

function drawWinningLine(combination) {
    const firstCell = cells[combination[0]];
    const lastCell = cells[combination[2]];

    const boardRect = boardElement.getBoundingClientRect();
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();

    // Find the center of the first and last winning cells
    const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;

    const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;

    // Calculate line length and direction
    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Position the line between the winning cells
    winningLine.style.width = `${length}px`;
    winningLine.style.left = `${(x1 + x2) / 2 - length / 2}px`;
    winningLine.style.top = `${(y1 + y2) / 2 - 3}px`;
    winningLine.style.transform = `rotate(${angle}deg)`;

    // Display and animate the line
    winningLine.classList.remove("show");

    // Restart the animation cleanly
    void winningLine.offsetWidth;

    winningLine.classList.add("show");
}

function restartGame() {
    currentPlayer = "X";
    gameActive = true;
    board = ["", "", "", "", "", "", "", "", ""];

    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");

        cell.setAttribute(
            "aria-label",
            `Cell ${index + 1}: empty`
        );
    });

    // Remove the previous winning line
    winningLine.classList.remove("show");

    statusText.textContent = "Player X's turn";

    playerX.classList.add("active");
    playerO.classList.remove("active");
}

// Listen for clicks on all nine cells
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

// Restart the game
restartBtn.addEventListener("click", restartGame);
