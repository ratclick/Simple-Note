var head=null;
var time = '';
var id = 0;
var ph = 0;
var pw = 0;

var colorPallete = {'Yellow':'#fafe68','Red':'#ea252e','Purple':'#763ecd','orange':'#ea5b1c'};


function today(){
    var dt = new Date();
        var d = dt.getDate()
        var m = dt.getMonth();
        var y = dt.getFullYear();
        var min = dt.getMinutes();
        var hr = dt.getHours();
        var sec = dt.getSeconds();
        if (m<10){
            m = m +1;
            m = '0'+m;
        }
        
        if (d<10){
            d = '0'+d;
        }
        
        var today = d+'\\'+m+'\\'+y;
        var time = hr+':'+min+':'+sec;
        return today;
}

class note{
    constructor(text){
        id+=1;
        this.height = "50px";
        this.width = "100px";
        this.text = text;
        this.today = today();
        this.id = id;
        this.color = '#fafe68';
    }
}

class noteNode{
    constructor(text){
        this.node = new note(text);
        this.next = null;
    }
}

function loaded(){
    ph = window.innerHeight;
    pw = window.innerWidth;
    document.getElementById('workArea').style.height = ph+'px';
    document.getElementById('noteArea').style.height = ph+'px';
}

function drawNotes(){
    document.getElementById('noteArea').innerHTML= "";
    var temp = head;
    while(temp){
        var xTemp = document.createElement('div');
        xTemp.className = "sticky";
        xTemp.innerHTML = '<table style="width: 90%;"><tr ><td  style="height: 10px;text-align: right;">'+temp.node.today+'</td></tr><tr><td style="vertical-align: top;"><p>'+temp.node.text+'</p></td></tr></table>';
        xTemp.setAttribute('noteId',temp.node.id);
        xTemp.setAttribute('noteTime',temp.node.today);
        xTemp.setAttribute('noteText',temp.node.text);
        xTemp.style.backgroundColor = temp.node.color;
        /*xTemp.addEventListener("click",function(){
            //edit this note
            
        });*/
        
        //doubleclick
        xTemp.addEventListener("dblclick",function(){
            //edit this note
            editOverlay(this.getAttribute('noteId'));
        });
        
        //right click
        xTemp.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            var self = this;
            var temp1 = document.createElement('table');
            temp1.id = 'menu';
            temp1.innerHTML = "<tr><td class='menu-item' n='1' onclick='deleteN(this)'>Delete</td></tr><tr><td class='menu-item' n='2' onclick='changeColor(this)'>Change Color</td></tr>";
            temp1.style.top = ev.clientY + 'px';
            temp1.style.left = ev.clientX + 'px';
            temp1.setAttribute("noteId",self.getAttribute("noteId"));
            var overlay = document.createElement('div');
            overlay.id = 'menu-overlay';
            overlay.style.width = pw + 'px';
            overlay.style.height = ph + 'px';
            
            overlay.addEventListener('mousedown',function(ev){
                var self = this;
                self.style.visibility = 'hidden';
                self.parentNode.removeChild(self);
                if(document.getElementById('menu')){
                    document.getElementById('menu').style.visibility = 'hidden';
                    document.getElementById('menu').parentNode.removeChild(document.getElementById('menu'));
                }
                if(document.getElementById('pallete')){
                    document.getElementById('pallete').parentNode.removeChild(document.getElementById('pallete'));
                }
            });
            
            
            document.body.appendChild(temp1);
            document.body.appendChild(overlay);
            temp1.style.visibility = 'visible';
            overlay.style.visibility = 'visible';
            return false;
        }, false);
        document.getElementById('noteArea').appendChild(xTemp);
        temp = temp.next;
    }
}


function deleteN(self){
    var x = self.parentNode.parentNode.parentNode.getAttribute("noteId");
	var tempNode = head.next;
	var previous = head;
	if(head.node.id == x){
	    head = head.next;
	}
	else{
	    while(tempNode){
	        if(tempNode.node.id == x){
	            previous.next = tempNode.next;
	            break;
	        }
	        previous = tempNode;
	        tempNode = tempNode.next;
	    }
	}
    
    //hide overlay and menu
    document.getElementById('menu-overlay').style.visibility = 'hidden';
    document.getElementById('menu').style.visibility = 'hidden';
    document.getElementById('menu-overlay').parentNode.removeChild(document.getElementById('menu-overlay'));
    document.getElementById('menu').parentNode.removeChild(document.getElementById('menu'));
    
    
    //redraw notes
    drawNotes();
}

function changeColor(self){
    
    var x = self.parentNode.parentNode.parentNode.getAttribute("noteId");
    
    var temp = head;
    
    //hide menu and show pallete
    document.getElementById('menu').style.visibility = 'hidden';
    document.getElementById('menu').parentNode.removeChild(document.getElementById('menu'));
    
    var palette = document.createElement('div');
    palette.id = 'pallete';
    palette.innerHTML = '<select onchange="colorNote('+x+')" id="color"><option value="null">Select Color</option><option value="#fafe68">Yellow</option><option value="#ea252e">Red</option><option value="#763ecd">Purple</option><option value="#ea5b1c">Orange</option></select>';
    
    palette.style.visibility = 'visible';
    var l = (pw/2)-80;
    var t = (ph/2)-20;
    
    palette.style.left = l + 'px';
    palette.style.top = t + 'px';
    document.body.appendChild(palette);
    
}


function colorNote(a){
    var tempN = head;
    while(tempN){
        if(tempN.node.id == a){
            tempN.node.color = document.getElementById('color').value;
            break;
        }
        tempN = tempN.next;
    }
    document.getElementById('menu-overlay').parentNode.removeChild(document.getElementById('menu-overlay'));
    document.getElementById('pallete').parentNode.removeChild(document.getElementById('pallete'));
    drawNotes();
}

function submitNote(a){
                switch (a) {
                    case -1:
                        //add a new note
                        addNote(document.getElementById('noteText').value);
                        document.getElementById('newNote').style.visibility = 'hidden';
                        document.getElementById('blackOverlay').style.visibility = 'hidden';
                        document.getElementById('newNote').style.display = 'none';

                        drawNotes();
                        break;
                    default:
                        // code
                        var z = head;
                        while(z){
                            if(z.node.id == a){
                                z.node.text = document.getElementById('noteText').value;
                                break;
                            }
                            z = z.next;
                        }
                        document.getElementById('newNote').style.visibility = 'hidden';
                        document.getElementById('blackOverlay').style.visibility = 'hidden';
                        document.getElementById('newNote').style.display = 'none';
                        drawNotes();
                }
                
            }

//overlay for new Note
function overlay(){
    document.getElementById('sButton').setAttribute('onclick', "submitNote(-1)");
    document.getElementById('blackOverlay').style.height = ph+'px';
    document.getElementById('blackOverlay').style.width = pw+'px';
    document.getElementById('blackOverlay').style.visibility = 'visible';
    document.getElementById('newNote').style.display = 'inline-block';
    document.getElementById('newNote').style.visibility = 'visible';
    document.getElementById('noteText').focus();
    document.getElementById('noteText').value = "Write Note Here(500 char max)";
}

//overlay for edit note
function editOverlay(x){
    document.getElementById('sButton').setAttribute('onclick', "submitNote("+x+")");
    document.getElementById('blackOverlay').style.height = ph+'px';
    document.getElementById('blackOverlay').style.width = pw+'px';
    document.getElementById('blackOverlay').style.visibility = 'visible';
    document.getElementById('newNote').style.display = 'inline-block';
    document.getElementById('newNote').style.visibility = 'visible';
    document.getElementById('noteText').focus();
    var z = head;
    var str = "Can't Find Node";
    while(z){
        if(z.node.id == x){
            str = z.node.text;
            break;
        }
        z = z.next;
    }
    document.getElementById('noteText').value = str;
}

function closeOverlay(){
    document.getElementById('blackOverlay').style.visibility = 'hidden';
    document.getElementById('newNote').style.visibility = 'hidden';
}
    
function addNote(text){
    var node = new noteNode(text);
    if(head==null){
        head = node;
    }
    else{
        var temp = head;
        while(temp.next!=null){
            temp = temp.next;
        }
        temp.next = node;
    }
}