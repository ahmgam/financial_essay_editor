
from django.urls import path
from .consumers import  DraftConsumer



websocket_urlpatterns = [
    path('ws/<str:pk>/<str:tocken>/', DraftConsumer),
]