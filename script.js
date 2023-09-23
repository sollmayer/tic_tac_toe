

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

