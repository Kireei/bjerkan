var tucan;

var animFrame = 0;

function startaSprite() {
  
  tucan = new sprite("img/tucan.png", 2, 0, 30, 14, 50, 50, 120, 80, 3);
  yta.start();
}

var yta = {
  canvas : document.createElement("canvas"),
  mainBg : document.getElementById("mainBg"),
  
  start : function(){
    this.canvas.width = 720;
    this.canvas.height = 480;
    this.canvas.setAttribute("class", "canvas");
    this.canvas.setAttribute("id", "sprite");
    this.context = this.canvas.getContext("2d");
    mainBg.appendChild(this.canvas);
    this.interval = setInterval(uppdSprite, 20);
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
};

function uppdSprite() {
  yta.clear();
  if(animFrame >= 20){
    tucan.anim();
  }
  tucan.update();
  animFrame++;
}


function sprite(src, sx, sy, sw, sh, x, y, width, height, ind) {
  img = new Image();
  this.x = x;
  this.y = y;
  this.sx = sx;
  this.sy = sy;
  this.sw = sw;
  this.sh = sh;
  this.width = width;
  this.height = height;
  this.ind = ind;
  
  this.update = function(){
    ctx = yta.context;
    
    ctx.drawImage(img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height);
    img.src = src;
  };
  animI = 0;
  this.anim = function(){
    while(animI < this.ind){
      this.sy = this.sh * animI;
      console.log(animI);
      animI++;
      
    }
    if(animI == this.ind) {
      animI = 0;
    }
  };
}

var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

