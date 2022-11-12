from django.urls import path
from . import views

urlpatterns = [
   
    path('',views.index),
    path('codigo00/',views.hello),
    path ('codigo01/', views.about),
    


]