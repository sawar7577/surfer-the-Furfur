main();



function main() {
//   console.log(tr);
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  
  var vsTSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    // attribute vec4 aVertexColor;

    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uNormalMatrix;
    uniform float ambientStrength;
    uniform float directionalStrength;


    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      
      // Apply lighting effect

      highp vec3 ambientLight = ambientStrength * vec3(1.0, 1.0, 1.0);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional) * directionalStrength ;
    }
  `;




  var vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uNormalMatrix;
    uniform float ambientStrength;
    uniform float directionalStrength;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
      vColor = aVertexColor;

      highp vec3 ambientLight = ambientStrength * vec3( 1.0, 1.0, 1.0);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional) * directionalStrength;
    }
  `;

  var fsTSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
     
        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);

      }
  `;


  var fsTSourceGray = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  precision highp float;

  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    
    float grey = (texelColor.x + texelColor.y + texelColor.z)/3.0;
  
    gl_FragColor = vec4(grey, grey, grey, texelColor.a) * vec4(vLighting, 1);
  }
`;
  var fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
    
      gl_FragColor = vColor * vec4(vLighting, 1);
    }
  `;

  var fsSourceGray = `
  varying lowp vec4 vColor;
  varying highp vec3 vLighting;
  precision highp float;

  void main(void) {
  

    float grey = (vColor.x + vColor.y + vColor.z)/3.0;
    gl_FragColor = vec4(grey, grey, grey, vColor[3]) * vec4(vLighting, 1);
  }
`;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.


  var coins = [];
  for(var i = 0 ; i < 30 ; ++i) {
    coins.push(new Coin(gl));
  }

  var trains = [];
  trains.push(new Train(gl));
  trains.push(new Train(gl));
  trains.push(new Train(gl));

  var fences = [];
  fences.push(new Fence(gl));
  fences.push(new Fence(gl));
  fences.push(new Fence(gl));

  var boots = [];
  boots.push(new Boot(gl));
  // boots.push(new Boot(gl));
  // boots.push(new Boot(gl));

  var rockets = [];
  rockets.push(new Rocket(gl));
  rockets.push(new Rocket(gl));
  rockets.push(new Rocket(gl));

  var trees = [];
  trees.push(new Tree(gl));
  trees.push(new Tree(gl));
  trees.push(new Tree(gl));


  var tr = new RailTracks(gl);
  var wl = new Walls(gl);
  var pl = new Player(gl);
  var pol = new Police(gl);
  var kt = new Kutta(gl);
  
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
                  fieldOfView,
                  aspect,
                  zNear,
                  zFar);

  var eye = [0.0, 0.6, 2.2]
  var center = [0, 0.3, 0]
  var up = [0, 1, 0]
  
  var fs = fsSource;
  var fst = fsTSource;
  // Draw the scene repeatedly
  function render() {
    
    // console.log(pl.position[2]);
    Mousetrap.bind('left', function() {
      // pl.position[0] -= 0.3;
      // this.lane = Math.max(-1,this.lane-1);
      if(pl.lane == 0) {
        pl.lane = -1;
        kt.lane = -1;
      }
      if(pl.lane == 1) {
        pl.lane = 0;
        kt.lane = 0;
      }
    });
    
    
    Mousetrap.bind('right', function() {
      // this.lane = Math.min(1,this.lane+1);
      // pl.position[0] += 0.3;
      if(pl.lane == 0) {
        pl.lane = 1;
        kt.lane = 1;
      }
      if(pl.lane == -1) {
        pl.lane = 0;
        kt.lane = 0;
      }
    });
    
    Mousetrap.bind('up', function() {
      // pl.position[0] -= 0.3;
      pl.velocity[1] = pl.jumpval;
    });
    
    
    Mousetrap.bind('down', function() {
      pl.position[0] += 0.3;
    });
    
    Mousetrap.bind('g', function() {
      if(fs == fsSourceGray) {
        fs = fsSource;
        fst = fsTSource;
      }
      else {
        fs = fsSourceGray;
        fst = fsTSourceGray;
      }
    });
    
    gl.clearColor(135/256.0, 206/256.0, 236/256.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    // Clear the canvas before we start drawing on it.
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var viewMatrix = mat4.create();
    eye[2] -= 0.02;
    center[2] -= 0.02;
    // tt.position[2] -= 0.03;
    mat4.lookAt(viewMatrix,
      eye,
      center,
      up);
      var shaderT = new Shader(gl, vsTSource, fst);
      var shaderC = new Shader(gl, vsSource, fs);
      shaderT.attachShaderProgram(gl);
      
      const programInfoT = {
        program: shaderT.shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderT.shaderProgram, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderT.shaderProgram, 'aVertexNormal'),
          textureCoord: gl.getAttribLocation(shaderT.shaderProgram, 'aTextureCoord'),
          
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderT.shaderProgram, 'uProjectionMatrix'),
          viewMatrix: gl.getUniformLocation(shaderT.shaderProgram, 'uViewMatrix'),
          modelMatrix: gl.getUniformLocation(shaderT.shaderProgram, 'uModelMatrix'),
          normalMatrix: gl.getUniformLocation(shaderT.shaderProgram, 'uNormalMatrix'),
          uSampler: gl.getUniformLocation(shaderT.shaderProgram, 'uSampler'),
          ambientStrength: gl.getUniformLocation(shaderT.shaderProgram, 'ambientStrength'),
          directionalStrength: gl.getUniformLocation(shaderT.shaderProgram, 'directionalStrength')
        },  
      };
      
      // jt.draw(projectionMatrix, viewMatrix, gl,programInfoT);
      // jt.tick();
      // trn.draw(projectionMatrix, viewMatrix, gl,programInfoT);      
      tr.draw(projectionMatrix, viewMatrix, gl,programInfoT);
      wl.draw(projectionMatrix, viewMatrix, gl,programInfoT);

      // drawTexture(fn, projectionMatrix, viewMatrix, gl,programInfoT);

      tr.tick(pl.position,gl);
      wl.tick(pl.position,gl);
      for(var i = 0 ; i < coins.length ; ++i) {
        coins[i].draw(projectionMatrix, viewMatrix, gl,programInfoT);
        coins[i].tick();
      }
  

      // cn.draw(projectionMatrix, viewMatrix,gl,programInfoT);
      // cn.tick();
      
      shaderC.attachShaderProgram(gl);
      
      const programInfoC = {
        program: shaderC.shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderC.shaderProgram, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderC.shaderProgram, 'aVertexNormal'),
          vertexColor: gl.getAttribLocation(shaderC.shaderProgram, 'aVertexColor'),
          
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderC.shaderProgram, 'uProjectionMatrix'),
          viewMatrix: gl.getUniformLocation(shaderC.shaderProgram, 'uViewMatrix'),
          modelMatrix: gl.getUniformLocation(shaderC.shaderProgram, 'uModelMatrix'),
          normalMatrix: gl.getUniformLocation(shaderC.shaderProgram, 'uNormalMatrix'),
          ambientStrength: gl.getUniformLocation(shaderC.shaderProgram, 'ambientStrength'),
          directionalStrength: gl.getUniformLocation(shaderC.shaderProgram, 'directionalStrength'),          
        },
      };
      collisionBoot(pl, boots);
      collisionCoin(pl, coins);
      collisionRocket(pl, rockets);
      collisionFence(pl, fences);
      collisionTrain(pl, trains);


      placeTrain(trains, pl.position);
      placeFence(fences, pl.position);
      placeBoot(boots, pl.position);
      placeRocket(rockets, pl.position);
      // placeTree(trees, pl.position);
      placeCoin(coins, pl.position);
      tickSprites(rockets);
      tickSprites(boots);
      // tickSprites(trains);
      drawSprites(trains, projectionMatrix, viewMatrix, gl,programInfoC);
      drawSprites(fences, projectionMatrix, viewMatrix, gl,programInfoC);
      drawSprites(boots, projectionMatrix, viewMatrix, gl,programInfoC);
      // for(var i = 0 ; i < boots.length ; ++i) {
        // boots[i].box.draw(projectionMatrix, viewMatrix, gl, programInfoC);
      // }
      drawSprites(rockets, projectionMatrix, viewMatrix, gl,programInfoC);
      // drawSprites(trees,  projectionMatrix, viewMatrix, gl,programInfoC);
      kt.tick();
      kt.draw(projectionMatrix, viewMatrix, gl, programInfoC);
      pl.tick();
      pl.draw(projectionMatrix, viewMatrix, gl, programInfoC);
      pol.tick();
      pol.draw(projectionMatrix, viewMatrix, gl, programInfoC);
      
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  function placeTrain(lst, pos) {
    var amp = 16;
    for(var i = 0 ; i < lst.length ; i+=1) {
        var rand = Math.random();
        var lane = 0;
        if(lst[i].position[2] > pos[2]+3) {
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3;
            lane = 1;
          }
          lst[i].setPosition([rand,0,Math.min(pos[2]-4,pos[2] - amp*Math.random()) ]);
          lst[i].lane = lane;
        }
    }
}

function placeFence(lst, pos) {
  var amp = 16;
    for(var i = 0 ; i < lst.length ; i+=1) {
        var rand = Math.random();
        var lane = 0;
        if(lst[i].position[2] > pos[2]+3) {
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3
            lane = 1;
          }
          lst[i].setPosition([rand,0.1,Math.min(pos[2]-4,pos[2] - amp*Math.random()) ]);
          lst[i].lane = lane;
        }
    }
}

function placeBoot(lst, pos) {
  var amp = 4;
    for(var i = 0 ; i < lst.length ; i+=1) {
        var rand = Math.random();
        var lane = 0;
        if(lst[i].position[2] > pos[2]+3) {
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3
            lane = 1;
          }
          lst[i].setPosition([rand,0.18,Math.min(pos[2]-4,pos[2] - amp*Math.random()) ]);
          lst[i].box.setPosition(lst[i].position);
          lst[i].lane = lane;
        }
    }
}

function placeRocket(lst, pos) {
  var amp = 16;
    for(var i = 0 ; i < lst.length ; i+=1) {
        var rand = Math.random();
        var lane = 0;
        if(lst[i].position[2] > pos[2]+3) {
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3;
            lane = 1;
          }
          lst[i].setPosition([rand,0.18,Math.min(pos[2]-4,pos[2] - amp*Math.random()) ]);
          lst[i].lane = lane;
        }
    }
}

function placeTree(lst, pos) {
  var amp = 16;
    for(var i = 0 ; i < lst.length ; i+=1) {
        var rand = Math.random();
        if(lst[i].position[2] > pos[2]+3) {
          if(rand <= 0.5) {
            rand = -0.15;
          }
          else {
            rand = 0.15
          }
          lst[i].setPosition([rand,0.0,Math.min(pos[2]-4,pos[2] - amp*Math.random()) ]);
        }
    }
}

function placeCoin(lst, pos) {
  var amp = 32;
    for(var i = 0 ; i < lst.length ; i+=1) {
        var rand = Math.random();
        var lane = 0;
        if(lst[i].position[2] > pos[2]+3) {
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3;
            lane = 1;
          }
          lst[i].setPosition([rand,0.2,Math.min(pos[2]-4,pos[2] - amp*Math.random()) ]);
          lst[i].lane = lane;
        }
    }
}


function drawSprites(lst,projectionMatrix, viewMatrix, gl,programInfoC) {
  for(var i = 0 ; i < lst.length ; i+=1) {
    drawColor(lst[i],projectionMatrix, viewMatrix, gl,programInfoC);    
  }
}

function tickSprites(lst) {
  for(var i = 0 ; i < lst.length; i+=1) {
    lst[i].tick();
  }
}

function collisionBoot(playa, lst) {
  for(var i = 0 ; i < lst.length; i+=1) {
    if(playa.lane == lst[i].lane) {
    // if(Math.abs(playa.position[0] - lst[i].position[0]) < 0.0003 ) {

      // console.log("collison");
      if(Math.abs(playa.position[2] - lst[i].position[2]) < 0.03 ) {
        if(Math.abs(playa.position[1]+0.18 - lst[i].position[1]  ) < 0.03 ) {
        console.log(playa.collision, lst[i].lane);
        var rand = Math.random();  
        var lane;
        if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3;
            lane = 1;
          }
        playa.jumpval = 0.1;
        playa.jumpstart = 0;
        var amp = 16;
        playa.collision += 1;
          lst[i].setPosition([rand,0.18,Math.min(playa.position[2]-4,playa.position[2] - amp*Math.random()) ]);
          lst[i].box.setPosition(lst[i].position);          
          lst[i].lane = lane;
        }
    }
    }
  }
}

function collisionCoin(playa, lst) {
  // console.log(playa.score);
  for(var i = 0 ; i < lst.length; i+=1) {
    if(playa.lane == lst[i].lane) {
      // console.log("collison");
      if(Math.abs(playa.position[2] - lst[i].position[2]) < 0.03) {
        if(Math.abs(playa.position[1]+0.2 - lst[i].position[1]) < 0.03) {

        // console.log(playa.collision, lst[i].lane);
        var rand = Math.random();  
        var lane = 0;
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3;
            lane = 1;
          }
        var amp = 16;
        playa.collision += 1;
          lst[i].setPosition([rand,0.2,Math.min(playa.position[2]-4,playa.position[2] - amp*Math.random()) ]);
          lst[i].lane = lane;
          playa.score += 1;
      }
    }
    }
  }
}

function collisionRocket(playa, lst) {
  for(var i = 0 ; i < lst.length; i+=1) {
    if(playa.lane == lst[i].lane) {
      // console.log("collison");
      if(Math.abs(playa.position[2] - lst[i].position[2]) < 0.03) {
        if(Math.abs(playa.position[1]+0.18 - lst[i].position[1]) < 0.03) {

        console.log(playa.collision, lst[i].lane);
        var rand = Math.random();  
        var lane = 0;
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3;
            lane = 1;
          }
        var amp = 16;
        this.jetstart = 0;
        playa.collision += 1;
          lst[i].setPosition([rand,0.18,Math.min(playa.position[2]-4,playa.position[2] - amp*Math.random()) ]);
          lst[i].lane = lane;
      }
    }
    }
  }
}

function collisionFence(playa, lst) {
  for(var i = 0 ; i < lst.length; i+=1) {
    if(playa.lane == lst[i].lane) {
      // console.log("collison");
      if(Math.abs(playa.position[2] - lst[i].position[2]) < 0.03) {
        if(Math.abs(playa.position[1]+0.1 - lst[i].position[1]) < 0.03) {

        console.log(playa.collision, lst[i].lane);
        var rand = Math.random();  
        var lane = 0;
          if(rand <= 0.3) {
            rand = -0.3;
            lane = -1;
          }
          else if (rand <= 0.6) {
            rand = 0;
            lane = 0;
          }
          else {
            rand = 0.3;
            lane = 1;
          }
        var amp = 16;
        playa.collision += 1;
          lst[i].setPosition([rand,0.1,Math.min(playa.position[2]-4,playa.position[2] - amp*Math.random()) ]);
          lst[i].lane = lane;
        }
      }
    }
  }
}

function collisionTrain(playa, lst) {
  playa.onTrain = false;
  for(var i = 0 ; i < lst.length; i+=1) {
    if(playa.lane == lst[i].lane) {
      if( (playa.position[2] - lst[i].position[2]) < 0.0) {
        if((playa.position[1] - lst[i].position[1]) > 0.0) {
          playa.onTrain = true;
      }
      if(playa.onTrain == true){
        if((playa.position[2] - lst[i].position[2]) < -2.0) {
          playa.onTrain = false;
        }
      }
    }
    }
  }
}