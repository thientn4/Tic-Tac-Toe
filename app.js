
//setup the game board on the website
    let display_board=document.getElementById("game_board")
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            let square=document.createElement("div");
            square.className="square";
            square.id=j*10+i;

            let ring=document.createElement("div");
            ring.className="ring";
            ring.append(document.createElement("div"));
            square.appendChild(ring);

            let cross=document.createElement("div");
            cross.className="cross";
            cross.append(document.createElement("div"));
            cross.append(document.createElement("div"));
            square.appendChild(cross);

            display_board.appendChild(square);
        }
    }

let game_board=[[null,null,null],[null,null,null],[null,null,null]];

//check if a game end with someone winning
    function endYet(player,XandO,notify=false){
        let countRightSlash = [];
        let countLeftSlash = [];
        for (let i = 0; i < 3; i++) {
            let countRow = [];
            let countLine = [];
            if (XandO[i][i] == player)
                countRightSlash.push(i*10+i);
            if (XandO[i][2-i] == player)
                countLeftSlash.push(i*10+2-i);
            for (let j = 0; j < 3; j++) {
                if (XandO[i][j] == player)
                    countRow.push(i*10+j);
                if (XandO[j][i] == player)
                    countLine.push(j*10+i);
                }
            if (countRow.length == 3) {
                if(notify)
                    for(let k=0;k<3;k++)
                        document.getElementById(countRow[k]).classList.toggle('highlight'); //highlight the winner
                return true;
            }
            if (countLine.length == 3) {
                if(notify)
                    for(let k=0;k<3;k++)
                        document.getElementById(countLine[k]).classList.toggle('highlight'); //highlight the winner
                return true;
            }
        }
        if (countRightSlash.length == 3){
            if(notify)
                for(let k=0;k<3;k++)
                    document.getElementById(countRightSlash[k]).classList.toggle('highlight'); //highlight the winner
            return true;
        }
        if (countLeftSlash.length == 3){
            if(notify)
                for(let k=0;k<3;k++)
                    document.getElementById(countLeftSlash[k]).classList.toggle('highlight'); //highlight the winner
            return true;
        }
        return false;
    }
//check if a game end with a tie
    function tieYet(XandO,notify=false){
        let countBlank = 0;
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (XandO[i][j] == null)
                    countBlank++;
        if(countBlank==0&&notify){
            const notify_square=document.getElementsByClassName('square');
            for(let i=0;i<9;i++){
                square[i].classList.toggle('highlight'); //highlight the tie
            }
        }
        return countBlank == 0;
    }
//check if a game actually end in both cases
    function checkEnd(XandO=game_board){
        if (endYet('x', XandO,true)||endYet('o', XandO,true)||tieYet(XandO,true)){
            document.getElementById("game_board").classList.toggle('game_board_inactive'); //deactivate the square button
            return true;
        }
        return false;
    }
//AI to choose in its turn
    function AI(){
        while(true){
            let x=Math.floor(Math.random()*3);
            let y=Math.floor(Math.random()*3);
            if(game_board[x][y]==null){
                game_board[x][y]='o';
                document.getElementById(x*10+y).classList.toggle('ring_active'); //display on the website
                break;
            }
        }
        checkEnd();
    }
//setup the button on the website
    const square=document.getElementsByClassName('square');
    for(let i=0;i<9;i++){
        square[i].addEventListener('click',function(){
            let coord=parseInt(square[i].id);
            if(game_board[Math.floor(coord/10)][coord%10]==null){
                game_board[Math.floor(coord/10)][coord%10]='x';
                square[i].classList.toggle('cross_active'); //display on the website
                if(checkEnd()==false)AI();
            }
        })
    }

    const restart=document.getElementById('restart');
    restart.addEventListener('click',function(){
        location.reload(); //reload the game website
    })