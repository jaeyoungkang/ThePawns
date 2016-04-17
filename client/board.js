var BLUE_TEAM = 10;
var RED_TEAM = 20;
var phaseOfBattle = 0;
var myPhase = 0;
var PHASE_READY = 1;
var PHASE_START =2;

function startBattle(teamColor) {
    myPhase = teamColor;
    waitingPhase();

    $('.observer').click(function(elmnt){
        console.log("Observer was clicked - " + elmnt.target.value);
        var index = parseInt(elmnt.target.value);
        controll_pawns(index, "O");
    });

    $('.pawn').click(function(elmnt){
        console.log("Pawn was clicked - " + elmnt.target.value);
        var index = parseInt(elmnt.target.value);
        controll_pawns(index, "P");
    });

    setInterval(draw, 1000);
}

var serverListener =  null;
function listenServer() {    
    if(serverListener == null) {
        serverListener = setInterval(updateInfo, 1000);
    }
}

function GAME_OBJECT (_type, _index, _color, _selected_color) {
    this.type = _type;
    this.index = parseInt(_index);
    this.color = _color;
    this.normal_color = _color;
    this.selected_color = _selected_color;

    this.updateIndex = function(_index) {
        this.index = parseInt(_index);
    };

    this.setSelect = function(value) {
        if(value == true) {
            this.color = this.selected_color;
        } else {
            this.color = this.normal_color;
        }
    }
};

var pawn_normal = null;
var pawn_observer = null;
var pawn_enemy = null;

var pawn_selected = null;

function InitObjects(postions) {
    color = 'blue'
    selected_color = 'lightBlue'
    color_enemy = 'red'
    selected_color_enemy = 'pink'
    if(myPhase == RED_TEAM) {
        color = 'red'
        selected_color = 'pink'        
        color_enemy = 'blue'
        selected_color_enemy = 'lightBlue'
    }

    pawn_normal = new GAME_OBJECT('P', postions[0], color, selected_color);
    pawn_observer = new GAME_OBJECT('O', postions[1], color, selected_color);

    pawn_enemy = new GAME_OBJECT('P', postions[2], color_enemy, selected_color_enemy);
}

function controll_pawns(pawn_index, pawn_type) {
    if(pawn_selected != null && pawn_selected.type != pawn_type) {
        pawn_selected.setSelect(false);
        pawn_selected = null;
    }

    if(pawn_selected != null) {
        if(validatePostionToMove(pawn_index)) {
            pawn_selected.updateIndex(pawn_index);
         }
     }

    if(pawn_type == "O") {
        if(pawn_observer.index == pawn_index) {
            pawn_selected = pawn_observer;
        }
    } else if(pawn_type == "P") {
        if(pawn_normal.index == pawn_index) {
            pawn_selected = pawn_normal;
        }
    }

    if(pawn_selected != null) {
        pawn_selected.setSelect(true);
    }

    postInfo();
}

function validatePostionToMove(index) {
    if( pawn_selected.index + 1== index ||
        pawn_selected.index + 10== index ||
        pawn_selected.index - 1== index ||
        pawn_selected.index - 10== index)
        return true;

    return false;
}

var frist_turn = true;

function draw() {
    clearBoard();
    phaseOfBattleText = 'WAITING OTHER PLAYER'
    if(phaseOfBattle == PHASE_READY) {
        phaseOfBattleText = 'READY TO START'
    } else if(phaseOfBattle == BLUE_TEAM) {
        phaseOfBattleText = 'BLUE PHASE'
        if(frist_turn) {
            window.alert("START!!");
            frist_turn = false;
        }
    } else if(phaseOfBattle == RED_TEAM) {
        phaseOfBattleText = 'RED PHASE'
    }


    document.getElementById("textPhase").innerHTML = phaseOfBattleText;

    if(pawn_normal.index != -1) {
        btnId = "#" + pawn_normal.index.toString() + "_" + pawn_normal.type;
        $(btnId).css( {"border-radius":"50%", "background":pawn_normal.color} );
    }
    if(pawn_observer.index != -1) {
        btnId = "#" + pawn_observer.index.toString()+ "_" + pawn_observer.type;
        $(btnId).css( {"border-radius":"50%", "background":pawn_observer.color} );
    }

    if(pawn_enemy.index != -1) {
        btnId = "#" + pawn_enemy.index.toString() + "_" + pawn_enemy.type;
        $(btnId).css( {"border-radius":"50%", "background":pawn_enemy.color} );
    }

 
    disableBtn = phaseOfBattle != myPhase;
    console.log("disableBtn " + disableBtn);
    for(var i=0; i<rowOfBoard; i++) {
        for(var j=0; j<colOfBoard; j++) {
            if(i==0) btnId = "#" + j.toString() + "_O";
            else  btnId = "#" + i.toString() + j.toString() + "_O";
            $(btnId).prop("disabled", disableBtn);
            if(i==0) btnId = "#" + j.toString() + "_P";
            else  btnId = "#" + i.toString() + j.toString() + "_P";
            $(btnId).prop("disabled", disableBtn);
        }
    }    
}

var rowOfBoard = 5;
var colOfBoard = 3;

function clearBoard() {
    for(var i=0; i<rowOfBoard; i++) {
        for(var j=0; j<colOfBoard; j++) {
            if(i==0) btnId = "#" + j.toString() + "_O";
            else  btnId = "#" + i.toString() + j.toString() + "_O";
            $(btnId).css( {"border-radius":"0%", "background":"white"} );
            if(i==0) btnId = "#" + j.toString() + "_P";
            else  btnId = "#" + i.toString() + j.toString() + "_P";
            $(btnId).css( {"border-radius":"0%", "background":"white"} );
        }
    }
}

function makeposInfo() {
    var posInfo = ""
    if(pawn_normal.index != -1) posInfo += pawn_normal.index.toString();
    if(pawn_observer.index != -1) posInfo += " " + pawn_observer.index.toString();
    if(pawn_enemy.index != -1) posInfo += " " + pawn_enemy.index.toString();

    return posInfo;
}

function updateObjects(postions) {
    if(pawn_normal) pawn_normal.updateIndex(postions[0]);
    if(pawn_normal) pawn_observer.updateIndex(postions[1]);
    if(pawn_normal) pawn_enemy.updateIndex(postions[2]);
}


function changePhase(nextPhase) {
    if(nextPhase == myPhase) {
        if(serverListener != null) {
            clearInterval(serverListener);
            serverListener = null;
        }
        $("#endPhase").prop("disabled", false);
    } else {
        listenServer();
    }

    phaseOfBattle = nextPhase;   
}

function drawObservers() {
  if(observers.length == 0) return;

  btnId = "#" + observers[0].index.toString()+ "_O";
  $(btnId).css( {"border-radius":"50%", "background":observers[0].color} );
}

var SERVER_DOMAIN = 'http://127.0.0.1:8000/';
function postInfo() {
    var myTeam = 'BLUE'
    if(myPhase == RED_TEAM) {
        myTeam = 'RED'
    }

    var postions = makeposInfo();
    $.post(SERVER_DOMAIN + 'post_info/map/', {info:postions, team:myTeam}, function(data) {
        console.log('posted ' + postions);
        updateInfo();
    })
}

function updateInfo() {
    var myTeam = 'BLUE'
    if(myPhase == RED_TEAM) {
        myTeam = 'RED'
    }

    $.get(SERVER_DOMAIN + 'get_info/map/', {team:myTeam}, function(data) {
        console.log('updated ' + data);
        postions = data.split(' ').map(function(n){return parseInt(n);})
        changePhase(postions.shift());        
        updateObjects(postions);
    })
}

function getInfo() {
    var myTeam = 'BLUE'
    if(myPhase == RED_TEAM) {
        myTeam = 'RED'
    }    

    $.get(SERVER_DOMAIN + 'get_info/map/', {team:myTeam}, function(data) {
        console.log('get initial Info ' + data);
        postions = data.split(' ').map(function(n){return parseInt(n);})
        changePhase(postions.shift());
        InitObjects(postions);
    })
}

function endPhase() {
    $("#endPhase").prop("disabled", true);
    $.post(SERVER_DOMAIN + 'post_info/phase/end/', function(data) {
        updateInfo();
    })
}

function waitingPhase() {
    var myTeam = 'BLUE'
    if(myPhase == RED_TEAM) {
        myTeam = 'RED'
    }    

    $.post(SERVER_DOMAIN + 'post_info/phase/waiting/', {team:myTeam}, function(data) {
        getInfo();
    })
}