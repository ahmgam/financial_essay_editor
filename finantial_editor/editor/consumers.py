
import json
from channels.generic.websocket import WebsocketConsumer
from editor.models import BlogContent,ChartData
from django.contrib.sessions.backends.db import SessionStore
import logging
from django.contrib.sessions.models import Session

logger = logging.getLogger(__name__)



class DraftConsumer(WebsocketConsumer):
    def connect(self):
        pk = self.scope['url_route']['kwargs']['pk']
        tocken=self.scope['url_route']['kwargs']['tocken']
        secret=""
        #s = SessionStore(session_key=tocken)
        s= Session.objects.get(pk=tocken)
        
        if s.get_decoded().__contains__('active_article'):
          secret=s.get_decoded()['active_article']
          
          logger.error("found the session")

        if (secret==pk):
            logger.error("Accepted connection")

            self.accept()

        else : 
            logger.error("Closing connection")

            self.close()

    def disconnect(self, close_code):
        
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        self.send(text_data=json.dumps({
            'message': message
        }))
    def close():
        pass
