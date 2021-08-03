
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

//AI implementation
    class Option{
        constructor(inOrder=0,inWin=0,inLoss=0){
            this.mOrder=inOrder;
            this.mCountWin=inWin;
            this.mCountLoss=inLoss;
        }
        percentWin(){
            if (this.mCountWin + this.mCountLoss == 0)
                return 0;
            return (this.mCountWin / (this.mCountWin + this.mCountLoss))*100;
        }
    }

    function attack(nextMove,nextPlayer,current,step=5){
        let lWin=0;
        let lLoss=0;
        current[Math.floor(nextMove/10)][nextMove%10]=nextPlayer;
        let nextNextPlayer=(nextPlayer=='x')?'o':'x';
        for (let i = 0;i < 3;i++) {
            for (let j = 0; j < 3; j++) {
                if (current[i][j] == null) {
                    current[i][j]=nextNextPlayer;
                    if (endYet(nextNextPlayer, current)){
                        current[i][j]=null;
                        current[Math.floor(nextMove/10)][nextMove%10]=null;
                        return [(nextNextPlayer!='x')*step,(nextNextPlayer=='x')*step];
                    }
                    current[i][j]=null;

                    let nextPair = attack(i * 10 + j, nextNextPlayer, current,step-1);
                    lWin += nextPair[0];
                    lLoss += nextPair[1];
                }
            }
        }
        current[Math.floor(nextMove/10)][nextMove%10]=null;
        return [lWin, lLoss];
    }

    function bestOption(XandO) {
        if(game_board[1][1]==null)return 11;
        optionList=[];
        let instantLoss = -1;
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (XandO[i][j] == null) {
                    XandO[i][j] = 'o';
                    predictWin=endYet('o', XandO);
                    XandO[i][j] = 'x';
                    predictLoss=endYet('x', XandO);
                    XandO[i][j] = null;
                    if (predictWin)return i*10+j;
                    if (predictLoss)instantLoss=i*10+j;
                    else if(instantLoss==-1){
                        let thisPair = attack(i * 10 + j, 'o', XandO);
                        optionList.push(new Option(i * 10 + j,thisPair[0],thisPair[1]));
                    }
                }
        if (instantLoss != -1)return instantLoss;
        let lHighest = optionList[0];
        for(let i=0;i<optionList.length;i++){
            if(optionList[i].percentWin()>lHighest.percentWin()){
                lHighest=optionList[i];
            }
        }
        return lHighest.mOrder;
    }




//AI to choose in its turn
    function AI(){
        let best_choice=bestOption(game_board);
        game_board[Math.floor(best_choice/10)][best_choice%10]='o';
        document.getElementById(best_choice).classList.toggle('ring_active'); //display on the website
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