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
    const changeMode = document.querySelector('#change_mode')

    fields.forEach(field => {
        field.addEventListener("click", (e) => {
            if(e.target.textContent !== "" || gameController.getIsOver()) return;
            gameController.playRound(parseInt(e.target.dataset.index),gameController.getCurrentMode())
            updateGameboard()
        })
    })

    startGameBtn.addEventListener('click', ()=>{
        document.querySelector('.menu').classList.add('disabled');
        document.querySelector('main').classList.remove('disabled');

    })
    changeMode.addEventListener('click', ()=>{
        gameController.changeMode()
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
    let mode = "Players";
    let playerOne = Player('Player1',"X");
    let playerTwo = Player('Player2',"O");
    document.querySelector('#playerOneName')
        .addEventListener('input',(e)=>playerOne = Player(e.target.value, "X"))
    document.querySelector('#playerTwoName')
        .addEventListener('input',(e)=>playerTwo = Player(e.target.value, "O"))

    let isOver = false;
    let round = 1;
    let turn = "PlayerOne"
    const changeMode = () => {
        mode = "Computer";
        playerTwo = Player('Computer',"O");
    }
    const getCurrentMode = () => mode;
    const changeTurn = () => {
        turn = turn === "PlayerOne" ?  "PlayerTwo" : "PlayerOne";
        round++;
    }
    const playRound = (fieldIndex, currentMode) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if(checkWinner(gameBoard.getBoard(), getCurrentPlayerSign())){
            displayController.highlightWinner(winnerComb)
            finishGame(getWinnerName());
            return;
        }
        if(round === 9) {
            finishGame("Draw")
        }
        if(currentMode === "Computer" && getCurrentPlayerSign() === playerOne.getSign()) {
            changeTurn();
            computerPlays();
        }
        changeTurn();
    }

    const finishGame = (result) => {
        displayController.displayWinner(result);
        isOver = true;
    }
    const computerPlays = () =>{
        
        let board = gameBoard.getBoard().reduce((arr,item,index) => {
            item == "" ? arr.push(item.replace("",index)):arr.push(item)
            return arr;
        },[])

        let bestMove = minimax(board,"O").index
        console.log(bestMove);
        gameBoard.setField(bestMove,playerTwo.getSign())
        if(checkWinner(gameBoard.getBoard(),getCurrentPlayerSign())){
            displayController.displayWinner(getWinnerName());
            displayController.highlightWinner(winnerComb)
            isOver = true;
            return;
        }
    }

    const minimax = (newBoard, player) => {
        let availSpots = newBoard.filter(s => s != "O" && s != "X");

        if(checkWinner(newBoard, "X")) return {score:-10}
        else if(checkWinner(newBoard, "O")) return {score:10}
        else if(availSpots.length === 0) return {score:0}

        let moves = [];

        for (const element of availSpots){
            let move = {};
            move.index = newBoard[element];
      
            newBoard[element] = player;
        
            if (player == "O"){
                let result = minimax(newBoard, "X");
                move.score = result.score;
            }
            else{
                let result = minimax(newBoard, "O");
                move.score = result.score;
            }
        
            newBoard[element] = move.index;
            moves.push(move);
        }
        // if it is the computer's turn loop over the moves and choose the move with the highest score
        let bestMove;
        if(player === "O"){
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
            }
        }else{

        // else loop over the moves and choose the move with the lowest score
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
            }
        }

        return moves[bestMove];
        
    }
    
    const getCurrentPlayerSign = () => {
        return turn === "PlayerOne" ? playerOne.getSign() : playerTwo.getSign();
    }
    const getWinnerName = () => {
        return turn === "PlayerOne" ? playerOne.getName() : playerTwo.getName();
    }

    const getIsOver = () => isOver;

    let winnerComb;
    const checkWinner = (board, sign) => {
        const winFieldsCombinations = [
            [0, 1, 2],[3, 4, 5],[6, 7, 8],
            [0, 3, 6],[1, 4, 7],[2, 5, 8],
            [0, 4, 8],[2, 4, 6]
        ];
        return winFieldsCombinations.reduce((result, comb) => {
            if(comb.every(field => board[field] == sign)) {
                result = true;
                winnerComb = comb;
            };
            return result;
        },false)

    }

    const startNewGame = () => {
        gameBoard.reset();
        displayController.updateGameboard();
        round = 1;
        turn = "PlayerOne"
        isOver = false;
    }

    return {playRound,getIsOver,startNewGame,changeMode,getCurrentMode}
})()

