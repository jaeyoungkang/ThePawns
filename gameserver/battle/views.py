from django.shortcuts import render, HttpResponse

pawn_blue = 0
observer_blue = 0
pawn_red = 22
observer_red = 22

def get_info_map(request):
    print('GET : ' + str(pawn_blue) + " " + str(observer_blue) + " " + str(pawn_red) + " " +  str(observer_red) )

    fommat_of_map = ""
    fommat_of_map += str(pawn_blue) + " "
    fommat_of_map += str(observer_blue) + " "
    if observer_blue == pawn_red:
        fommat_of_map += str(pawn_red) + " "
    else:
        fommat_of_map += "-1" + " "

    fommat_of_map += "-1" + " "

    response = HttpResponse(fommat_of_map)
    print('GET : ' + str(fommat_of_map))
    return response

def post_info_map(request):
    response = HttpResponse('')
    if request.method == 'POST':
        print(request.POST['info'])
        update_info(request.POST['info'])
    return response

def update_info(fommat_of_map):
    global pawn_blue
    global observer_blue

    infos = fommat_of_map.split(' ')
    pawn_blue = int(infos[0])
    observer_blue = int(infos[1])
    print('POSTED : '+ str(infos))

