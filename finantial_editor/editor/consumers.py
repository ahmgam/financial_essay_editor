
import json
from channels.generic.websocket import WebsocketConsumer
from editor.models import BlogContent,ChartData,DraftContent
import logging
from djongo.models.fields import ObjectId
logger = logging.getLogger(__name__)



class DraftConsumer(WebsocketConsumer):
    def connect(self):
        try:
            pk = self.scope['url_route']['kwargs']['pk']
            userid = self.scope['user'].id
            blog = DraftContent.objects.get(pk=ObjectId(pk))
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

        blog=DraftContent.objects.get(pk=ObjectId(self.scope['url_route']['kwargs']['pk']))
        if message=="get title":
            self.send(json.dumps([{"id":"0","type":"title","content":blog.title}]))
        if message=="get draft":
            self.send(json.dumps(blog.content))
        if message=="save title":
            blog.title = json_data['data']
        if message=='save draft':
            #blog.draft[text_data_json['data']['id']]=text_data_json['data']['content']
            logger.error("saving draft ")
            x =list(blog.content)
            exist = False
            for block in x:
                if block['id'] == json_data['data']['id']:
                    block = json_data['data']
                    exist=True
            if exist==False:
                x.append(json_data['data'])
            blog.content =  x
        
        if message=='delete block':
            x =blog.content
            for block in x:
                if block['id'] == json_data['data']['id']:
                    x.remove(block)
            blog.draft =  x 
        if message=="save blog":
           myblog = BlogContent(blog.ref) 
           myblog.title= json_data['data'][0]['content']
           myblog.content=json_data['data'][1:]
           myblog.published=True
           myblog.save()
        blog.save()

        

  
