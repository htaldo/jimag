
from django.http import HttpResponse

# Create your views here.
def hello1(request):
    return HttpResponse("<center><h1>Texto 1</h1></center>")
def about1(request):
    return HttpResponse('<h2>Texto2<h2>')