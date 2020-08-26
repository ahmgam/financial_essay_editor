
import json
from channels.generic.websocket import WebsocketConsumer
from editor.models import BlogContent,ChartData
from django.contrib.sessions.models import Session



class DraftConsumer(WebsocketConsumer):
    def connect(self,pk,tocken):
        blogId=pk
        session_key=tocken
        session = Session.objects.get(session_key=session_key)
        uid = session.get_decoded().get('_auth_user_id')
        user = BlogContent.from_db(pk=blogId).authorId
        if (user==uid):
            self.accept()
        else : 
            self.close()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        self.send(text_data=json.dumps({
            'message': message
        }))