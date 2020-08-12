

function autoheight(x) {
    x.style.height = "5px";
    x.style.height = (15+x.scrollHeight)+"px";
  }
    /*
function mEnter(m)
    {
        //window.alert(m.getAttribute("id"));
        var x = document.getElementById(m.getAttribute("id")+"ED");
        x.style.display = "block";
        var y = document.getElementById(m.getAttribute("id")+"DD");
        y.style.display = "block";


    }
    function mLeave(m)
    {
        //window.alert(m.getAttribute("id"));
        var x = document.getElementById(m.getAttribute("id")+"ED");
        x.style.display = "none";
        var y = document.getElementById(m.getAttribute("id")+"DD");
        y.style.display = "none";
  
    }
   */
function editBlock(m)
    {
        var myid=String (m.getAttribute("id"));
        var id=myid.substring(0,myid.length-2);
        var x = document.getElementById(id+"MP");
        x.style.display = "none";
        var y = document.getElementById(id+"ME");
        y.style.display = "block";
    }
function deleteBlock(m)
    {
        var myid=String (m.getAttribute("id"));
        var id=myid.substring(0,myid.length-2);
        var x = document.querySelector("#"+id);
        x.remove();
    }
function doneBlock(m)
    {
        var myid=String (m.getAttribute("id"));
        var id=myid.substring(0,myid.length-2);
        var mode=String (document.getElementById(id).getAttribute("data"));
        if (mode=="text")
        {
        var id=myid.substring(0,myid.length-2);
        var x = document.getElementById(id+"ME");
        x.style.display = "none";
        var y = document.getElementById(id+"MP");
        y.style.display = "block";
        var content = document.getElementById(id+"IP");
        var prev = document.getElementById(id+"PA");
        prev.innerHTML= content.innerHTML;
        var d = document.querySelector("#"+id+"ME");
        d.style.display="none";
        }
        if (mode=="image")
        {
          var id=myid.substring(0,myid.length-2);
          var x = document.getElementById(id+"ME");
          x.style.display = "none";
          var y = document.getElementById(id+"MP");
          y.style.display = "block";
          var content = document.getElementById(id+"BB");
          var prev = document.getElementById(id+"PA");
          var img = document.createElement("img");
          var fReader = new FileReader();
          fReader.readAsDataURL(content.files[0]);
          
          //img.setAttribute("src",content.value);
          if (prev.childElementCount==1){prev.firstChild.remove();}
          fReader.onloadend = function(event){img.src = event.target.result;}
          prev.appendChild(img);
          var d = document.querySelector("#"+id+"ME");
          d.style.display="none";
        }
        
    }


function addBlock(){

        c=document.querySelector("#blocks").childElementCount;
        if (c!=0)
        {
        last_id = String(document.getElementById("blocks").children[c-1].getAttribute("id"));
        last_id= last_id.substring(1,last_id.length);
        c = parseInt(last_id);

        }
        //create box 
        var newele= document.createElement("DIV");
        newele.id="E"+String(c+1);
        newele.className="row";
        //newele.setAttribute("onmouseenter","mEnter(this)");
        //newele.setAttribute("onmouseleave","mLeave(this)");
        newele.setAttribute("style","background-color:lavender;margin: 10px;border-radius: 10px;");
        newele.setAttribute("data","text");


        //create main edit area
        var main_edit_area = document.createElement("DIV");
        main_edit_area.className="row";
        main_edit_area.id="E"+String(c+1)+"ME";
        main_edit_area.setAttribute("style","background-color:lavender;");
        //create main preview area
        var main_preview_area = document.createElement("DIV");
        main_preview_area.className="row";
        main_preview_area.id="E"+String(c+1)+"MP";
        main_preview_area.setAttribute("style","background-color:lavender;display:none;");

        //textbox div area
        var txtarea = document.createElement("div");
        txtarea.className="col-md-6";
        txtarea.setAttribute("class","col-md-6");
        txtarea.setAttribute("style","background-color:lavender;display:block;width: 40%;");
        //done button div
        var btnDonear = document.createElement("div");
        btnDonear.className="col-md-6";
        btnDonear.id="E"+String(c+1)+"DD";
        //initial preview div
        var initial_preview = document.createElement("div");
        initial_preview.className="col-md-6";
        initial_preview.setAttribute("class","col-md-6");
        initial_preview.id="E"+String(c+1)+"IP";
        initial_preview.setAttribute("style","background-color:lavender;display:block;width: 40%;word-break:break-all;white-space: pre-wrap;");

        //preview area 
        var prvarea = document.createElement("div");
        prvarea.className="col-md-6";
        prvarea.id="E"+String(c+1)+"PA";
        prvarea.setAttribute("style","background-color:lavender;display:block;word-break:break-all;white-space: pre-wrap;");

        //button edit div
        var btnEditar = document.createElement("div");
        btnEditar.className="col-md-6";
        btnEditar.id="E"+String(c+1)+"ED";


        //edit button
        var btnEdit = document.createElement("button");
        btnEdit.setAttribute("onclick","editBlock(this)");
        btnEdit.innerText="Edit";
        btnEdit.id="E"+String(c+1)+"EB";
        btnEdit.className="btn btn-info";
        //delete button
        var btnDel = document.createElement("button");
        btnDel.setAttribute("onclick","deleteBlock(this)");
        btnDel.innerText="Delete";
        btnDel.id="E"+String(c+1)+"DB";
        btnDel.className="btn btn-danger";
        //done button
        var btnDone = document.createElement("button");
        btnDone.setAttribute("onclick","doneBlock(this)");
        btnDone.innerText="Done";
        btnDone.id="E"+String(c+1)+"SB";
        btnDone.className="btn btn-success";
        //create editor 
        var txtbx= document.createElement("textarea");
        txtbx.id="E"+String(c+1)+"TX";
        txtbx.setAttribute("onkeyup","autoheight(this)");
        txtbx.setAttribute("style","border: none;resize:vertical;width:100%;white-space: pre-wrap;overflow-wrap: break-word;");

   

        //combining all together
        btnEditar.appendChild(btnDel);
        btnEditar.appendChild(btnEdit);
        btnDonear.appendChild(btnDone);
        txtarea.appendChild(txtbx);

        main_edit_area.appendChild(txtarea);
        main_edit_area.appendChild(initial_preview);
        main_edit_area.appendChild(btnDonear);
        main_preview_area.appendChild(prvarea);
        main_preview_area.appendChild(btnEditar);


        newele.appendChild(main_edit_area);
        newele.appendChild(main_preview_area);
 

        document.querySelector("#blocks").append(newele);
        //Simplemde editor declaration
        //var simplemde = new SimpleMDE({ element: document.getElementById("E"+String(c+1)+"TX") });

        }

function addImage()
{
  c=document.querySelector("#blocks").childElementCount;
  if (c!=0)
  {
  last_id = String(document.getElementById("blocks").children[c-1].getAttribute("id"));
  last_id= last_id.substring(1,last_id.length);
  c = parseInt(last_id);

  }
  //create box 
  var newele= document.createElement("DIV");
  newele.id="E"+String(c+1);
  newele.className="row";
  //newele.setAttribute("onmouseenter","mEnter(this)");
  //newele.setAttribute("onmouseleave","mLeave(this)");
  newele.setAttribute("style","background-color:lavender;margin: 10px;border-radius: 10px;");
  newele.setAttribute("data","image");


        //create main edit area
       var main_edit_area = document.createElement("DIV");
        main_edit_area.className="row";
        main_edit_area.id="E"+String(c+1)+"ME";
        main_edit_area.setAttribute("style","background-color:lavender;");
        //create main preview area
        var main_preview_area = document.createElement("DIV");
        main_preview_area.className="row";
        main_preview_area.id="E"+String(c+1)+"MP";
        main_preview_area.setAttribute("style","background-color:lavender;display:none;");


        

        //done button div
        var btnDonear = document.createElement("div");
        btnDonear.className="col-md-6";
        btnDonear.id="E"+String(c+1)+"DD";
        //btnDonear.setAttribute("style",  "position:relative;right: 20px;");
        
        //preview area 
        var prvarea = document.createElement("div");
        prvarea.className="col-md-6";
        prvarea.id="E"+String(c+1)+"PA";
        prvarea.setAttribute("style","background-color:lavender;display:block;allign:center;");

        //button edit div
        var btnEditar = document.createElement("div");
        btnEditar.className="col-md-6";
        btnEditar.id="E"+String(c+1)+"ED";


        //edit button
        var btnEdit = document.createElement("button");
        btnEdit.setAttribute("onclick","editBlock(this)");
        btnEdit.innerText="Edit";
        btnEdit.id="E"+String(c+1)+"EB";
        btnEdit.className="btn btn-info";

        //delete button
        var btnDel = document.createElement("button");
        btnDel.setAttribute("onclick","deleteBlock(this)");
        btnDel.innerText="Delete";
        btnDel.id="E"+String(c+1)+"DB";
        btnDel.className="btn btn-danger";
        //done button
        var btnDone = document.createElement("button");
        btnDone.setAttribute("onclick","doneBlock(this)");
        btnDone.innerText="Done";
        btnDone.id="E"+String(c+1)+"SB";
        btnDone.className="btn btn-success";
  
        //browse button
        var btnBrowse = document.createElement("button");
        btnBrowse.innerText="Browse";
        btnBrowse.setAttribute("for","E"+String(c+1)+"BB");
        btnBrowse.className="btn btn-info";
        //browse input 
        var browseInput = document.createElement("input");
        browseInput.id="E"+String(c+1)+"BB";
        browseInput.setAttribute("type","file")
        browseInput.setAttribute("accept","image/x-png,image/gif,image/jpeg")

   

        //combining all together
        btnBrowse.appendChild(browseInput);

        btnEditar.appendChild(btnDel);
        btnEditar.appendChild(btnEdit);
        btnDonear.appendChild(btnBrowse);
        btnDonear.appendChild(btnDone);



        main_edit_area.appendChild(btnDonear);
        main_preview_area.appendChild(prvarea);
        main_preview_area.appendChild(btnEditar);


        newele.appendChild(main_edit_area);
        newele.appendChild(main_preview_area);
        document.querySelector("#blocks").append(newele);
}
 
// Listen for changes to inputs and textareas
document.addEventListener('input', function (event) {
	// Only run if the change happened in the #editor
    var event_id=String (event.target.id);
    var e_id=event_id.substring(0,event_id.length-2)+'IP';
    var mode =document.getElementById(event_id.substring(0,event_id.length-2)).getAttribute("data");
    if (mode=="text")
    {
      var compiled = document.querySelector('#'+String(e_id));
      compiled.innerHTML = marked(String(event.target.value), { sanitize: true });
    }
    

}, false);

