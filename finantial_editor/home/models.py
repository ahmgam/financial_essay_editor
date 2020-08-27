from django.db import models
from django.contrib.sessions.models import Session

class SocketSession (Session):
    blog_id = models.CharField(max_length=32)
    
# Create your models here.
