
import json
from channels.generic.websocket import WebsocketConsumer
from editor.models import BlogContent,ChartData,DraftContent,ChartData
import logging
from djongo.models.fields import ObjectId
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import base64
import random
import string
from datetime import datetime 
from io import BytesIO
from editor.views import getData, processData
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
        #logger.error(str(text_data)+ ", type : "+str(type(text_data)))
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
           myblog = blog.ref
           myblog.title=blog.title
           myblog.content=blog.content
           myblog.published=True
           myblog.save()
        if message=="save image":
            logger.error("saving image ")
            myfilebytes = json_data['imgdata']
            myfile=BytesIO(base64.b64decode(myfilebytes))
            name=""
            for i in range (15):
                name = name + random.choice(string.ascii_lowercase)
            fs = FileSystemStorage()
            filename = fs.save(name+'.jpg', myfile)
            uploaded_file_url = fs.url(filename)
            #logger.error("saved with link"+uploaded_file_url)

            x =blog.content
            for block in x:
                if block['id'] == json_data['id']:
                    block['content']=uploaded_file_url
            blog.content =  x 
        if message=="save chart":
            s_date = datetime.strptime(json_data["start_date"], '%m-%d-%Y').strftime('%Y-%m-%d')
            e_date = datetime.strptime(json_data["end_date"], '%m-%d-%Y').strftime('%Y-%m-%d')
            ticker = json_data["ticker"]
            data = getData(s_date,e_date,"",ticker)
            chart = ChartData.objects.create(data=json.loads(data))
            x =blog.content
            for block in x:
                if block['id'] == json_data['id']:
                    block["chartid"] = str(chart.pk)
            blog.content =  x
        blog.save()

        

  
