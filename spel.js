var spelBox;
var spelHinder = [];
var points;
var spelare = 2;

var speedX = 5;
var speedY = 5;

var go = false;

function players() {
  
  p1 = document.createElement("button");
  p1.setAttribute("id", "p1");
  p1.setAttribute("class", "players");
  p1.setAttribute("onclick", "enSpelare()");
  p1.innerHTML = "En spelare";
  document.getElementById("mainBg").appendChild(p1);
  
  p2 = document.createElement("button");
  p2.setAttribute("id", "p2");
  p2.setAttribute("class", "players");
  p2.setAttribute("onclick", "tvaSpelare()");
  p2.innerHTML = "Två spelare";
  document.getElementById("mainBg").appendChild(p2);
}

function tvaSpelare() {
  spelare = 2;
  console.log("Antal spelare:" + spelare);
  go = true;
  startaSpel();
}

function enSpelare() {
  spelare = 1;
  console.log("Antal spelare:" + spelare);
  go = true;
  startaSpel();
}

function startaSpel() {
  //document.getElementById("mainBg").removeChild(document.getElementById("p1"));
  //document.getElementById("mainBg").removeChild(document.getElementById("p2"));
  spelBox = new component(30, 30, 10 ,120, "red");
  if(spelare == 2){
    spelBox2 = new component(30, 30, 10, 120, "blue");
    sikte2 = new component(720, 10, 0, spelBox2.y, "#98cae0");
  }
  sikte = new component(720, 10, 0, spelBox.y, "#e09898");
  
  //spelBox = new sprite(60, 30, 10, 120, "tucan.png", "sprite", 0, 0, 32, 48);
  points = new component("30px", "Montserrat", 500, 30, "black", "text");
  
  
  spelYta.start();
  
}

function restart() {
  canvas = document.getElementById("canvas");
  button = document.getElementById("restart");
  canvas.parentNode.removeChild(canvas);
  button.parentNode.removeChild(button);
  for(i = 0; i < spelHinder.length; i++){
    if(spelHinder[i].x <= 720){
      spelHinder.splice(i, 1);
      i--;
    }
  }
  startaSpel();
}


var spelYta = {
  
  canvas : document.createElement("canvas"),
  mainBg : document.getElementById("mainBg"),
  start : function() {
    this.canvas.width = 720;
    this.canvas.height = 480;
    this.canvas.setAttribute("class", "canvas");
    this.canvas.setAttribute("id", "canvas");
    document.addEventListener("keydown", spelKontrollNer, false);
    document.addEventListener("keyup", spelKontrollUp, false);
    this.context = this.canvas.getContext("2d");
    mainBg.insertBefore(this.canvas, mainBg.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(uppdatSpelYta, 20);
    
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
    button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("id", "restart");
    button.setAttribute("onclick", "restart()");
    mainBg.appendChild(button);
    button.innerHTML = "RESTART";
    localStorage.setItem("score", spelYta.frameNo);
    console.log(localStorage.getItem("score"));
    
    
    
  }
};
function everyInterval(n) {
  if((spelYta.frameNo / n) % 1 === 0) {
    return true;
  }
  return false;
}



function component(width, height, x, y, color, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 5;
  this.speedY = 5;
  this.color = color;
  this.x = x;
  this.y = y;
  
  this.update = function() {
    ctx = spelYta.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
    
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  
  this.movement = function(){
  if (keyA === true) {
    moveLeft(this);
  }
  if (keyD === true) {
    moveRight(this);
  }
  if (keyW === true) {
    moveUp(this);
  }
  if (keyS === true) {
    moveDown(this);
  }
  if (keyF === true){
    sizeUp(this);
  }
  if (keyV === true){
    sizeDown(this);
  }
  
  };
  
  this.movement2 = function(){
  if (keyLeft === true) {
    moveLeft(this);
  }
  if (keyRight === true) {
    moveRight(this);
  }
  if (keyUp === true) {
    moveUp(this);
  }
  if (keyDown === true) {
    moveDown(this);
  }
  if (keyF === true){
    sizeUp(this);
  }
  if (keyV === true){
    sizeDown(this);
  }
  
  };
  
  this.border = function() {
    if(this.x < 0) {
      this.x = 0;
    }
    if(this.y < 0) {
      this.y = 0;
    }
    if((this.x + this.width) > spelYta.canvas.width) {
      this.x = spelYta.canvas.width - this.width;
    }
    if((this.y + this.height) > spelYta.canvas.height) {
      this.y = spelYta.canvas.height - this.height;
    }
    if(this.width <= 10){
      this.width = 10;
    
    }
    if(this.width >= 100){
      this.width = 100;
    }
    if(this.height <= 10){
      this.height = 10;
    }
    if(this.height >= 100){
      this.height = 100;
    }
    if(keyF === false && keyV === false) {
      this.width = width;
      this.height = height;
      this.speedX = speedX;
      this.speedY = speedY;
    }
    if (keySpc === true){
    spelYta.stop();
    restart();
    }
  };
  this.newPos = function(){
    this.x += this.speedX;
    this.y += this.speedY;
    
  };
  this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    };
}

function sprite(width, height, x, y, color, type, sx, sy, sw, sh) {
  this.type = type;
  this.image = new Image();
  this.image.src = "tucan.png";
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.sx = sx;
  this.sy = sy;
  this.sw = sw;
  this.sh = sh;
  this.update = function() {
    ctx = spelYta.context;
    if (this.type == "sprite") {
      
      //ctx.drawImage(this.image.src, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height);
      ctx.drawImage(this.image.src,0,0,30,15,10,10,30,15);
      
    } else {
    
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    }

  if (keyA === true) {
    moveLeft();
  }
  if (keyD === true) {
    moveRight();
  }
  if (keyW === true) {
    moveUp();
  }
  if (keyS === true) {
    moveDown();
  }
  if (keyUp === true){
    sizeUp();
    alert("hej");
  }
  if (keyV === true){
    sizeDown();
  }
  
  };
  this.newPos = function(){
    this.x += this.speedX;
    this.y += this.speedY;
    
  };
  
  this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    };
}

function uppdatSpelYta() {
  var x, y;
  
  for(i=0; i < spelHinder.length; i += 1){
    if(spelBox.crashWith(spelHinder[i])){
      spelYta.stop();
      return;
    }
  }
  
  if(spelare == 2){
    for(i=0; i < spelHinder.length; i += 1){
      if(spelBox2.crashWith(spelHinder[i])){
        spelYta.stop();
        return;
      }
    }
  }
  spelYta.clear();
  spelYta.frameNo += 1;
  if (spelYta.frameNo == 1 || everyInterval(60)) {
        x = spelYta.canvas.width;
        y = spelYta.canvas.height - (Math.random()*spelYta.canvas.height*1.5);
        z = y - (470 + Math.random()*40);
        spelHinder.push(new component(10, 450, x, y, "green"));
        spelHinder.push(new component(10, 450, x, z, "green"));
    }
  
  
  //spelBox.newPos();
  
  spelBox.movement();
  if(spelare == 2){spelBox2.movement2();}
  sikte.height = spelBox.height;
  sikte.y = spelBox.y;
  sikte.update();
  if(spelare == 2){
    sikte2.height = spelBox2.height;
    sikte2.y = spelBox2.y;
    sikte2.update();
  }
  spelBox.border();
  if(spelare == 2){spelBox2.border();}
  spelBox.update();
  if(spelare ==2){spelBox2.update();}
  for(i=0; i < spelHinder.length; i += 1){
    
    
    if(spelHinder[i].x < 100){
      spelHinder.splice[i, 1];
      console.log("splice");
    }
    spelHinder[i].x -= 7;
    spelHinder[i].update();
  }
  for(i = 0; i < spelHinder.length; i++){
    if((spelHinder[i] > spelBox.x) && ((spelHinder[i].y + spelHinder[i].height) < sikte.y < spelHinder[i].y)){
      console.log("släck");
    }
  }
  points.text = "SCORE:" + spelYta.frameNo;
  points.update();
  
  
}

function moveUp(obj) {
  obj.y -= obj.speedY;
}

function moveDown(obj) {
  obj.y += obj.speedY;
}

function moveLeft(obj) {
  obj.x -= obj.speedX;
}

function moveRight(obj) {
  obj.x += obj.speedX;
}

function sizeUp(obj) {
  obj.width += 1;
  obj.height += 1;
  
  obj.color = "blue";
  obj.speedX = 2.5;
  obj.speedY = 2.5;
  
}

function sizeDown(obj) {
  obj.width -= 1;
  obj.height -= 1;
  
  obj.speedX = 10;
  obj.speedY = 6;
}

function spelKontrollNer(event) {
  var keycode = event.keyCode;
  switch (keycode) {
    case 68:
      keyD = true;
      break;
    case 65:
      keyA = true;
      break;
    case 87:
      keyW = true;
      break;
    case 83:
      keyS = true;
      break;
    case 70:
      keyF = true;
      break;
    case 86:
      keyV = true;
      break;
    case 39:
      keyRight = true;
      break;
    case 37:
      keyLeft = true;
      break;
    case 38:
      keyUp = true;
      break;
    case 40:
      keyDown = true;
      break;
    case 32:
      keySpc = true;
      break;
  }
}

function spelKontrollUp(event) {
  var keycode = event.keyCode;
  switch (keycode) {
    case 68:
      keyD = false;
      break;
    case 65:
      keyA = false;
      break;
    case 87:
      keyW = false;
      break;
    case 83:
      keyS = false;
      break;
    case 70:
      keyF = false;
      break;
    case 86:
      keyV = false;
      break;
    case 39:
      keyRight = false;
      break;
    case 37:
      keyLeft = false;
      break;
    case 38:
      keyUp = false;
      break;
    case 40:
      keyDown = false;
      break;
    case 32:
      keySpc = false;
      break;
    
  }
}

var keyA = false;
var keyS = false;
var keyD = false;
var keyW = false;
var keyF = false;
var keyV = false;
var keyRight = false;
var keyLeft = false;
var keyUp = false;
var keyDown = false;
var keySpc = false;

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

