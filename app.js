
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
        constructor(){
            this.mOrder=0;
            this.mCountWin=0;
            this.mCountLoss=0;
        }
        percentWin(){
            if (this.mCountWin + this.mCountLoss == 0)
                return 0;
            return this.mCountWin / (this.mCountWin + this.mCountLoss)*100;
        }
    }

    function attack(nextMove,nextPlayer,current){
        let lWin=0;
        let lLoss=0;
        current[Math.floor(nextMove/10)][nextMove%10]=nextPlayer;

        let nextNextPlayer='x';
        if(nextPlayer=='x')nextNextPlayer='o';

        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(current[i][j]==null){
                    let predict=[[null,null,null],[null,null,null],[null,null,null]];
                    for(let a=0;a<3;a++){
                        for(let b=0;b<3;b++){
                            predict[a][b]=current[a][b];
                        }
                    }
                    predict[i][j]=nextNextPlayer;
                    if (endYet(nextNextPlayer, predict)) {
                        if(nextNextPlayer=='x')
                            return [0,1];
                        return [1,0];
                    }
                }
            }
        }
        for (let i = 0;i < 3;i++) {
            for (let j = 0; j < 3; j++) {
                if (current[i][j] == null) {
                    let afterCurrent=[[null,null,null],[null,null,null],[null,null,null]];
                    for (let a = 0; a < 3; a++)
                        for (let b = 0; b < 3; b++)
                            afterCurrent[a][b] = current[a][b];
                    let nextPair = attack(i * 10 + j, nextNextPlayer, afterCurrent);
                    lWin += nextPair[0];
                    lLoss += nextPair[1];
                }
            }
        }
        return [lWin, lLoss];
    }

    function bestOption(XandO) {
        optionList=[];
        let instantWin = -1;
        let instantLoss = -1;
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++) {
                if (XandO[i][j] == null) {
                    let current=[[null,null,null],[null,null,null],[null,null,null]];
                    let predictWin=[[null,null,null],[null,null,null],[null,null,null]];
                    let predictLoss=[[null,null,null],[null,null,null],[null,null,null]];
                    for (let a = 0; a < 3; a++)
                        for (let b = 0; b < 3; b++) {
                            current[a][b] = XandO[a][b];
                            predictWin[a][b] = XandO[a][b];
                            predictLoss[a][b] = XandO[a][b];
                        }
                    predictWin[i][j] = 'o';
                    predictLoss[i][j] = 'x';
                    if (endYet('o', predictWin)) {
                        instantWin = i * 10 + j;
                    }
                    if (endYet('x', predictLoss)) {
                        instantLoss = i * 10 + j;
                    }
                    if (endYet('o', predictWin)==false && endYet('x', predictLoss)==false) {
                        let lOption=new Option();
                        lOption.mOrder = i * 10 + j;
                        let thisPair = attack(lOption.mOrder, 'o', current);
                        lOption.mCountWin = thisPair[0];
                        lOption.mCountLoss = thisPair[1];
                        optionList.push(lOption);
                    }
                }
            }
        if (instantWin != -1)
            return instantWin;
        if (instantLoss != -1)
            return instantLoss;
        let lHighest = optionList[0];
        for(let i=0;i<optionList.length;i++){
            if(optionList[i].percentWin()>lHighest.percentWin()){
                lHighest=optionList[i];
            }
        }
        return lHighest.mOrder;
    }



    function BestOption(XandO){
        while(true){
            let x=Math.floor(Math.random()*3);
            let y=Math.floor(Math.random()*3);
            if(XandO[x][y]==null)
                return x*10+y;
        }
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