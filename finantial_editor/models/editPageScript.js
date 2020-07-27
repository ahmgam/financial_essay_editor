function mEnter(m)
    {
        //window.alert(m.getAttribute("id"));
        var x = document.getElementById(m.getAttribute("id")+"BA");
        x.style.display = "block";


    }
    function mLeave(m)
    {
        //window.alert(m.getAttribute("id"));
        var x = document.getElementById(m.getAttribute("id")+"BA");
        x.style.display = "none";
  
    }
    function editBlock(m)
    {
        var myid=String (m.getAttribute("id"));
        var id=myid.substring(0,myid.length-2);
        var x = document.getElementById(id+"PA");
        x.style.display = "none";
        var y = document.getElementById(id+"TA");
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
        var x = document.getElementById(id+"TA");
        x.style.display = "none";
        var y = document.getElementById(id+"PA");
        y.style.display = "block";
        var content = document.getElementById(id+"TX");
        window.alert();
        var simplemde = new SimpleMDE({ element: document.getElementById("E"+String(c+1)+"TX") });

        y.innerHTML = simplemde.value();
    }


     function addBlock(){

        c=document.querySelector("#test").childElementCount;
        //create box 
        var newele= document.createElement("div");
        newele.setAttribute("id","E"+String(c+1));
        newele.setAttribute("class","row");
        newele.setAttribute("onmouseenter","mEnter(this)");
        newele.setAttribute("onmouseleave","mLeave(this)");
        newele.setAttribute("style","background-color:lavender;");

        //create middle main area
        var midarea = document.createElement("div");
        midarea.setAttribute("id","E"+String(c+1)+"MA");
        midarea.setAttribute("class","col-sm");
        midarea.setAttribute("style","background-color:lavender;width: 90%;");
        //create bottons area
        var btnarea = document.createElement("div");
        btnarea.setAttribute("id","E"+String(c+1)+"BA");
        btnarea.setAttribute("class","col-sm");
        btnarea.setAttribute("style","background-color:lavender;width: 10%;");

        //create textbox area
        var txtarea = document.createElement("div");
        txtarea.setAttribute("id","E"+String(c+1)+"TA");
        txtarea.setAttribute("class","row");
        txtarea.setAttribute("style","background-color:lavender;");
        //preview area 
        var prvarea = document.createElement("div");
        prvarea.setAttribute("id","E"+String(c+1)+"PA");
        prvarea.setAttribute("class","row");
        prvarea.setAttribute("style","background-color:lavender;display:none;");

        //button edit div
        var btnEditar = document.createElement("div");
        btnEditar.setAttribute("class","row");
        btnEditar.setAttribute("id","E"+String(c+1)+"EA");
        btnEditar.setAttribute("style","display:none;");

        //buttin delete div
        var btnDelar = document.createElement("div");
        btnDelar.setAttribute("class","row");
        btnDelar.setAttribute("id","E"+String(c+1)+"DA");
        //done button div
        var btnDonear = document.createElement("div");
        btnDonear.setAttribute("class","row");
        btnDonear.setAttribute("id","E"+String(c+1)+"NA");

        //edit button
        var btnEdit = document.createElement("button");
        btnEdit.setAttribute("onclick","editBlock(this)");
        btnEdit.innerText="Edit";
        btnEdit.setAttribute("id","E"+String(c+1)+"EB");
        //delete button
        var btnDel = document.createElement("button");
        btnDel.setAttribute("onclick","deleteBlock(this)");
        btnDel.innerText="Delete";
        btnDel.setAttribute("id","E"+String(c+1)+"DB");
        //done button
        var btnDone = document.createElement("button");
        btnDone.setAttribute("onclick","doneBlock(this)");
        btnDone.innerText="Done";
        btnDone.setAttribute("id","E"+String(c+1)+"MB");
        //create editor 
        var txtbx= document.createElement("textarea");
        txtbx.setAttribute("id","E"+String(c+1)+"TX");


        //combining all together
        btnDelar.appendChild(btnDel);
        btnEditar.appendChild(btnEdit);
        btnDonear.appendChild(btnDone);
        txtarea.appendChild(txtbx);

        btnarea.appendChild(btnEditar);
        btnarea.appendChild(btnDelar);
        btnarea.appendChild(btnDonear);

        midarea.appendChild(txtarea);
        midarea.appendChild(prvarea);

        newele.appendChild(midarea);
        newele.appendChild(btnarea);

        document.querySelector("#test").append(newele);
        //Simplemde editor declaration
        var simplemde = new SimpleMDE({ element: document.getElementById("E"+String(c+1)+"TX") });
        }