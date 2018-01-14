function start(){
  c = document.getElementById("snakegame");
  
  c.width = WIDTH;
  c.height = HEIGHT;
  ctx = c.getContext("2d");
  document.addEventListener("keydown", keysDown);
  document.addEventListener("keyup", keysUp);
  interval = setInterval(game, 1000 / diff);
  running = true;
}

WIDTH = 800;
HEIGHT = 800;

px = py = 10;
qx = qy = 30;
gc = tc = 20;
ax = Math.floor(Math.random() * gc);
ay = Math.floor(Math.random() * gc);
sX = sY = 0;
sqX = sqY = 0;

trail = [];
tail = 5;
trailQ = [];
tailQ = 5;

var diff = 10;

space = false;
running = false;
button = 0;

var score;
var nhs = window.localStorage.getItem("highscore");




function game(){
  px += sX;
  py += sY;
  
  if(px < 0){
    running = false;
  }
  if(px > 2 * tc - 1){
    running = false;
  }
  if(py < 0){
    running = false;
  }
  if(py > 2 * tc - 1){
    running = false;
  }
  qx += sqX;
  qy += sqY;
  
  if(qx < 0){
    running = false;
  }
  if(qx > 2 * tc - 1){
    running = false;
  }
  if(qy < 0){
    running = false;
  }
  if(qy > 2 * tc - 1){
    running = false;
  }
  
  
  ctx.fillStyle = "#4ABDAC";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  score = tail + tailQ - 10;
  
  if(score > nhs){
    window.localStorage.setItem("highscore", score);
    nhs = window.localStorage.getItem("highscore");
  }
  ctx.textAlign = "center";
  ctx.font = "48px Montserrat";
  ctx.fillStyle = "#797E87";
  ctx.shadowColor = "#30343A";
  //ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText("SCORE:" + score, WIDTH / 2, 400);
  ctx.font = "24px Montserrat";
  ctx.fillText("HIGHSCORE: " + nhs, WIDTH / 2, 425);
  
  ctx.shadowColor = null;
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.fillStyle = "#F7B733";
  for(var i = 0; i < trail.length; i++){
    ctx.fillRect(trail[i].x * gc, trail[i].y * gc, gc - 2, gc - 2);
    if(trail[i].x == px && trail[i].y == py && tail > 5){
      running = false;
      console.log("Dead");
    }
    if(qx == trail[i].x && qy == trail[i].y){
      running = false;
    }
  }
  
  trail.push({x: px, y: py});
  while (trail.length > tail){
    trail.shift();
  }
  
  ctx.fillStyle = "#DFDCE3";
  for(var i = 0; i < trailQ.length; i++){
    ctx.fillRect(trailQ[i].x * gc, trailQ[i].y * gc, gc - 2, gc - 2);
    if(trailQ[i].x == qx && trailQ[i].y == qy && tailQ > 5){
      running = false;
      console.log("Dead");
    }
    if(px == trailQ[i].x && py == trailQ[i].y){
      running = false;
    }
  }
  
  trailQ.push({x: qx, y: qy});
  while (trailQ.length > tailQ){
    trailQ.shift();
  }
  
  if (ax == px && ay == py){
    tail += 10;
    
    ax = Math.floor(Math.random() * tc * 2);
    ay = Math.floor(Math.random() * tc * 2);
    for(var i = 0; i < trail.length; i++){
      if(trail[i].x == ax && trail[i].y == ay){
        ax = Math.floor(Math.random() * tc * 2);
        ay = Math.floor(Math.random() * tc * 2);
      }
    }
  }
  if (ax == qx && ay == qy){
    tailQ += 10;
    
    ax = Math.floor(Math.random() * tc * 2);
    ay = Math.floor(Math.random() * tc * 2);
    for(var i = 0; i < trail.length; i++){
      if(trailQ[i].x == ax && trailQ[i].y == ay){
        ax = Math.floor(Math.random() * tc * 2);
        ay = Math.floor(Math.random() * tc * 2);
      }
    }
  }
  ctx.fillStyle = "#FC4A1A";
  ctx.fillRect(ax * gc, ay * gc, gc - 2, gc - 2);
  
  if(!running && button === 0){
    setTimeout(stop, 200);
    
  }
  
  
  
  
}
function keysDown(e){
  var keyCode = e.keyCode;
  switch(keyCode){
    case 65:
      if(sX == 1){
        sX == 1;
      } else {
        sX = -1;
        sY = 0;
      }
      break;
    case 87:
      if(sY == 1){
        sY == 1;
      } else {
        sX = 0;
        sY = -1;
      }
      break;
    case 83:
      if(sY == -1){
        sY == -1;
      } else {
        sX = 0;
        sY = 1;
      }
      break;
    case 68:
      if(sX == -1){
        sX == -1;
      } else {
        sX = 1;
        sY = 0;
      }
      break;
    case 32:
      running = false;
      stop();
      restart();
      break;
    case 37:
      if(sqX == 1){
        sqX == 1;
      } else {
        sqX = -1;
        sqY = 0;
      }
      break;
    case 38:
      if(sqY == 1){
        sqY == 1;
      } else {
        sqX = 0;
        sqY = -1;
      }
      break;
    case 39:
      if(sqX == -1){
        sqX == -1;
      } else {
        sqX = 1;
        sqY = 0;
      }
      break;
    case 40:
      if(sqY == -1){
        sqY == -1;
      } else {
        sqX = 0;
        sqY = 1;
      }
      break;
  }
  
}

function keysUp(e){
  var keyCode = e.keyCode;
  switch(keyCode){
    case 70:
      space = false;
      break;
  }
}

function stop(){
  clearInterval(interval);
  
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  ctx.fillStyle = "#4ABDAC";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  
  ctx.textAlign = "center";
  ctx.font = "48px Montserrat";
  ctx.fillStyle = "#F7B733";
  ctx.shadowColor = "#30343A";
  
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText("GAME OVER", 400, 400);
  
  
  
  ctx.font = "24px Montserrat";
  ctx.fillStyle = "#797E87";
  ctx.fillText("SCORE: " + score, 400, 425);
  ctx.fillText("HIGHSCORE: " + nhs, 400, 455);
  
  
  
  window.localStorage.setItem("latestScore", score);
  console.log(localStorage.getItem("latestScore"));
  if(localStorage.getItem("latestScore") > localStorage.getItem("highscore")){
    nhs = localStorage.getItem("latestScore");
    
    localStorage.setItem("highscore", nhs);
    console.log("NEW HIGHSCORE " + nhs);
  }
  
  
  if(button < 1){
    main = document.getElementById("mainBg");
    r = document.createElement("button");
    r.setAttribute("id", "restartSnake");
    r.setAttribute("type", "button");
    r.setAttribute("onclick", "restart()");
    r.innerHTML = "RESTART";
    main.appendChild(r);
    button++;
    
  }
}

function restart(){
  console.log("Restart button pressed");
  r = document.getElementById("restartSnake");
  
  main = document.getElementById("mainBg");
  main.removeChild(r);
  //ctx.clearRect(0, 0, WIDTH, HEIGHT);
  running = true;
  button = 0;
  trail.length = 0;
  trailQ.length = 0;
  start();
  px = py = 10;
  qx = qy = 30;
  tail = 5;
  tailQ = 5;
  sX = sY = 0;
  sqX = sqY = 0;
  a = document.createElement("audio");
  s = document.createElement("source");
  a.autoplay = true;
  a.loop = true;
  s.setAttribute("src", "eye.mp3");
  s.setAttribute("type", "audio/mpeg");
  document.body.appendChild(a);
  a.appendChild(s);
  
}

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);