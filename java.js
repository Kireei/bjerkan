 
    function knappEtt() {
     var f = prompt("Hej?");
     f;
     
     if(f.length > 0) {
       document.getElementById("d").innerHTML = "HEJHEJHEJHEJHEJHEJHEJHEJHEJHEJHEJHEJHEJHEJHEJHEJ";
       
     }
     else {
       document.getElementById("demo").innerHTML = "HEJDÅ";
     }
      
      
        
    }
    
    function knappTva(){
      document.getElementById("d").innerHTML = "Bra Jobbat";
        
    }
    
    function lista(){
      var nummer = document.getElementById("s1");
      var svar = nummer.options[nummer.selectedIndex].value;
      document.getElementById("p2").innerHTML = svar;
      
    }
    
    var knapp = 1;
    
    function ruta(){
      var div = document.createElement("div");
      var body = document.body;
      var d = document.getElementById("d");
      
      knapp++;
      if(knapp % 2 === 0) {
        body.appendChild(div);
        div.setAttribute("id", "d");
        div.setAttribute("class", "d");
        div.setAttribute("onClick","knappTva()");
      } else if (knapp % 2 > 0) {
        body.removeChild(d);
      }
    }
        
        
    
      
    function tid(){
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();
      m = tidMs(m);
      s = tidMs(s);
      document.getElementById("klocka").innerHTML = h + ":" + m + ":" + s;
      
      var t = setTimeout(tid, 500);
        
    }
      
    function tidMs(i) {
      if(i < 10) {
        i = "0" + i;}
        return i;
          
        
    }
      
function lunch() {
    
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var dag = today.getDay();
    var tid = h * 60 + m;
      
    if (dag === 1 && (705 < tid && tid < 745)) {
      document.getElementById("lunch").innerHTML = "Är det lunch? Ja";
      
    } else if (dag === 2 && (705 <= tid && tid <= 750)) {
      document.getElementById("lunch").innerHTML = "Är det lunch? Ja";
    
    } else if (dag === 3 && (710 <= tid && tid <= 750)) {
      document.getElementById("lunch").innerHTML = "Är det lunch? Ja";
    
    } else if (dag === 4 && (705 <= tid && tid <= 750)) {
      document.getElementById("lunch").innerHTML = "Är det lunch? Ja";
    
    } else if (dag === 5 && (650 <= tid && tid <= 715)) {
      document.getElementById("lunch").innerHTML = "Är det lunch? Ja";
    
    } else {
      document.getElementById("lunch").innerHTML = "Är det lunch? Nej";
  }
    
    var t = setTimeout(lunch, 60000);
      
}

function uppLeet() {
    
    setInterval(noLeet, 500);
    setInterval(leet, 500);
    
}
  test = 0;
function leet() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var tid = h * 60 + m;
  
  
  var li = document.createElement("li");
  var a = document.createElement("a");
  var lista = document.getElementById("lista");
  
  
  
    
  
  if (tid === 817 && test === 0){
    lista.insertBefore(li, lista.childNodes[9]);
    li.insertBefore(a, li.childNodes[0]);
    a.setAttribute("href", "leet.html");
    a.innerHTML = "Leet";
    test++;
  }
  
}

function noLeet(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var tid = h * 60 + m;
  
  if(817 < tid && tid > 819 ){
    window.location.href = "klocka.html";
  }
}

function audioClick(audio){
  var snd = new Audio(audio);
  snd.play();
  snd.currentTime=0;
}