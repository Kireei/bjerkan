var c;

var bWidth;
var bHeight;
var holes = [];


function load(){
  c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  c.width = 1080;
  c.height = c.width / 16 * 10;
  setInterval(game, 10);
  bWidth = 750;
  bHeight = 650;
  
  for(var i = 0; i < 7 * 6; i++){
    holes.push(new drawCircle())
  }
}

function game(){
  ctx.clearRect(0, 0, c.width, c.height);
  
  ctx.fillStyle = "blue";
  ctx.fillRect(c.width / 2 - bWidth / 2, c.height - bHeight, bWidth, bHeight);
  
  drawCircle(500, 500, 50, "red");
}

function drawCircle(x, y, radius, color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2*Math.PI);
  ctx.fill();
}