// If you only ever need ONE of something
// Use a modoule (gameBoard array, displayController)
// Immediately-invoked Function Expression (IIFE)

let game = (() => {
  let currentPlayer = null;
  let isFinished = false;

  function restartGame() {
    isFinished = false;
    gameBoard.cleanGameBoard();
  }

  function endGame(isDrawGame) {
    let playAgainButton = document.querySelector(".play-again-popup__button");

    if (isDrawGame) {
      displayController.changePopupMessage("It's a draw!");
    } else {
      displayController.changePopupMessage(
        `${this.currentPlayer.mark} has won the game!`
      );
    }

    setTimeout(function () {
      displayController.togglePopup();
    }, 500);

    playAgainButton.addEventListener("click", () => {
      displayController.togglePopup();
      restartGame();
    });
  }

  function changeCurrentPlayer() {
    game.currentPlayer = game.currentPlayer.nextPlayer;
    displayController.changeMessage(`It's ${game.currentPlayer.mark}'s turn!`);
  }

  return {
    currentPlayer,
    isFinished,
    restartGame,
    endGame,
    changeCurrentPlayer,
  };
})();

let displayController = (() => {
  let message = document.querySelector(".message");
  let popupMessage = document.querySelector(".play-again-popup__message");
  let playAgainPopup = document.querySelector(".play-again-popup");

  function changeMessage(msg) {
    message.textContent = msg;
  }

  function togglePopup() {
    playAgainPopup.classList.toggle("hidden");
  }

  function changePopupMessage(msg) {
    popupMessage.textContent = msg;
  }

  return { changeMessage, changePopupMessage, togglePopup };
})();

let gameBoard = (() => {
  let gameBoardCells = ["", "", "", "", "", "", "", "", ""];
  let cells = null;

  function renderGameBoard() {
    cells = document.querySelectorAll(".gameboard__cell");

    for (let i = 0; i < 9; i++) {
      cells[i].classList.remove("gameboard__cell--winner");
      cells[i].classList.remove("gameboard__cell--marked");

      cells[i].innerHTML = gameBoardCells[i];
      cells[i].addEventListener("click", () => {
        modifyCell(cells[i]);
      });
    }
  }

  function cleanGameBoard() {
    gameBoardCells = ["", "", "", "", "", "", "", "", ""];
    renderGameBoard();
  }

  function modifyCell(cell) {
    let isCellEmpty = cell.innerHTML === "" ? true : false;

    if (isCellEmpty) {
      changeCellContent(cell, game.currentPlayer.mark);

      checkForGameEnd();
      game.changeCurrentPlayer();
    }
  }

  function changeCellContent(cell, mark) {
    cell.innerHTML = mark;
    cell.classList.add("gameboard__cell--marked");

    let cellId = cell.getAttribute("data-id");
    gameBoardCells[cellId] = game.currentPlayer.mark;
  }

  function checkForGameEnd() {
    if (checkForWinner()) {
      return;
    } else if (checkForEmptyCells() === false) {
      game.endGame(true);
    }
  }

  function checkForWinner() {
    if (
      areCellsEqual(0, 1, 2) ||
      areCellsEqual(3, 4, 5) ||
      areCellsEqual(6, 7, 8) ||
      areCellsEqual(0, 3, 6) ||
      areCellsEqual(1, 4, 7) ||
      areCellsEqual(2, 5, 8) ||
      areCellsEqual(0, 4, 8) ||
      areCellsEqual(6, 4, 2)
    ) {
      game.endGame(false);
      return true;
    }

    return false;
  }

  function areCellsEqual(i, j, k) {
    if (
      gameBoardCells[i] === gameBoardCells[j] &&
      gameBoardCells[j] === gameBoardCells[k] &&
      gameBoardCells[i] !== ""
    ) {
      cells[i].classList.add("gameboard__cell--winner");
      cells[j].classList.add("gameboard__cell--winner");
      cells[k].classList.add("gameboard__cell--winner");
      return true;
    }

    return false;
  }

  function checkForEmptyCells() {
    let areEmptyCellsLeft = false;

    gameBoardCells.forEach((cell) => {
      if (cell === "") {
        areEmptyCellsLeft = true;
      }
    });

    return areEmptyCellsLeft;
  }

  return {
    renderGameBoard,
    cleanGameBoard,
    checkForEmptyCells,
  };
})();

// If you need multiples of something (players)
// Create them with factories
const Player = (name, mark) => {
  this.name = name;
  this.mark = mark;
  let nextPlayer = null;

  return { mark, nextPlayer };
};

player1 = Player("Vlad", "X");
player2 = Player("Simona", "0");

player1.nextPlayer = player2;
player2.nextPlayer = player1;

game.currentPlayer = player1;
displayController.changeMessage(`It's ${game.currentPlayer.mark}'s turn!`);

gameBoard.renderGameBoard();
