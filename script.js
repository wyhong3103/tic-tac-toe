/*

    DOM element

*/
let start_player = document.querySelector(".player");
let start_ai = document.querySelector(".ai");
let menu = document.querySelector(".menu");
let game_container = document.querySelector(".game");
let gameboard = document.querySelector(".board");
let exit_btn = document.querySelector(".exit-btn");
let rematch_btn = document.querySelector(".rematch-btn");
let user_name = document.querySelector(".user-stats h3")
let opp_name = document.querySelector(".opponent-stats h3");
let opp_score = document.querySelector(".opp-cnt");
let user_score = document.querySelector(".user-cnt");
let pop_up_box = document.querySelector(".pop-up");
let pop_up_msg = document.querySelector(".pop-up h3");
let pop_up_btn = document.querySelector(".pop-up-btn");
let hide_bg = document.querySelector(".bg-hide")


/*

    MODULE

*/
let DisplayController = function(){
    let _board = [];
    let reset_board = function(){
        //RESET CELL
        gameboard.innerHTML = "";
        _board = [];
        for(let i = 0; i < 3; i++){
            let temp = [];
            for(let j = 0; j < 3; j++){
                let cell = document.createElement("div");
                cell.classList.add("cell");
                gameboard.appendChild(cell);
                temp.push(cell);
            }
            _board.push(temp);
        }
    }

    let freezeBoard = function(){
        for(let i of _board){
            for(let j of i){
                let temp = j.cloneNode(true);
                j.parentNode.replaceChild(temp, j);
            }
        }
    };
    
    let updateScore = function(){
        user_score.textContent = Game.getScore()[0];
        opp_score.textContent = Game.getScore()[1];
    };

    let updateWinner = function(i, win){
        pop_up_msg.textContent = (i % 2 ? (Game.mode === 0 ? "Player 2" : "AI") : "Player 1");
        if (win) pop_up_msg.textContent += ", you won!";
        else pop_up_msg.textContent = "Draw!";
    }

    let changeTurn = function(){
        user_name.classList.toggle("turn");
        opp_name.classList.toggle("turn");
    }

    let startTurn = function(){
        user_name.classList.add("turn");
        opp_name.classList.remove("turn");
    }

    let getBoard = function(){
        return _board;
    };

    let showBg = function(){
        hide_bg.style.display = "block";
    }
    let hideBg = function(){
        hide_bg.style.display = "none";
    }

    let showPopUp = function(){
        pop_up_box.style.display = "flex";
    }

    let mark = function(div){
        let img = document.createElement("img");
        div.classList.add("marked");
        if (Game.getTurn() % 2){
            img.src = "./assets/cross.svg";
            img.alt = "cross.svg";
            div.appendChild(img);
        }else{
            img.src = "./assets/circle.svg";
            img.alt = "circle.svg";
            div.appendChild(img);
        }
    }

    let exit = function(){
        game_container.style.display = 'none';
        menu.style.display = 'grid';
    };
    return {reset_board, exit, mark, getBoard, updateScore, freezeBoard, startTurn, changeTurn, updateWinner, showPopUp, showBg, hideBg};
}();

let Game = function(){
    //0 = player, 1 = ai
    let mode = 0;    
    //even = player's turn, odd = next player/ai's turn
    let turn = 0;

    let _board = [];

    //score
    let _user_score = 0;
    let _opp_score = 0;

    let reset_board = function(){
        _board = [];
        for(let i = 0; i < 3; i++){
            let temp = [];
            for(let j = 0; j < 3; j++){
                temp.push(-1);
            }
            _board.push(temp);
        }
        //reset turn
        turn = 0;
    }

    //Trying to not directly increment the following, or else things would get weird

    let oppwin = function(){
        _opp_score++;
    }

    let userwin = function(){
        _user_score++;
    }

    let nextTurn = function(){
        turn++;
    }


    let getScore = function(){
        return [_user_score,_opp_score];
    }

    let getBoard = function(){
        return _board;
    }

    let getTurn = function(){
        return turn;
    }

    let exit = function(){
        _opp_score = 0;
        _user_score = 0;
    }

    let check_win = function(){
        for(let i = 0; i < 3; i++){
            if (JSON.stringify(_board[i]) === JSON.stringify([1,1,1])) return 1;
            if (JSON.stringify(_board[i]) === JSON.stringify([0,0,0])) return 0;
            if (JSON.stringify([_board[0][i], _board[1][i], _board[2][i]]) == JSON.stringify([1,1,1])) return 1;
            if (JSON.stringify([_board[0][i], _board[1][i], _board[2][i]]) == JSON.stringify([0,0,0])) return 0;
        }
        if (JSON.stringify([_board[0][0],_board[1][1],_board[2][2]]) == JSON.stringify([1,1,1])) return 1;
        if (JSON.stringify([_board[0][0],_board[1][1], _board[2][2]]) == JSON.stringify([0,0,0])) return 0;
        if (JSON.stringify([_board[2][0],_board[1][1],_board[0][2]]) == JSON.stringify([1,1,1])) return 1;
        if (JSON.stringify([_board[2][0],_board[1][1],_board[0][2]]) == JSON.stringify([0,0,0])) return 0;

        //Check for DRAW
        let found_unfilled = false;
        for(let i of _board){
            for(let j of i){
                if (j === -1) found_unfilled = true;
            }
        }
        //-1 = Not the end of the game, 2 = DRAW
        return (found_unfilled ? -1 : 2);
    }

    //Based on MiniMax ALgorithm
    let ai_play = function(r, c, turn){
        let res = check_win();
        if (res != -1){
            //Set it to, 0 = draw, 1 = AI won, -1 = player won
            //Originally, 2 = draw, 1 = Opp won, 0 = player won
            res = (res === 2 ? 0 : (res === 1 ? 1 : -1));
            return [r, c, res];
        } 

        let temp = [];
        for(let i = 0; i < 3; i++){
            let temp1 = [];
            for(let j = 0; j <3; j++){
                temp1.push(null);
            }
            temp.push(temp1);
        }

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3 ; j++){
                if (_board[i][j] != -1) continue;
                _board[i][j] = turn;

                let val = ai_play(i, j, (turn+1)% 2);
                temp[i][j] = val[2];

                _board[i][j] = -1;
            }
        } 

        let bst = [-1,-1,-1];
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if (temp[i][j] === null) continue;
                if (bst[0] === -1){
                    bst = [i,j,temp[i][j]];
                }
                if (turn%2){
                    if (temp[i][j] >= bst[2]) bst = [i, j, temp[i][j]];
                }else{
                    if (temp[i][j] <= bst[2]) bst = [i, j, temp[i][j]];
                }
            }
        }
        return bst;
    };

    return {mode,getTurn,getBoard, reset_board,nextTurn, exit, check_win, oppwin, userwin, getScore, ai_play};
}();


/*

    GFNERAL FUNCTION

*/


let endround = function(){
    let winner = Game.check_win();
    if (winner === -1) return;
    else if (winner === 0){
        Game.userwin();
        DisplayController.updateWinner(0,1);
    }
    else if (winner === 1){
        Game.oppwin();
        DisplayController.updateWinner(1,1);
    }else{
        //DRAW
        DisplayController.updateWinner(-1,0);
    }
	DisplayController.updateScore();
    DisplayController.freezeBoard();
    DisplayController.showBg();
    DisplayController.showPopUp();
}

let init_board = function(){
    DisplayController.reset_board();
    Game.reset_board();
    DisplayController.startTurn();
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            DisplayController.getBoard()[i][j].addEventListener('click', function(){
                //r and c got saved here, which idk how it works
                let r = i, c = j;
                if (this.classList.contains("marked")) return;
                DisplayController.mark(this);
                Game.getBoard()[r][c] = Game.getTurn() % 2;
                Game.nextTurn();
                DisplayController.changeTurn();
                endround();
                if (Game.mode === 1 && Game.check_win() === -1){
                    let move = Game.ai_play(-1,-1,1);
                    let cell = DisplayController.getBoard()[move[0]][move[1]];
                    DisplayController.mark(cell);
                    Game.getBoard()[move[0]][move[1]] = 1;
                    Game.nextTurn();
                    DisplayController.changeTurn();
                    endround();
                }
            });
        }
    }
};


start_player.addEventListener('click', function(){
    Game.mode = 0;
    menu.style.display = 'none';
    game_container.style.display = 'grid';
    opp_name.textContent = "Player 2";
    init_board();
});

start_ai.addEventListener('click', function(){
    Game.mode = 1;
    menu.style.display = 'none';
    game_container.style.display = 'grid';
    opp_name.textContent = "AI";
    init_board();
});

exit_btn.addEventListener('click', function(){
    DisplayController.exit();
    Game.exit();
	DisplayController.updateScore();
});

rematch_btn.addEventListener('click', function(){
    init_board();
});

pop_up_btn.addEventListener('click', function(){
    pop_up_box.style.display = "none";
    DisplayController.hideBg();
});