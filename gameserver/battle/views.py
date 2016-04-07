from django.shortcuts import render, HttpResponse

info_of_map = "00 00 22 22"

def get_info_map(request):
    response = HttpResponse(info_of_map)
    return response

def post_info_map(request):
    global info_of_map
    response = HttpResponse('')
    if request.method == 'POST':
        print(request.POST['info'])
        info_of_map = request.POST['info']
    return response
