from django.shortcuts import render, HttpResponse

pawn_blue = 0
obsrver_blue = 0
pawn_red = 22
observer_red = 22

def get_info_map(request):
    fommat_of_map = str(pawn_blue) + " " + str(obsrver_blue) +" " + str(pawn_red) + " " + str(observer_red)
    response = HttpResponse(fommat_of_map )
    return response

def post_info_map(request):
    response = HttpResponse('')
    if request.method == 'POST':
        print(request.POST['info'])
        update_info(request.POST['info'])
    return response

def update_info(fommat_of_map):
    global pawn_blue
    global obsrver_blue
    global pawn_red
    global observer_red

    infos = fommat_of_map.splite(' ')
    print(infos)

    pawn_blue = infos[0]
    obsrver_blue = infos[1]
    pawn_red = infos[2]
    observer_red = infos[3]
