//DOM element
let start_player = document.querySelector(".player");
let start_ai = document.querySelector(".ai");
let menu = document.querySelector(".menu");
let game_container = document.querySelector(".game");
let gameboard = document.querySelector(".board");
let exit_btn = document.querySelector(".exit-btn");
let rematch_btn = document.querySelector(".rematch-btn");
let opp_name = document.querySelector(".opponent-stats h3");
let opp_score = document.querySelector(".opp-cnt");
let user_score = document.querySelector(".user-cnt");
let d_board = [];
let g_board = [];

let DisplayController = function(){
    let reset_board = function(){
        //RESET CELL
        gameboard.innerHTML = "";
        d_board = [];
        for(let i = 0; i < 3; i++){
            let temp = [];
            for(let j = 0; j < 3; j++){
                let cell = document.createElement("div");
                cell.classList.add("cell");
                gameboard.appendChild(cell);
                temp.push(cell);
            }
            d_board.push(temp);
        }
    }

    let exit = function(){
        game_container.style.display = 'none';
        menu.style.display = 'grid';
    };
    return {reset_board, exit};
}();

let Game = function(){
    //0 = player, 1 = ai
    let mode = 0;    
    //even = player's turn, odd = next player/ai's turn
    let turn = 0;

    //score
    let _user_score = 0;
    let _opp_score = 0;

    let reset_board = function(){
        g_board = [];
        for(let i = 0; i < 3; i++){
            let temp = [];
            for(let j = 0; j < 3; j++){
                temp.push(-1);
            }
            g_board.push(temp);
        }
        turn = 0;
    }

    let exit = function(){
        _opp_score = 0;
        _user_score = 0;
    }

    let getTurn = function(){
        return turn;
    }

    let nextTurn = function(){
        turn++;
    }

    let oppwin = function(){
        _opp_score++;
    }

    let userwin = function(){
        _user_score++;
    }

    let getScore = function(){
        return [_user_score,_opp_score];
    }

    let check_win = function(){
        for(let i = 0; i < 3; i++){
            if (JSON.stringify(g_board[i]) === JSON.stringify([1,1,1])) return 1;
            if (JSON.stringify(g_board[i]) === JSON.stringify([0,0,0])) return 0;
            if (JSON.stringify([g_board[0][i], g_board[1][i], g_board[2][i]]) == JSON.stringify([1,1,1])) return 1;
            if (JSON.stringify([g_board[0][i], g_board[1][i], g_board[2][i]]) == JSON.stringify([0,0,0])) return 0;
        }
        if (JSON.stringify([g_board[0][0],g_board[1][1],g_board[2][2]]) == JSON.stringify([1,1,1])) return 1;
        if (JSON.stringify([g_board[0][0],g_board[1][1],g_board[2][2]]) == JSON.stringify([0,0,0])) return 0;
        if (JSON.stringify([g_board[2][0],g_board[1][1],g_board[0][2]]) == JSON.stringify([1,1,1])) return 1;
        if (JSON.stringify([g_board[2][0],g_board[1][1],g_board[0][2]]) == JSON.stringify([0,0,0])) return 0;
        return -1;
    }

    return {mode,getTurn, reset_board,nextTurn, exit, check_win, oppwin, userwin, getScore};
}();

let endround = function(){
    let winner = Game.check_win();
    if (winner === -1) return;
    else if (winner === 0) Game.userwin();
    else Game.oppwin()
    user_score.textContent = Game.getScore()[0];
    opp_score.textContent = Game.getScore()[1];
    init_board();
}

let init_board = function(){
    DisplayController.reset_board();
    Game.reset_board();
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            d_board[i][j].addEventListener('click', function(){
                let r = i, c = j;
                if (this.classList.contains("marked")) return;
                if (Game.mode === 0){
                    let img = document.createElement("img");
                    this.classList.add("marked");
                    if (Game.getTurn() % 2){
                        img.src = "./assets/cross.svg";
                        img.alt = "cross.svg";
                        this.appendChild(img);
                    }else{
                        img.src = "./assets/circle.svg";
                        img.alt = "circle.svg";
                        this.appendChild(img);
                    }
                }
                g_board[r][c] = Game.getTurn() % 2;
                Game.nextTurn();
                endround();
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
});

rematch_btn.addEventListener('click', function(){
    init_board();
});
