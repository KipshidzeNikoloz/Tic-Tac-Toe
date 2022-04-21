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