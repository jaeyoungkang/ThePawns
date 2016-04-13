from django.shortcuts import render, HttpResponse

pawn_blue = 0
observer_blue = 0
pawn_red = 22
observer_red = 22

def get_info_map(request):
    my_team = request.GET['team']
    fommat_of_map = ""

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

    print('POSTED : '+ str(infos))

