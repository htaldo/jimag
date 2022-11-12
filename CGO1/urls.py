from django.urls import path
from . import views

urlpatterns = [
   
    path('codigo10/',views.hello1),
    path ('codigo11/', views.about1)

]