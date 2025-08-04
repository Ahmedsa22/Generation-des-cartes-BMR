from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Users  # Ou importe correctement si models.py est ailleurs



@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        try:
            user = Users.objects.get(username=username, password=password)
            return JsonResponse({
                'status': 'success',
                'username': user.username,
                'role': user.role,
                'permissions': user.permissions.split(',') if user.permissions else []
            })
        except Users.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Identifiants incorrects'}, status=401)

    return JsonResponse({'status': 'error', 'message': 'Méthode non autorisée'}, status=405)


