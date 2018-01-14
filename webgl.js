var c;
var gl;
var verticesCUBE;
var indicesCUBE;
var program;

var transformationMatrixUniformLocation;
var viewMatrixUniformLocation;
var projectiontionMatrixUniformLocation;

var transformationMatrix;
var viewMatrix;
var projectionMatrix;

var identityMatrix;

var camX = 0;
var camY = 0;
var camZ = 0;

var camTX = 0;
var camTY = 0;
var camTZ = 0;

var cube;

var cubes = [];
var cubesVert = [];
var cubesInd = [];

var vertices = [];
var indices = [];

var triangleVBO;
var indexVB;



var keyA;
var keyW;
var keyD;
var keyS;
var keySPC;
var keyLSHIFT;




function init(){
  c = document.getElementById("canvas");
  c.width = 1200;
  c.height = 600;
  gl = c.getContext("webgl");
  
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  
  cube = new entityCube(0,0,0, 10, 1, 0.5, 1);
  
  var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec3 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "uniform mat4 transformationMatrix;",
  "uniform mat4 viewMatrix;",
  "uniform mat4 projectionMatrix;",
  "",
  "void main(){",
  " fragColor = vertColor;",
  " gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4(vertPosition, 1.0);",
  "}"
  ].join("\n");
  
var fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main(){",
  "",
  " gl_FragColor = vec4(fragColor, 1.0);",
  "}"
  ].join("\n");
  
  
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);
  
  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    console.error("Error compiling vertexshader", gl.getShaderInfoLog(vertexShader));
    return;
  }
  
  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error("Error compiling fragmentshader", gl.getShaderInfoLog(fragmentShader));
    return;
  }
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error("ERROR linking program", gl.getProgramInfoLog(program));
    return;
  }
  
  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
    console.error("ERROR Validating program!", gl.getProgramInfoLog(program));
    return;
  }
  
  
  verticesCUBE = [
      
      -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
    
    ];
    
  indicesCUBE = [
    0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
    ];
    
  
  var y = 0;
  for(var i = 0; i < 10000; i++){
    
    if(i % 100 === 0){
      x = 0;
      y++;
    } else{
      x++;
    }
    cubes.push(new entityCube(x , y, 0, 1, (i + 1) / 10000, 500 / Math.pow((i + 1), 0.90), Math.sqrt(i + 1)));
    for(var j = 0; j < cubes[i].vertices.length; j++){
      vertices.push(cubes[i].vertices[j]);
    }
    for(var k = 0; k < cubes[i].indices.length; k++){
      indices.push(cubes[i].indices[k] + cubes[i].vertices.length / 6 * i);
    }
  }
  
  triangleVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  indexBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
  var normalsAttribLocation = gl.getAttribLocation(program, "vertNormals");
  
  gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  //gl.vertexAttribPointer(normalsAttribLocation, 3, gl.FLOAT, gl.FALSE, 9 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
  
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
  
  gl.useProgram(program);
  
  transformationMatrixUniformLocation = gl.getUniformLocation(program, "transformationMatrix");
  viewMatrixUniformLocation = gl.getUniformLocation(program, "viewMatrix");
  projectionMatrixUniformLocation = gl.getUniformLocation(program, "projectionMatrix");
  
  transformationMatrix = new Float32Array(16);
  viewMatrix = new Float32Array(16);
  projectionMatrix = new Float32Array(16);
  
  mat4.identity(transformationMatrix);
  mat4.lookAt(viewMatrix,[camX, camY, camZ], [0, 0, 0],[0, 1, 0]);
  mat4.perspective(projectionMatrix, glMatrix.toRadian(90), c.width / c.height, 0.1, 1000.0);
  
  gl.uniformMatrix4fv(transformationMatrixUniformLocation, gl.FALSE, transformationMatrix);
  gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
  
  identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  var angle = 0;
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  
   var update = function(){
    var startTime = performance.now();
    
    prepare();
    movement();
    render();
    
    
    var currentTime = performance.now();
    //console.log( 1000 / (currentTime - startTime));
    
    requestAnimationFrame(update);
   };
   requestAnimationFrame(update);
   
  //gl.disableVertexAttribArray(positionAttribLocation);
  
    
    
}
function render(){
    angle = performance.now() / 1000 / 6 * 10 * Math.PI;
    //mat4.rotate(transformationMatrix, identityMatrix, angle, [5, 10, 0]);
  
    gl.uniformMatrix4fv(transformationMatrixUniformLocation, gl.FALSE, transformationMatrix);
    mat4.lookAt(viewMatrix,[camX, camY, camZ], [camX, camY, camZ - 1],[0, 1, 0]);
    gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
    
    triangleVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    indexBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.deleteBuffer(triangleVBO);
    gl.deleteBuffer(indexBO);
}

function movement(){
  if(keyA){camX -= 0.5;}
  if(keyD){camX += 0.5;}
  if(keyW){camZ -= 0.5;}
  if(keyS){camZ += 0.5;}
  if(keySPC){camY += 0.5;}
  if(keyLSHIFT){camY -= 0.5;}
  
}

function prepare(){
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(1.0,1.0,1.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}




  
  
function keyDown(e){
  var keycode = e.keyCode;
  switch(keycode){
    case 65:
      keyA = true;
      break;
    case 87:
      keyW = true;
      break;
    case 83:
      keyS = true;
      break;
    case 68:
      keyD = true;
      break;
    case 32:
      keySPC = true;
      break;
    case 16:
      keyLSHIFT = true;
      break;
  }
  
}

function keyUp(e){
  var keycode = e.keyCode;
  switch(keycode){
    case 65:
      keyA = false;
      break;
    case 87:
      keyW = false;
      break;
    case 83:
      keyS = false;
      break;
    case 68:
      keyD = false;
      break;
    case 32:
      keySPC = false;
      break;
    case 16:
      keyLSHIFT = false;
      break;
  }
  
}

function entityCube(x, y, z, size, r, g, b){
  this.x = x;
  this.y = y;
  this.z = z;
  this.size = size;
  
  
  this.vertices = [
    
    x, y, z, r, g, b, // 0
    x, y, z - size, r, g, b, // 1
    x + size, y, z - size , r, g, b, // 2
    x + size, y, z, r, g, b, // 3
    x, y - size, z - size , r, g, b, // 4
    x + size, y - size, z - size, r, g, b,  // 5
    x + size, y - size, z, r, g, b,  // 6
    x, y - size, z, r, g, b // 7
  ];
    
  this.indices = [
      //TOP
      0, 2, 1,
      0, 3, 2,
      
      //LEFT
      0, 1, 4,
      0, 4, 7,
      
      //BOTTOM
      7, 4, 5,
      7, 5, 6,
      
      //RIGHT
      6, 5, 2,
      6, 2, 3,
      
      //FRONT
      6, 3, 0,
      6, 0, 7,
      
      //BACK
      5, 4, 1,
      5, 1, 2
    ];

}

function entityLight(x, y, z, r, g, b){
  this.x = x;
  this.y = y;
  this.z = z;
  
  this.r = r;
  this.g = g;
  this.b = b;
}
