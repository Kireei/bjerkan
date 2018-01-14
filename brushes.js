var c;
var ctx;

var keyLeft;
var keyUp;
var keyRight;
var keyDown;
var keyA;
var keyW;
var keyD;
var keyS;


function load(){
  c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  c.width = 1080;
  c.height = 540;
  document.addEventListener("keydown", keyDownPressed, false);
  document.addEventListener("keyup", keyUpPressed, false);
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
  }, false);
  
  setInterval(mainGame, 10);
  
  awds = new component(0, 0, 100, 100, "red", 0);
  arrows = new component(100, 0, 100, 100, "blue", 1);
}


function mainGame(){
  awds.movement();
  awds.draw();
  arrows.movement();
  arrows.draw();
}

function component(x, y, width, height, color, control){
  
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.control = control;
  
  
  this.movement = function(){
    if(this.control === 0){
      if(keyA){this.x += -4;}
      if(keyW){this.y += -4;}
      if(keyD){this.x += 4;}
      if(keyS){this.y += 4;}
      
    }
    if(this.control == 1){
      if(keyLeft){this.x += -4;}
      if(keyUp){this.y += -4;}
      if(keyRight){this.x += 4;}
      if(keyDown){this.y += 4;}
    }
  };
  this.draw = function(){
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function keyDownPressed(event){
  var keycode = event.keyCode;
  switch(keycode){
    case 37:
      keyLeft = true;
      break;
    case 38:
      keyUp = true;
      break;
    case 39:
      keyRight = true;
      break;
    case 40:
      keyDown = true;
      break;
    case 65:
      keyA = true;
      break;
    case 87:
      keyW = true;
      break;
    case 68:
      keyD = true;
      break;
    case 83:
      keyS = true;
      break;
  }
}

function keyUpPressed(event){
  var keycode = event.keyCode;
  switch(keycode){
    case 37:
      keyLeft = false;
      break;
    case 38:
      keyUp = false;
      break;
    case 39:
      keyRight = false;
      break;
    case 40:
      keyDown = false;
      break;
    case 65:
      keyA = false;
      break;
    case 87:
      keyW = false;
      break;
    case 68:
      keyD = false;
      break;
    case 83:
      keyS = false;
      break;
  }
}