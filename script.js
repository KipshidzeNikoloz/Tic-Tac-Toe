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

const Player = (flag) => {
    let _flag = flag;
    const getFlag = () => _flag;
    return { getFlag }
}

const gameController =  (function(){
  
    // initialize players
    const _player1 = Player("X")
    const _player2 = Player("O")

    const getPlayer1 = () => _player1;
    const getPlayer2 = () => _player2;

    //init state

    let round = 1;
    let isOver = false;

    // get current player

    const getCurrentFlag = () => {
        return round % 2 === 1 ? _player1.getFlag() : _player2.getFlag();
    };
    
    // play round

    const playRound = (index) => {
        gameBoard.setBoard(index, getCurrentFlag()); 
        if (checkWin()) {
            isOver = true;
            return;
        }
        if (checkDraw()) {
            isOver = true;
            return;
        }
        round++;
    }

    // check win

    const _checkRows = () => {
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = i * 3; j < i * 3 + 3; j++) {
                row.push(gameBoard.getBoard(j));
            }
            if (row.every(field => field == 'X') || row.every(field => field == 'O')) {
                return true;
            }
        } return false;
    }
    const _checkColumns = () => {
        for (let i = 0; i < 3; i++) {
            let column = []
            for (let j = 0; j < 3; j++) {
                column.push(gameBoard.getBoard(i + 3 * j));
            }
            if (column.every(field => field == 'X') || column.every(field => field == 'O')) {
                return true;
            }
        } return false;
    }
    const _checkDiagonals = () => {
        diagonal1 = [gameBoard.getBoard(0), gameBoard.getBoard(4), gameBoard.getBoard(8)];
        diagonal2 = [gameBoard.getBoard(6), gameBoard.getBoard(4), gameBoard.getBoard(2)];
        if (diagonal1.every(field => field == 'X') || diagonal1.every(field => field == 'O')) {
            return true;
        }
        else if (diagonal2.every(field => field == 'X') || diagonal2.every(field => field == 'O')) {
            return true;
        }
    }

    const checkWin = (board) => {
        if (_checkRows(board) || _checkColumns(board) || _checkDiagonals(board)) {
            return true;
        }
        return false;
    }

    const checkDraw = (board) => {
        if (checkWin(board)) {
            return false;
        }
        for (let i = 0; i < 9; i++) {
            const field = gameBoard.getBoard(i);
            if (field == undefined) {
                return false;
            }
        }
        return true;
    }

    // check if game is over

    const checkOver = () => isOver;

    const reset = () => {
        round = 1;
        isOver = false;
    }

    return {
        getPlayer1,
        getPlayer2,
        checkWin,
        checkDraw, 
        checkOver,
        reset,
        playRound,
    }
})();

const displayController = (function(){
    const fields = document.querySelectorAll(".field");
    const resetButton = document.querySelector('.resetButton')

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

    const updateDisplay = () => {
        for (let i = 0; i < fields.length; i++) {
            fields[i].textContent = gameBoard.getBoard(i);
          }
    }
})();