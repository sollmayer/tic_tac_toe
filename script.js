const gameBoard = (()=>{
    let board = new Array(9).fill(null);

    const setField = (index, sign) => {
        board[index] = sign;
    }
    const getField = (index) => board[index];
    const reset = () => board.fill("");

    return {setField,getField,reset}

})()

const displayController = (()=>{
    const fields = document.querySelectorAll('.field')
    const restart_btn = document.querySelector('.restart_btn')
    const winner_msg = document.querySelector('.winner_msg')

    fields.forEach(field => {
        field.addEventListener("click", (e) => {
            if(e.target.textContent !== "" || gameController.getIsOver()) return;
            gameController.playRound(parseInt(e.target.dataset.index))
            updateGameboard()
        })
    })

    restart_btn.addEventListener('click', ()=>{
        winner_msg.textContent = "";
        gameController.startNewGame();
    })

    const updateGameboard = () => {
        fields.forEach((field,index) => {
            fields[index].textContent = gameBoard.getField(index)
        })
    }

    const displayWinner = (winner) => {
        if(winner === "Draw") winner_msg.textContent = `It's a Draw` 
        else winner_msg.textContent = `Winner is ${winner} player`
    }

    return {updateGameboard,displayWinner}
})()

const Player = sign => {
    // const getSign = () => sign;
    return {getSign : () => sign};
}

const gameController = (()=>{
    const playerX = Player("X");
    const playerO = Player("O");
    let isOver = false;
    let turn = 1;

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if(checkWinner(fieldIndex)){
            console.log(`Winner is ${getCurrentPlayerSign()} player`)
            displayController.displayWinner(getCurrentPlayerSign());
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
    const getIsOver = () => isOver;
    const checkWinner = (fieldIndex) => {
        const winFieldsCombinations = [
            [0, 1, 2],[3, 4, 5],[6, 7, 8],
            [0, 3, 6],[1, 4, 7],[2, 5, 8],
            [0, 4, 8],[2, 4, 6]
        ];

        return winFieldsCombinations.filter(combination => combination.includes(fieldIndex))
                                    .some(combination => 
                                        combination.every(index => gameBoard.getField(index) === getCurrentPlayerSign()) )
    }

    const startNewGame = () => {
        gameBoard.reset();
        displayController.updateGameboard();
        turn = 1;
        isOver = false;
    }
    return {playRound,getIsOver,startNewGame}
})()