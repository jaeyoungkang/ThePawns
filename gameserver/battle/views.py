from django.shortcuts import render, HttpResponse

BLUE_START_POS = 10
BLUE_OUT_POS = 0
RED_START_POS = 32
RED_OUT_POS = 42

pawn_blue = BLUE_START_POS
observer_blue = BLUE_START_POS
pawn_red = RED_START_POS
observer_red = RED_START_POS

PHASE_START = 0
PHASE_BLUE = 1
PHASE_RED = 2
PHASE_END = 3

phase_of_battle = PHASE_BLUE

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

    print('GET : ' + my_team)
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


    print('GET : ' + str(fommat_of_map))
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
