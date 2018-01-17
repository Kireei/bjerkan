var c;
var gl;
var verticesCUBE;
var indicesCUBE;
var program;

var positionAttribLocation;
var colorAttribLocation;
var normalsAttribLocation;
var texCoordsAttribLocation;

var transformationMatrixUniformLocation;
var viewMatrixUniformLocation;
var projectiontionMatrixUniformLocation;
var lightColorUniformLocation;
var lightPositionUniformLocation;
var ambientLightUniformLocation;

var transformationMatrix;
var viewMatrix;
var projectionMatrix;

var identityMatrix;

var camX = 50;
var camY = 50;
var camZ = 10;
var camSpeed = 0.5;

var cube;

var cubes = [];
var cubesVert = [];
var cubesInd = [];

var vertices = [];
var indices = [];

var triangleVBO;
var indexVB;

var boxTexture;

var light;


var viewAngleHor = -1.58;
var viewAngleVer = 1.58;

var keyA;
var keyW;
var keyD;
var keyS;
var keySPC;
var keyLSHIFT;
var keyLEFT;
var keyUP;
var keyRIGHT;
var keyDOWN;




function init(){
  c = document.getElementById("canvas");
  c.width = 1200;
  c.height = 600;
  gl = c.getContext("webgl");
  
  c.requestPointerLock = c.requestPointerLock;
  
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  c.requestPointerLock();
  
  cube = new entityCube(0,0,0, 10, 1, 0.5, 1);
  light = new entityLight(50, 50, 10, 1, 1, 1);
  
  var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec3 vertPosition;",
  "attribute vec3 vertColor;",
  "attribute vec3 vertNormals;",
  "attribute vec2 vertTexCoords;",
  "varying vec2 fragTexCoords;",
  "varying vec3 fragColor;",
  "varying vec3 surfaceNormal;",
  "varying vec3 toLightVector;",
  "varying vec3 toCameraVector;",
  "uniform mat4 transformationMatrix;",
  "uniform mat4 viewMatrix;",
  "uniform mat4 projectionMatrix;",
  "uniform vec3 lightPosition;",
  "uniform vec3 cameraPosition;",
  "",
  "void main(){",
  "",
  " vec4 worldPosition = transformationMatrix * vec4(vertPosition, 1.0);",
  " fragColor = vertColor;",
  " fragTexCoords = vertTexCoords;",
  " gl_Position = projectionMatrix * viewMatrix * worldPosition;",
  " surfaceNormal = (transformationMatrix * vec4(vertNormals, 0.0)).xyz;",
  " toLightVector = lightPosition - worldPosition.xyz;",
  " toCameraVector = cameraPosition - worldPosition.xyz;",
  "}"
  ].join("\n");
  
var fragmentShaderText = [
  "precision mediump float;",
  "",
  "",
  "varying vec3 toLightVector;",
  "varying vec3 surfaceNormal;",
  "varying vec3 fragColor;",
  "varying vec2 fragTexCoords;",
  "uniform sampler2D sampler;",
  "uniform vec3 lightColor;",
  "uniform vec3 ambientLight;",
  "void main(){",
  "",
  " vec3 unitNormal = normalize(surfaceNormal);",
  " vec3 unitLightVector = normalize(toLightVector);",
  " vec3 diffuse = ambientLight + lightColor * max(dot(unitNormal, unitLightVector), 0.0);",
  " gl_FragColor =  vec4(diffuse, 1.0) * vec4(fragColor, 1.0) * texture2D(sampler, fragTexCoords);",
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
    // Top
    -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,    0.0, 1.0, 0.0,   0.0, 0.0,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,    0.0, 1.0, 0.0,   0.0, 0.0,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,    0.0, 1.0, 0.0,   0.0, 0.0,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,    0.0, 1.0, 0.0,   0.0, 0.0,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5, -1.0, 0.0, 0.0,   0.0, 0.0,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5, -1.0, 0.0, 0.0,   0.0, 0.0,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5, -1.0, 0.0, 0.0,   0.0, 0.0,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5, -1.0, 0.0, 0.0,   0.0, 0.0,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,  1.0, 0.0, 0.0,   0.0, 0.0,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,  1.0, 0.0, 0.0,   0.0, 0.0,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,  1.0, 0.0, 0.0,   0.0, 0.0,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,  1.0, 0.0, 0.0,   0.0, 0.0,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,    0.0, 0.0, 1.0,   0.0, 0.0,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,   0.0, 0.0, 1.0,   0.0, 0.0,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,  0.0, 0.0, 1.0,   0.0, 0.0,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,   0.0, 0.0, 1.0,   0.0, 0.0,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,   0.0, 0.0, -1.0,  0.0, 0.0,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,  0.0, 0.0, -1.0,  0.0, 0.0,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15, 0.0, 0.0, -1.0,  0.0, 0.0,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,  0.0, 0.0, -1.0,  0.0, 0.0,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,   0.0, -1.0, 0.0,  0.0, 0.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,   0.0, -1.0, 0.0,  0.0, 0.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,   0.0, -1.0, 0.0,  0.0, 0.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,   0.0, -1.0, 0.0,  0.0, 0.0
    
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
  var z = 0;
  
  for(var i = 0; i < 10000; i++){
    
    if(i % 100 === 0){
      x = 0;
      //y++;
      z++;
    } else{
      x++;
    }
    y =  2 * Math.sin(20000 * x) * Math.cos(20000 * z) / 0.7 + (Math.random() - 0.5);
    cubes.push(new entityCube(x , y, -z, 1, 1 - z / 100, 1 - z / 100, 1 - z / 100));
    for(var j = 0; j < cubes[i].vertices.length; j++){
      vertices.push(cubes[i].vertices[j]);
    }
    for(var k = 0; k < cubes[i].indices.length; k++){
      indices.push(cubes[i].indices[k] + cubes[i].vertices.length / 11 * i);
    }
    
  }
  
  triangleVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  indexBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  colorAttribLocation = gl.getAttribLocation(program, "vertColor");
  normalsAttribLocation = gl.getAttribLocation(program, "vertNormals");
  texCoordsAttribLocation = gl.getAttribLocation(program, "vertTexCoords");
  
  gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 11 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 11 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.vertexAttribPointer(normalsAttribLocation, 3, gl.FLOAT, gl.FALSE, 11 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
  gl.vertexAttribPointer(texCoordsAttribLocation, 3, gl.FLOAT, gl.FALSE, 11 * Float32Array.BYTES_PER_ELEMENT, 9 * Float32Array.BYTES_PER_ELEMENT);
  
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.enableVertexAttribArray(normalsAttribLocation);
  gl.enableVertexAttribArray(texCoordsAttribLocation);
  
  boxTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, boxTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("cage"));
  gl.bindTexture(gl.TEXTURE_2D, null);
  
  
  gl.useProgram(program);
  
  transformationMatrixUniformLocation = gl.getUniformLocation(program, "transformationMatrix");
  viewMatrixUniformLocation = gl.getUniformLocation(program, "viewMatrix");
  projectionMatrixUniformLocation = gl.getUniformLocation(program, "projectionMatrix");
  lightColorUniformLocation = gl.getUniformLocation(program, "lightColor");
  lightPositionUniformLocation = gl.getUniformLocation(program, "lightPosition");
  ambientLightUniformLocation = gl.getUniformLocation(program, "ambientLight");
  
  gl.uniform3f(lightColorUniformLocation, light.r, light.g, light.b);
  gl.uniform3f(lightPositionUniformLocation, light.x , light.y, light.z);
  gl.uniform3f(ambientLightUniformLocation, 0.05, 0.05, 0.05);
  
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
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    mat4.rotate(transformationMatrix, identityMatrix, 45, [1, 0, 0]);
  
    gl.uniformMatrix4fv(transformationMatrixUniformLocation, gl.FALSE, transformationMatrix);
    mat4.lookAt(viewMatrix,
               [camX, camY, camZ],
               [camX + Math.cos(viewAngleVer - 3.14 / 2.0) * Math.sin(viewAngleHor - 3.14 / 2.0),
               camY + Math.cos(viewAngleVer),
               camZ + Math.cos(viewAngleHor - 3.14 / 2.0) * Math.cos(viewAngleVer - 3.14 / 2.0)],
               [0, 1, 0]);
    gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
    gl.uniform3f(lightPositionUniformLocation, 50, 50, 10);
    
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.activeTexture(gl.TEXTURE0);
  
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    
    
}

function movement(){
  if(keyA){camZ -= Math.sin(viewAngleHor - 3.14 / 2.0); camX += Math.cos(viewAngleHor - 3.14 / 2.0);}
  if(keyD){camZ += Math.sin(viewAngleHor - 3.14 / 2.0); camX -= Math.cos(viewAngleHor - 3.14 / 2.0);}
  if(keyW){camZ += Math.cos(viewAngleHor - 3.14 / 2.0); camX += Math.sin(viewAngleHor - 3.14 / 2.0);}
  if(keyS){camZ -= Math.cos(viewAngleHor - 3.14 / 2.0); camX -= Math.sin(viewAngleHor - 3.14 / 2.0);}
  if(keySPC){camY += 0.5;}
  if(keyLSHIFT){camY -= 0.5;}
  if(keyLEFT){viewAngleHor += 0.02;}
  if(keyUP){viewAngleVer -= 0.02;}
  if(keyRIGHT){viewAngleHor -= 0.02;}
  if(keyDOWN){viewAngleVer += 0.02;}
}

function prepare(){
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(71 / 255, 85 / 255, 109 / 255,1.0);
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
    case 37:
      keyLEFT = true;
      break;
    case 38:
      keyUP = true;
      break;
    case 39:
      keyRIGHT = true;
      break;
    case 40:
      keyDOWN = true;
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
    case 37:
      keyLEFT = false;
      break;
    case 38:
      keyUP = false;
      break;
    case 39:
      keyRIGHT = false;
      break;
    case 40:
      keyDOWN = false;
      break;
  }
  
}

function entityCube(x, y, z, size, r, g, b){
  this.x = x;
  this.y = y;
  this.z = z;
  this.size = size
  this.r = r;
  this.g = g;
  this.b = b;
  
  
  this.vertices = [
    
    x, y, z, r, g, b, -1.0, 1.0, 1.0, 0.0, 0.0,// 0
    x, y, z - size, r, g, b, -1.0, 1.0, -1.0, 0.0, 1.0, // 1.0
    x + size, y, z - size , r, g, b, 1.0, 1.0, -1.0, 1.0, 1.0, // 2
    x + size, y, z, r, g, b, 1.0, 1.0, 1.0, 1.0, 0.0, // 3
    x, y - size, z - size , r, g, b, -1.0, -1.0, -1.0, 0.0, 0.0, // 4
    x + size, y - size, z - size, r, g, b, 1.0, -1.0, -1.0, 0.0, 1.0,   // 5
    x + size, y - size, z, r, g, b, 1.0, -1.0, 1.0, 1.0, 1.0, // 6
    x, y - size, z, r, g, b, -1.0, -1.0, 1.0, 1.0, 0.0 // 7
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
