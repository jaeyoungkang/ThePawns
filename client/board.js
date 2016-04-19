var BLUE_TEAM = 10;
var RED_TEAM = 20;
var phaseOfBattle = 0;
var myPhase = 0;
var PHASE_READY = 1;
var PHASE_BLUE_WIN = 2;
var PHASE_RED_WIN = 3;

var LOG_DEBUG = 0;
var LOG_NORMAL = 1;

var countOfMoveNP = 0;
var countOfMoveOP = 0;
var MAX_MOVE_COUNT = 1;

var battle_number = 0;

function printlog(msg, id) {
    if( id == LOG_DEBUG ) {
        console.log(msg);
    }
}

function loadData() {
    var account = localStorage.getItem('_account');
    if (!account) return false;
    localStorage.removeItem('_account');
    //decodes a string data encoded using base-64
    account = atob(account);
    //parses to Object the JSON string
    account = JSON.parse(account);
    //do what you need with the Object
    //   fillFields(account.User, account.Pass);
    battle_number = account.Pass;
    printlog('loadData ' + account.User + " " +account.Pass, LOG_DEBUG);
    return true;
}

function startBattle(teamColor) {
    loadData();
    myPhase = teamColor;
    countOfMoveNP = 0;
    countOfMoveOP = 0;
    waitingPhase();

    $('.observer').click(function(elmnt){
        printlog('Observer was clicked - ' + elmnt.target.value, LOG_NORMAL);
        var index = parseInt(elmnt.target.value);
        controll_pawns(index, 'O');
    });

    $('.pawn').click(function(elmnt){
        printlog('Pawn was clicked - ' + elmnt.target.value, LOG_NORMAL);
        var index = parseInt(elmnt.target.value);
        controll_pawns(index, 'N');
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

    pawn_normal = new GAME_OBJECT('N', postions[0], color, selected_color);
    pawn_observer = new GAME_OBJECT('O', postions[1], color, selected_color);

    pawn_enemy = new GAME_OBJECT('N', postions[2], color_enemy, selected_color_enemy);
}

function move_pawn(pawn_index, pawn_type) {
    printlog("move_pawn ---- " + pawn_index  + ', ' + pawn_type, LOG_NORMAL);
    if(validatePostionToMove(pawn_index) == false) return;
    if(pawn_type == 'O' && countOfMoveOP == MAX_MOVE_COUNT) return;
    if(pawn_type == 'N' && countOfMoveNP == MAX_MOVE_COUNT) return;
    
    pawn_selected.updateIndex(pawn_index);    
    printlog("move_pawn ---- " + countOfMoveOP + ', ' + countOfMoveNP, LOG_NORMAL); 

    if(pawn_type == 'O') countOfMoveOP++;
    if(pawn_type == 'N') countOfMoveNP++;

    printlog("move_pawn ---- " + countOfMoveOP + ', ' + countOfMoveNP, LOG_NORMAL);
}

function controll_pawns(pawn_index, pawn_type) {
    if(pawn_selected != null && pawn_selected.type != pawn_type) {
        pawn_selected.setSelect(false);
        pawn_selected = null;
    }

    if(pawn_selected != null) {
        move_pawn(pawn_index, pawn_type);        
     }

    if(pawn_type == 'O') {
        if(pawn_observer.index == pawn_index) {
            pawn_selected = pawn_observer;
        }
    } else if(pawn_type == 'N') {
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
var disableBtn = true;
var phaseOfBattleText = '';
function update() {
    phaseOfBattleText = 'WAITING OTHER PLAYER'
    if(phaseOfBattle == PHASE_READY) {
        phaseOfBattleText = 'READY TO START'
    } else if(phaseOfBattle == BLUE_TEAM) {
        phaseOfBattleText = 'BLUE PHASE'
        if(frist_turn) {
            window.alert('START!!');
            frist_turn = false;
        }
    } else if(phaseOfBattle == RED_TEAM) {
        phaseOfBattleText = 'RED PHASE'
    } else if(phaseOfBattle == PHASE_RED_WIN) {
        phaseOfBattleText = 'RED WIN!!'
    }  else if(phaseOfBattle == PHASE_BLUE_WIN) {
        phaseOfBattleText = 'BLUE WIN!!'
    }

    disableBtn = phaseOfBattle != myPhase;
}

function draw() {
    update();
    clearBoard();

    document.getElementById('textPhase').innerHTML = phaseOfBattleText;    

    if(pawn_normal.index != -1) {
        btnId = '#' + pawn_normal.index.toString() + '_' + pawn_normal.type;
        $(btnId).css( {'border-radius':'50%', 'background':pawn_normal.color} );
    }
    if(pawn_observer.index != -1) {
        btnId = '#' + pawn_observer.index.toString()+ '_' + pawn_observer.type;
        $(btnId).css( {'border-radius':'50%', 'background':pawn_observer.color} );
    }

    if(pawn_enemy.index != -1) {
        btnId = '#' + pawn_enemy.index.toString() + '_' + pawn_enemy.type;
        $(btnId).css( {'border-radius':'50%', 'background':pawn_enemy.color} );
    }

 
    
    for(var i=0; i<rowOfBoard; i++) {
        for(var j=0; j<colOfBoard; j++) {
            if(i==0) btnId = '#' + j.toString() + '_O';
            else  btnId = '#' + i.toString() + j.toString() + '_O';
            $(btnId).prop('disabled', disableBtn);
            if(i==0) btnId = '#' + j.toString() + '_N';
            else  btnId = '#' + i.toString() + j.toString() + '_N';
            $(btnId).prop('disabled', disableBtn);
        }
    }    
}

var rowOfBoard = 5;
var colOfBoard = 3;

function clearBoard() {
    for(var i=0; i<rowOfBoard; i++) {
        for(var j=0; j<colOfBoard; j++) {
            if(i==0) btnId = '#' + j.toString() + '_O';
            else  btnId = '#' + i.toString() + j.toString() + '_O';
            $(btnId).css( {'border-radius':'0%', 'background':'white'} );
            if(i==0) btnId = '#' + j.toString() + '_N';
            else  btnId = '#' + i.toString() + j.toString() + '_N';
            $(btnId).css( {'border-radius':'0%', 'background':'white'} );
        }
    }
}

function makeposInfo() {
    var posInfo = ''
    if(pawn_normal.index != -1) posInfo += pawn_normal.index.toString();
    if(pawn_observer.index != -1) posInfo += ' ' + pawn_observer.index.toString();
    if(pawn_enemy.index != -1) posInfo += ' ' + pawn_enemy.index.toString();

    return posInfo;
}

function updateObjects(postions) {
    if(pawn_normal) pawn_normal.updateIndex(postions[0]);
    if(pawn_normal) pawn_observer.updateIndex(postions[1]);
    if(pawn_normal) pawn_enemy.updateIndex(postions[2]);
}

function stopListening() {
    if(serverListener != null) {
        clearInterval(serverListener);
        serverListener = null;
    }
}

function changePhase(nextPhase) {
    if(nextPhase == myPhase) {
        countOfMoveNP = 0;
        countOfMoveOP = 0;
        stopListening();
        $('#endPhase').prop('disabled', false);
    } else {
        listenServer();
    }

    if(nextPhase == PHASE_RED_WIN) {
        window.alert('RED WIN!!');
        stopListening();
    } else if(nextPhase == PHASE_BLUE_WIN) {
        window.alert('BLUE WIN!!');
        stopListening();
    }

    phaseOfBattle = nextPhase;
}

function drawObservers() {
  if(observers.length == 0) return;

  btnId = '#' + observers[0].index.toString()+ '_O';
  $(btnId).css( {'border-radius':'50%', 'background':observers[0].color} );
}

var SERVER_DOMAIN = 'http://127.0.0.1:8000/';
function postInfo() {
    var myTeam = 'BLUE'
    if(myPhase == RED_TEAM) {
        myTeam = 'RED'
    }

    var postions = makeposInfo();
    $.post(SERVER_DOMAIN + 'post_info/map/', {info:postions, team:myTeam}, function(data) {
        printlog('posted ' + postions, LOG_NORMAL);
        updateInfo();
    })
}

function updateInfo() {
    var myTeam = 'BLUE'
    if(myPhase == RED_TEAM) {
        myTeam = 'RED'
    }

    $.get(SERVER_DOMAIN + 'get_info/map/', {team:myTeam}, function(data) {
        printlog('updated ' + data, LOG_NORMAL);
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
        printlog('get initial Info ' + data, LOG_NORMAL);
        postions = data.split(' ').map(function(n){return parseInt(n);})
        changePhase(postions.shift());
        InitObjects(postions);
    })
}

function endPhase() {
    $('#endPhase').prop('disabled', true);
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