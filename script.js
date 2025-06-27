function GameController() {
  const players = [
    {
      name: "Player 1",
      marker: 'O'
    }, 
    {
      name: "Player 2",
      marker: 'X'
    }
  ];

  let board = Array(9).fill("");
  let activePlayerIndex = 0;
  let gameOver = false;

  const getBoard = () => board;
  const getActivePlayer = () => players[activePlayerIndex];
  const isGameOver = () => gameOver;

  const checkWin = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== "")) {
      return "tie";
    }
  };

  const playRound = (cellIndex) => {
    if (gameOver || board[cellIndex] != "") {
      return false;
    }
    board[cellIndex] = getActivePlayer().marker;
    const winner = checkWin();

    if (winner) {
      gameOver = true;
      return { winner, gameOver: true };
    }
    
    activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
    return { winner: null, gameOver: false };
  };

  return {
    getBoard,
    getActivePlayer,
    playRound,
    isGameOver,
    checkWin
  };
};

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const gameOverDiv = document.querySelector('.game-over');

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    if (!game.isGameOver()) {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
      gameOverDiv.textContent = "";
    }

    board.forEach((cellValue, index) => {
      const cellButton = document.createElement("button");
      cellButton.classList.add("cell");
      cellButton.dataset.cell = index;
      cellButton.textContent = cellValue;

      if (cellValue !== "" || game.isGameOver()) {
        cellButton.disabled = true;
      }

      boardDiv.appendChild(cellButton);
    });
  };

  function clickHandlerBoard(e) {
    if (e.target.classList.contains('cell')) {
      const selectedCell = parseInt(e.target.dataset.cell);
      const result = game.playRound(selectedCell);

      if (result && result.gameOver) {
        const winner = game.checkWin();
        if (winner === "tie") {
          playerTurnDiv.textContent = "";
          gameOverDiv.textContent = "It's a tie!";
        } else {
          const winnerName = winner === "O" ? "Player 1" : "Player 2";
          playerTurnDiv.textContent = "";
          gameOverDiv.textContent = `${winnerName} wins!`;
        }
      }
      updateScreen();
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();
};

ScreenController();