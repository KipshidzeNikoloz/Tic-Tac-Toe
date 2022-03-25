

const gameBoard = (function(){
    let board = ["", "", "",
                 "", "", "",
                 "", "", ""];

    const getBoard = () => {
        return board;
    }
    
    const resetBoard = () => {
        board = ["", "", "",
                 "", "", "",
                 "", "", ""]
    }

    const setFlag = (index, flag) => {
        if (index > board.length) return;
        return board[index] = flag;
    }

    return { getBoard, resetBoard, setFlag}

})();

// control DOM elements/ scoreboard/ final result

const displayController = (function(){

})()

// Game controller, round play, score, check winner, reset

const gameController = (function(){

})()

function player(flag) {
    return {flag}
}

let player1 = player('X');
let player2 = player('O')

console.log(player1);