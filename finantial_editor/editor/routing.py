
from django.urls import path
from .consumers import  DraftConsumer



websocket_urlpatterns = [
    path('ws/<int:pk>/<str:tocken>/', DraftConsumer),
]