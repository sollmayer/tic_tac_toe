

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

    fields.forEach(field => {
        field.addEventListener("click", (e) => {
            if(e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index))
            updateGameboard()
        })
    })

    const updateGameboard = () => {
        fields.forEach((field,index) => {
            fields[index].textContent = gameBoard.getField(index)
        })
    }

})()

const Player = sign => {

    const getSign = () => sign;

    return {getSign};
}

const gameController = (()=>{
    const playerX = Player("X");
    const playerO = Player("O");
    let isOver = false;
    let turn = 1;

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        turn++;
        
        if(turn === 9) {
            console.log("Draw")
            isOver = true;
            return;
        }
    }
    const getCurrentPlayerSign = () => {
        return turn % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    return {playRound}
})()