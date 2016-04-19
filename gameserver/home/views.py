from django.shortcuts import HttpResponse

battle_number = 0

def get_battle_number(request):
    global battle_number
    response = HttpResponse(battle_number)
    print("get_battle_number " + str(battle_number))
    battle_number += 1
    return response