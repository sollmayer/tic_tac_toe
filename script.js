

const gameBoard = (()=>{
    let board = new Array(9).fill(null);

    const setField = (index, sign) => {
        board[index] = sign;
    }
    const getField = (index) => {
        return board[index];
    }
    const reset = () => {
        board.fill("");
    }

    return {setField,getField,reset}

})()

const displayController = (()=>{
    const fields = document.querySelectorAll('.field')

    fields.forEach(field => {
        field.addEventListener("click", (e) => {
            if(e.target.textContent !== "") return;

        })
    })

    const updateGameboard = () => {
        fields.forEach((field,index) => {
            fields[index].textContent = gameBoard.getField(index)
        })
    }

})()

const Player = (sign) => {
    this.sign = sign;

    const getSign = () => this.sign;

    return {getSign};
}