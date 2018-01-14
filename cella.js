var c;
var WIDTH = 1080;
var HEIGHT = WIDTH / 2;
var RATIO_X = 270; // 1080, 540, 360, 270, 180, 72, 36, 18
var RATIO_Y = RATIO_X / 2;
var CELLSIZE = WIDTH / RATIO_X;
var UPS = 100;
var cells = [];
var newCells = [];
var nCells = 1000;
var targetCells = 0;
var strength = [];
var cellAmount = [];
var colors = [];
var cellPlace = 0;

var maxStr = 0;
var minStr = 0;

var date = new Date();
var start = 0;
var time = 0;

var space = false;
var mode = 0;


function load(){
  c = document.getElementById("cella");
  c.width = WIDTH;
  c.height = HEIGHT;
  ctx = c.getContext("2d");
  if(c){console.log("Canvas loaded");}
  window.addEventListener("keydown", keyPressed);
  x = 0;
  y = 0;
  for(var i = 0; i < RATIO_X * RATIO_Y; i++){
    if(x == WIDTH / CELLSIZE){x=0; y++;}
    cells.push(new cell(x * CELLSIZE, y * CELLSIZE, "white", true, Math.random(), Math.round(Math.random() * 10)));
    x++;
    //console.log(x + ", " + y);
  }
  start = date.getTime();

  createCells();
  drawCells();
  setInterval(drawCells, 1000 / UPS);
}

function drawCells(){
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  

  updateCells();
  
  
  for(var i = 0; i < RATIO_X * RATIO_Y; i++){
    if(mode == 1){
      
      var str = cells[i].strength;
      if(str > maxStr){maxStr = str;}
      var c = 255 - Math.round(255 * (str - 100) / (maxStr - 100));
      ctx.fillStyle = "rgb(" + c + ", " + c + ", 255)";
    }
      
    else if(mode == 2){
      
      var age = cells[i].age;
      var a = 255 - Math.round(255 * age / 50);
      ctx.fillStyle = "rgb( 255," + a + ", " + a + ")";
    }
    
    else if(mode === 0){ctx.fillStyle = cells[i].color;}
    
    ctx.fillRect(cells[i].x, cells[i].y, CELLSIZE, CELLSIZE);
  }
  date = new Date();
  time = date.getTime();
  
  if(space){
    ctx.fillStyle = "#30343A80";
    ctx.fillRect(0, 0, 300, cellPlace - 12);
    cellPlace = 16;
  
    for(var j = 1; j < cellAmount.length; j++){
      if(cellAmount[j] === 0){continue;}
      
      ctx.font = "16px Montserrat";
      ctx.fillStyle = colors[j];
      ctx.fillText("Color " + j + " Avg. str:" + Math.round(getAverageStrength(j)) + " Amount: " + cellAmount[j], 0, cellPlace);
      
      cellPlace += 16;
      
    }
  }
  
  
  time = date.getTime();
  
  
}

function updateCells(){
  newCells = cells;
  
  for(i = 0; i < cellAmount.length; i++){
    cellAmount[i] = 0;
    strength[i] = 0;
  }
  for(var i = 0; i < cells.length; i++){
    
    if(i < RATIO_X){continue;}
    if(i > cells.length - (RATIO_X + 1)){continue;}
    
    dir = Math.floor(Math.random() * 4);
    if(dir === 0){targetCell = i - RATIO_X;}
    if(dir == 1){targetCell = i + 1;}
    if(dir == 2){targetCell = i + RATIO_X;}
    if(dir == 3){targetCell = i - 1;}
    
    if(cells[i].age > 50 && Math.random() < 0.5){
      cells[i].color = "white";
      cells[i].id = 0;
      cells[i].age = 0;
      cells[i].strength = 100;
      cellAmount[0] += 1;
    }
    if(i % RATIO_X === 0){cells[i].color = "black";}
    if(i % RATIO_X === RATIO_X / 2){cells[i].color = "black";}
    if(i % RATIO_X === RATIO_X){cells[i].color = "black";}
    if(i > RATIO_Y * RATIO_X / 2 - RATIO_X * 0.5 && i < RATIO_Y * RATIO_X / 2 + RATIO_X * 0.5){cells[i].color = "black";}

    if(cells[i].color == "black"){continue;}
    if(cells[targetCell].color == "black")
    if(cells[i].color == "white"){cells[i].age = 0;}
    
    if(cells[targetCell].color == "white" && cells[i].reprod > 1){
      if(cells[i].reprod > 1){
        newCells[targetCell].color = cells[i].color;
        newCells[i].reprod = Math.random() * 0.1;
        newCells[targetCell].reprod = 0;
        newCells[targetCell].strength = cells[i].strength;
        newCells[targetCell].id = cells[i].id;
        newCells[targetCell].age = 0;
        if(Math.random() < 0.001){
          newCells[targetCell].strength += 2;
        }
          if(Math.random() < 0.001){
            newCells[targetCell].strength -= 2;
        }
        
      } else {
        cells[i].color = "white";
        cells[i].id = 0;
        cells[i].age = 0;
        cellAmount[0] += 1;
      }

    } else if (cells[targetCell].id != cells[i].id && cells[i].color != "white" && cells[i].strength > newCells[targetCell].strength && cells[i].reprod > 1){
        newCells[targetCell].id = cells[i].id;
        newCells[targetCell].color = cells[i].color;
        newCells[targetCell].strength = cells[i].strength;
        newCells[targetCell].age = 0;
        
        if(Math.random() < 0.001){
        newCells[targetCell].strength += 2;
        }
        
        if(Math.random() < 0.001){
          newCells[targetCell].strength -= 2;
        }
    }
    if(Math.random() < 0.001){cells[i].age++;}
    if(cells[i].color == "white"){cells[i].strength = 0;}
    cellAmount[newCells[i].id]++;
    strength[newCells[i].id] += newCells[i].strength;
    
    newCells[i].reprod += 0.1;
    newCells[i].age++;
  }
  cells = newCells;
  
}

function keyPressed(event){
  switch(event.keyCode){
    case 69:
      space = !space;
      console.log("List Toggled");
      break;
    case 220:
      mode = 0;
      console.log("Normal Mode Toggled");
      break;
    case 49:
      mode = 1;
      console.log("Strength Mode Toggled");
      break;
    case 50:
      mode = 2;
      console.log("Age Mode Toggled");
      break;
  }
}

function getRandomColor(){
  var letters = "0123456789ABCDEF";
  var color = "#";
  for(var i = 0; i < 6; i++){
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function cell(x, y, color, spreadable, fitness, age){
  this.x = x;
  this.y = y;
  
  this.color = color;
  this.spreadable = spreadable;
  this.fitness = fitness;
  this.age = age;
  this.reprod = 1;
  this.strength = 100;
  
  this.reset = function(){
    this.color = "white";
    this.spreadable = true;
    this.fitness = Math.random();
    this.age = 0;
  }
}



function spreadCells(i){
  if(i < RATIO_X){
      return;
    }
    if(i > cells.length - (RATIO_X + 1)){
      return;
    }
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      targetCell = -RATIO_X;
      break;
    case 1:
      targetCell = 1;
      break;
    case 2:
      targetCell = RATIO_X;
      break;
    case 3:
      targetCell =  -1;
      break;
  }
  if(cells[i + targetCell].color = "#FFFFFF" && cells[i].reprod > 1){
    newCells[i + targetCell].color = cells[i].color;
  } else if (cells[i + targetCell].id != cells[i].id && cells[i + targetCell].strength < cells[i].strength){
   newCells[i + targetCell].color = cells[i].color;
  }
}

function createCells(){
  colors[0] = "#FFFFFF";
  for(var i = 0; i < nCells; i++){
    var n = Math.round(Math.random() * RATIO_X * (RATIO_Y - 2) + RATIO_X)
    var c = getRandomColor();
    cells[n].color = c;
    cells[n].id = i + 1;
    cells[n].age = 0;
    cells[n].strength = 100 + Math.random() ;
    cells[n].reprod = 0.9;
    cellAmount[i] = 0;
    colors[i + 1] = c;
    
  }
}

function getAverageStrength(i){
  var avg = strength[i] / cellAmount[i];
  
  return avg;
}