from django.shortcuts import HttpResponse
from threading import Timer

BLUE_START_POS = 10
BLUE_OUT_POS = 0
RED_START_POS = 32
RED_OUT_POS = 42

pawn_blue = BLUE_START_POS
observer_blue = BLUE_START_POS
pawn_red = RED_START_POS
observer_red = RED_START_POS

PHASE_WAITING = 0
PHASE_READY = 1
PHASE_END = 3
PHASE_BLUE = 10
PHASE_RED = 20

phase_of_battle = PHASE_WAITING

ready_blue = False
ready_red = False

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
    print ("WAITING... " + str(ready_blue) + ", " + str(ready_red) + ", " + str(phase_of_battle) )

    current_user = request.user
    print current_user.id

    response = HttpResponse()
    return response

def battle_start():
    global phase_of_battle
    phase_of_battle = PHASE_BLUE
    print ("battle start")

def post_phase_end(request):
    global phase_of_battle
    response = HttpResponse()
    if phase_of_battle is PHASE_BLUE:
        phase_of_battle = PHASE_RED
    elif phase_of_battle is PHASE_RED:
        phase_of_battle = PHASE_BLUE

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

    print( '[' +my_team +']' + str(fommat_of_map))
    response = HttpResponse(fommat_of_map)
    return response



def post_info_map(request):
    response = HttpResponse('')
    if request.method == 'POST':
        print(request.POST['info'])
        update_info(request.POST['info'], request.POST['team'])
    return response

def update_info(fommat_of_map, my_team):
    global pawn_blue
    global observer_blue
    global pawn_red
    global observer_red

    infos = fommat_of_map.split(' ')

    if my_team == 'BLUE':
        infos = fommat_of_map.split(' ')
        pawn_blue = int(infos[0])
        observer_blue = int(infos[1])
    elif my_team == 'RED':
        infos = fommat_of_map.split(' ')
        pawn_red= int(infos[0])
        observer_red = int(infos[1])

    if pawn_blue == pawn_red:
        if my_team == 'BLUE':
            pawn_red = RED_OUT_POS
        elif my_team == 'RED':
            pawn_blue = BLUE_OUT_POS

    print('POSTED : '+ str(infos))
