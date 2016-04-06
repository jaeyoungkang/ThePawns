from django.shortcuts import render, HttpResponse

def get_info_map(request):
    response = HttpResponse('11 11 33 33')
    return response

def post_info_map(request):
    response = HttpResponse('')
    if request.method == 'POST':
        print(request.POST['info'])
    return response
