from django.shortcuts import HttpResponse
from threading import Timer

BLUE_START_POS = 10
BLUE_OUT_POS = 0
RED_START_POS = 32
RED_OUT_POS = 42
BLUE_GOAL = 32
RED_GOAL = 10

pawn_blue = BLUE_START_POS
observer_blue = BLUE_START_POS
pawn_red = RED_START_POS
observer_red = RED_START_POS

PHASE_WAITING = 0
PHASE_READY = 1
PHASE_BLUE_WIN = 2
PHASE_RED_WIN = 3
PHASE_BLUE = 10
PHASE_RED = 20

phase_of_battle = PHASE_WAITING

ready_blue = False
ready_red = False

MAX_MOVE_COUNT = 1
count_of_move_NP = 0
count_of_move_OP = 0

LOG_NORMAL = 0
LOG_DEBUG = 1

def print_log(msg, id):
    if id == LOG_DEBUG:
        print(msg)

def post_phase_waiting(request):
    global phase_of_battle
    global ready_blue
    global ready_red
    my_team = request.POST['team']

    if my_team == 'BLUE':
        ready_blue = True
    elif my_team == 'RED':
        ready_red = True

    if ready_blue and ready_red:
        phase_of_battle = PHASE_READY
        Timer(3, battle_start, ()).start()
        print_log("WAITING... " + str(ready_blue) + ", " + str(ready_red) + ", " + str(phase_of_battle), LOG_NORMAL)

    response = HttpResponse()
    return response

def battle_start():
    global phase_of_battle
    phase_of_battle = PHASE_BLUE
    print ("battle start")

def post_phase_end(request):
    global phase_of_battle
    global count_of_move_NP
    global count_of_move_OP

    response = HttpResponse()
    if phase_of_battle is PHASE_BLUE:
        phase_of_battle = PHASE_RED
    elif phase_of_battle is PHASE_RED:
        phase_of_battle = PHASE_BLUE

    count_of_move_NP = 0
    count_of_move_OP = 0

    return response

def get_info_map(request):
    my_team = request.GET['team']
    fommat_of_map = str(phase_of_battle) + " "

    if my_team  == 'BLUE':
        fommat_of_map += str(pawn_blue) + " "
        fommat_of_map += str(observer_blue) + " "
        if observer_blue == pawn_red:
            fommat_of_map += str(pawn_red) + " "
        else:
            fommat_of_map += "-1" + " "

    elif my_team == 'RED':
        fommat_of_map += str(pawn_red) + " "
        fommat_of_map += str(observer_red) + " "
        if observer_red == pawn_blue:
            fommat_of_map += str(pawn_blue) + " "
        else:
            fommat_of_map += "-1" + " "

        print_log( '[' +my_team +']' + str(fommat_of_map), LOG_NORMAL)
    response = HttpResponse(fommat_of_map)
    return response



def post_info_map(request):
    response = HttpResponse('')
    if request.method == 'POST':
        print_log(request.POST['info'], LOG_NORMAL)
        update_info(request.POST['info'], request.POST['team'])
    return response

def move_pawn_normal(team, next_pos):
    global pawn_blue
    global pawn_red
    global count_of_move_NP
    print_log("MOVE NORMAL " + team + " " + str(next_pos) + " " + str(count_of_move_NP), LOG_NORMAL)
    if team == 'BLUE':
        if count_of_move_NP == MAX_MOVE_COUNT:
            print_log("CANT MOVE NORMAL BLUE!!", LOG_NORMAL)
            return
        pawn_blue = next_pos
        count_of_move_NP += 1
    elif team == 'RED':
        if count_of_move_NP == MAX_MOVE_COUNT:
            print_log("CANT MOVE NORMAL RED!!", LOG_NORMAL)
            return
        pawn_red = next_pos
        count_of_move_NP += 1

    print_log("MOVE NORMAL " + team + " " + str(next_pos) + " " + str(count_of_move_NP), LOG_NORMAL)


def move_pawn_observer(team, next_pos):
    global observer_blue
    global observer_red
    global count_of_move_OP

    print_log("MOVE OBSERVER " + team + " " + str(next_pos) + " " + str(count_of_move_OP), LOG_NORMAL)
    if team == 'BLUE':
        if count_of_move_OP == MAX_MOVE_COUNT:
            print_log("CANT MOVE OBSERVER! BLUE!", LOG_NORMAL)
            return
        observer_blue = next_pos
        count_of_move_OP += 1
    elif team == 'RED':
        if count_of_move_OP == MAX_MOVE_COUNT:
            print_log("CANT MOVE OBSERVER! RED!", LOG_NORMAL)
            return
        observer_red = next_pos
        count_of_move_OP += 1

    print_log("MOVE OBSERVER " + team + " " + str(next_pos) + " " + str(count_of_move_OP), LOG_NORMAL)

def update_info(fommat_of_map, my_team):
    global pawn_blue
    global observer_blue
    global pawn_red
    global observer_red
    global phase_of_battle

    infos = fommat_of_map.split(' ')
    next_pos_of_NP = int(infos[0])
    next_pos_of_OP = int(infos[1])

    if my_team == 'BLUE':
        if pawn_blue != next_pos_of_NP:
            move_pawn_normal(my_team, next_pos_of_NP)
        elif observer_blue != next_pos_of_OP:
            move_pawn_observer(my_team, next_pos_of_OP)
    elif my_team == 'RED':
        if pawn_red != next_pos_of_NP:
            move_pawn_normal(my_team, next_pos_of_NP)
        elif observer_red != next_pos_of_OP:
            move_pawn_observer(my_team, next_pos_of_OP)

    if pawn_blue == pawn_red:
        if my_team == 'BLUE':
            pawn_red = RED_OUT_POS
        elif my_team == 'RED':
            pawn_blue = BLUE_OUT_POS

    if my_team == 'BLUE' and pawn_blue == BLUE_GOAL:
        phase_of_battle = PHASE_BLUE_WIN
    elif my_team == 'RED' and pawn_red == RED_GOAL:
        phase_of_battle = PHASE_RED_WIN

    print_log('POSTED : '+ str(infos), LOG_NORMAL)
