const gameBoard = (()=>{
    let board = new Array(9).fill("");

    const setField = (index, sign) => {
        board[index] = sign;
    }
    const getField = (index) => board[index];
    const reset = () => board.fill("");
    const getBoard = () => board;
    return {setField,getField,reset,getBoard}

})()

const displayController = (()=>{
    const fields = document.querySelectorAll('.field')
    const restart_btn = document.querySelector('.restart_btn')
    const winner_msg = document.querySelector('.winner_msg')
    const startGameBtn = document.querySelector('#startGameBtn')

    fields.forEach(field => {
        field.addEventListener("click", (e) => {
            if(e.target.textContent !== "" || gameController.getIsOver()) return;
            gameController.playRound(parseInt(e.target.dataset.index))
            updateGameboard()
        })
    })

    startGameBtn.addEventListener('click', ()=>{
        document.querySelector('.menu').classList.add('disabled');
        document.querySelector('main').classList.remove('disabled');

    })

    restart_btn.addEventListener('click', ()=>{
        winner_msg.textContent = "";
        fields.forEach((field,index) => {
            fields[index].style = 'none';
        })
        gameController.startNewGame();
    })

    const updateGameboard = () => {
        fields.forEach((field,index) => {
            fields[index].textContent = gameBoard.getField(index);
        })
    }

    const displayWinner = (winner) => {
        if(winner === "Draw") winner_msg.textContent = `It's a Draw` 
        else winner_msg.textContent = `Winner is ${winner}`
    }

    const highlightWinner = (winnerComb) => {
        winnerComb.forEach(index => {
            fields[index].style.backgroundColor ="#03a9f4"
        })
    }
    return {updateGameboard,displayWinner, highlightWinner}
})()

const Player = (name,sign) => {
    const getSign = () => sign;
    const getName = () => name;
    return {getSign,getName};
}

const gameController = (()=>{
    let playerX = Player('Player1',"X");
    let playerO = Player('Player2',"O");
    document.querySelector('#playerOneName')
        .addEventListener('input',(e)=>playerX = Player(e.target.value, "X"))
    document.querySelector('#playerTwoName')
        .addEventListener('input',(e)=>playerO = Player(e.target.value, "O"))

    let isOver = false;
    let turn = 1;

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if(checkWinner(fieldIndex)){
            displayController.displayWinner(getWinnerName());
            isOver = true;
            return;
        }
        if(turn === 9) {
            displayController.displayWinner("Draw");
            isOver = true;
            return;
        }
        turn++;

    }
    const getCurrentPlayerSign = () => {
        return turn % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }
    const getWinnerName = () => {
        return turn % 2 === 1 ? playerX.getName() : playerO.getName();
    }
    const getIsOver = () => isOver;
    const checkWinner = (fieldIndex) => {
        const winFieldsCombinations = [
            [0, 1, 2],[3, 4, 5],[6, 7, 8],
            [0, 3, 6],[1, 4, 7],[2, 5, 8],
            [0, 4, 8],[2, 4, 6]
        ];
        let winnerComb = [];
        // console.log(winFieldsCombinations.filter(combination => combination.includes(fieldIndex))
        // .some(combination => 
        //     combination.every(index => {
        //         if(gameBoard.getField(index) === getCurrentPlayerSign()){
        //             winnerComb = combination;
        //             return true;
        //         }
        //     }) ))
        // console.log(winnerComb)
        return winFieldsCombinations.filter(combination => combination.includes(fieldIndex))
                                    .some(combination => {
                                        if(combination.every(index => gameBoard.getField(index) === getCurrentPlayerSign())){
                                            displayController.highlightWinner(combination)
                                            return true;
                                        }
                                    })
    }

    const startNewGame = () => {
        gameBoard.reset();
        displayController.updateGameboard();
        turn = 1;
        isOver = false;
    }
    return {playRound,getIsOver,startNewGame}
})()