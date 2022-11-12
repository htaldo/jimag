

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
def index(request):
    title= 'Interfaz para acoplamientos Proteína-Ligando usando autodock y Chimera'
    return render(request, 'index.html', {
        'title': title
    })

def hello(request):
    return HttpResponse("<center><h1>Programa de Proteínas</h1></center>")
def about(request):
    return HttpResponse('Codigo fuente')