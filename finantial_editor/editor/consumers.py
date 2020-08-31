
import json
from channels.generic.websocket import WebsocketConsumer
from editor.models import BlogContent,ChartData
import logging
from djongo.models.fields import ObjectId
logger = logging.getLogger(__name__)



class DraftConsumer(WebsocketConsumer):
    def connect(self):
        try:
            pk = self.scope['url_route']['kwargs']['pk']
            userid = self.scope['user'].id
            blog = BlogContent.objects.get(pk=ObjectId(pk))
            #logger.error("username : "+str(self.scope['user'].username)+", user id : "+str(userid)+ ", authed : "+str(self.scope['user'].is_authenticated))
            authorid = blog.authorId
            if (userid==authorid):
                logger.error("Accepted connection")

                self.accept()
                blog.content

            else : 
                logger.error("Closing connection due to unauthoriezd connection")
                self.close()

        except :
            logger.error("Closing connection due to error")

            self.close()

    def disconnect(self, close_code):
        
        pass

    def receive(self, text_data):
        logger.error(str(text_data)+ ", type : "+str(type(text_data)))
        #text_data_json = json.loads(text_data)
        #message = text_data_json['message']
        json_data = json.loads(text_data)
        message =json_data['message']
        logger.error(message)

        blog=BlogContent.objects.get(pk=ObjectId(self.scope['url_route']['kwargs']['pk']))

        if message=="get draft":
            self.send(blog.draft)
        if message=='get content':
            self.send(blog.content)
        if message=='save draft':
            #blog.draft[text_data_json['data']['id']]=text_data_json['data']['content']
            logger.error("saving draft ")
            x =list(blog.draft)
            x.append(json_data['data'])
            blog.draft =  x

        if message=='save content':
            #blog.content[text_data_json['data']['id']]=text_data_json['data']['content']
            blog.content[text_data['data']['id']]=text_data['data']['content']
        logger.error("not all of above")
        blog.save()

        

  
