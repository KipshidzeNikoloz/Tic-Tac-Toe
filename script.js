const gameBoard = (function(){
    let _board = new Array(9);
    const getBoard = (index) => _board[index];
    const setBoard = (index, sign) => _board[index] = sign 
    const resetBoard = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    }
    return {getBoard, resetBoard, setBoard}
})();

const Player = (flag, score) => {
    let _flag = flag;
    let _score = score;
    const getScore = () => _score
    const addScore = () => score = _score++;
    const getFlag = () => _flag;
    const resetScore = () => _score = 0;
    return { 
        getFlag, 
        getScore, 
        addScore,
        resetScore}
}

const gameController =  (function(){
  
    // initialize players
    const _player1 = Player("X", 0)
    const _player2 = Player("O", 0)

    // init state

    let round = 1;
    let isOver = false;

    // get current player

    const addPlayerScore = () => {
        return round % 2 === 1 ? _player1.addScore() : _player2.addScore()
        }

    const getCurrentFlag = () => {
        return round % 2 === 1 ? _player1.getFlag() : _player2.getFlag();
    };
    
    // play round

    const playRound = (index) => {
        gameBoard.setBoard(index, getCurrentFlag()); 
        if (checkWin()) {
            addPlayerScore();
            setPlayerScore()
            setWinEndGame();
            restartMessage()
            isOver = true;
            return;
        }
        if (checkDraw()) {
            setDrawEndGame();
            restartMessage()
            isOver = true;
            return;
        }
        round++;
        setCurrentPlayer();
    }

    // check win

    const _checkDiagonal = () => {
        diagonal1 = [gameBoard.getBoard(0), gameBoard.getBoard(4), gameBoard.getBoard(8)];
        diagonal2 = [gameBoard.getBoard(2), gameBoard.getBoard(4), gameBoard.getBoard(6)];
        if (diagonal1.every(field => field == 'X') || diagonal1.every(field => field == 'O')) {
            return true;
        }
        else if (diagonal2.every(field => field == 'X') || diagonal2.every(field => field == 'O')) {
            return true;
        };
    };

    const _checkRow = () => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let k = i * 3; k < i * 3 + 3; k++) { 
                // [0, 1, 2]; [3, 4, 5]; [6, 7, 8]
                // can be simplified to 
                // row1 = [gameBoard.getBoard(0), gameBoard.getBoard(1), gameBoard.getBoard(2)]
                // row2 = [gameBoard.getBoard(3), gameBoard.getBoard(4), gameBoard.getBoard(5)]
                // row3 = [gameBoard.getBoard(6), gameBoard.getBoard(7), gameBoard.getBoard(8)]
                row.push(gameBoard.getBoard(k));
            }
            if (row.every(field => field == 'X') || row.every(field => field == 'O')) {
                return true;
            }   //if using commented code "else if" is required
        } return false;
    };

    const _checkColumn = () => {
        for (let i = 0; i < 3; i++) {
            let column = [];
            for (let k = 0; k < 3; k++) {
                // [0, 3, 6]; [2, 4, 7]; [3, 5, 8]
                // can be simplified to
                // column1 = [gameBoard.getBoard(0), gameBoard.getBoard(3), gameBoard.getBoard(6)]
                // column2 = [gameBoard.getBoard(2), gameBoard.getBoard(4), gameBoard.getBoard(7)]
                // column3 = [gameBoard.getBoard(3), gameBoard.getBoard(5), gameBoard.getBoard(8)] 
                column.push(gameBoard.getBoard(i + 3 * k));
            }
            if (column.every(field => field == 'X') || column.every(field => field == 'O')) {
                return true;
            }
        } return false;
    };

    const checkWin = (board) => {
        if (_checkDiagonal(board) || _checkColumn(board) || _checkRow(board)) {
            return true;
        };
        return false;
    };

    const checkDraw = (board) => {
        if (checkWin(board)) {
            return false;
        };
        for (let i = 0; i < 9; i++) {
            const field = gameBoard.getBoard(i);
            if (field == undefined) {
                return false;
            }
        };
        return true;
    };

    // check if game is over

    const checkOver = () => isOver;

    const reset = () => {
        round = 1;
        isOver = false;
        displayController.setNotifier("");
        setCurrentPlayer()
    }

    // Play again

    
    const restartMessage = () => {
        if (_player1.getScore() == 5 || _player2.getScore() == 5) {
            displayController.setEndGameMessage(`Player ${getCurrentFlag()} is the Winner!`)
            const endGameWindow = document.querySelector(".endGameWindow");
            const fullContainer = document.querySelector(".fullContainer");
            fullContainer.style.filter = 'blur(2px)';
            endGameWindow.style.display = 'flex';
        } 
    }

    const restartGame = () => {
        _player1.resetScore();
        _player2.resetScore();
        setCurrentPlayer();
        setPlayerScore();
        round = 1;
        isOver = false;
        document.querySelector('.endGameWindow').hidden = false;
    }

    // textContent 

    const setCurrentPlayer = () => {
        displayController.setNotifier(`Player ${getCurrentFlag()}'s Turn`)
    }

    const setWinEndGame = () => {
        displayController.setNotifier(`Player ${getCurrentFlag()} Won`)
    }

    const setDrawEndGame = () => {
        displayController.setNotifier("It's a Draw")
    }

    const setPlayerScore = () => {
        displayController.setPlayer1Score(`${_player1.getScore()}`)
        displayController.setPlayer2Score(`${_player2.getScore()}`)
    }

    return {
        checkWin,
        checkDraw, 
        checkOver,
        reset,
        playRound,
        setPlayerScore,
        restartGame,
    }
})();

const displayController = (function(){
    const fields = document.querySelectorAll(".field");
    const resetButton = document.querySelector(".resetButton");
    const restartButton = document.querySelector(".restartButton")
    const playerTurn = document.querySelector(".playerTurn");
    const endGameMessage = document.querySelector(".endGameMessage")
    const player1Score = document.querySelector(".player1Score")
    const player2Score = document.querySelector(".player2Score")
    const endGameWindow = document.querySelector(".endGameWindow");            
    const fullContainer = document.querySelector(".fullContainer");


    fields.forEach((field) => {
        field.addEventListener("click", (e) => {
            if (e.target.textContent !== "" || gameController.checkOver()) return;
            gameController.playRound(e.target.dataset.index);
            updateDisplay();
        })
    })

    resetButton.addEventListener("click", (e) => {
        gameBoard.resetBoard();
        gameController.reset();
        updateDisplay();
    })
    
    restartButton.addEventListener("click", (e) => {
        gameBoard.resetBoard();
        gameController.restartGame();
        updateDisplay();
        endGameWindow.style.display = 'none'
        fullContainer.style.filter = `blur(0)`;

    })

    const updateDisplay = () => {
        for (let i = 0; i < fields.length; i++) {
            fields[i].textContent = gameBoard.getBoard(i);
          }
    }

    const setNotifier = (txt) => {
        playerTurn.textContent = txt;
    }

    const setEndGameMessage = (txt) => {
        endGameMessage.textContent = txt;
    }

    const setPlayer1Score = (txt) => {
        player1Score.textContent = txt;
    }

    const setPlayer2Score = (txt) => {
        player2Score.textContent = txt;
    }
    
    return {
        setNotifier, 
        setEndGameMessage,
        setPlayer1Score, 
        setPlayer2Score}
})();