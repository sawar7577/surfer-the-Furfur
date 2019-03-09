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

  
  const vsTSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    // attribute vec4 aVertexColor;

    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uNormalMatrix;


    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      
      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional) ;
    }
  `;




  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uNormalMatrix;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
      vColor = aVertexColor;

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional) * 1.1;
    }
  `;

  const fsTSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        // gl_FragColor = vec4(texelColor.rgb , texelColor.a);

        // gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        gl_FragColor = vec4(texelColor.rgb * (vLighting - vLighting + vec3(1.0,1.0,1.0)), texelColor.a);

      }
  `;
  const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      // gl_FragColor = vColor ;

      gl_FragColor = vColor * vec4(vLighting, 1);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.


  var trains = [];
  trains.push(new Train(gl));
  trains.push(new Train(gl));
  trains.push(new Train(gl));

  var fences = [];
  fences.push(new Fence(gl));
  fences.push(new Fence(gl));
  fences.push(new Fence(gl));


  var tr = new RailTracks(gl);
  var wl = new Walls(gl);
  var pl = new Player(gl);
  var cn = new Coin(gl);
  // var trn = new Train(gl);
  var jt = new Jetpack(gl);
  var tt = new Tree(gl);
  // var fn = new Fence(gl);
  var bt = new Boot(gl);
  // var bl = new Blend(1,gl);
  
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

  var eye = [0.0, 0.3, 1.2]
  var center = [0, 0.3, 0]
  var up = [0, 1, 0]
  
  const shaderT = new Shader(gl, vsTSource, fsTSource);
  // Draw the scene repeatedly
  function render() {

    console.log(pl.lane);
    Mousetrap.bind('left', function() {
      // pl.position[0] -= 0.3;
      // this.lane = Math.max(-1,this.lane-1);
      if(pl.lane == 0) {
        pl.lane = -1;
      }
      if(pl.lane == 1) {
        pl.lane = 0;
      }
    });


    Mousetrap.bind('right', function() {
      // this.lane = Math.min(1,this.lane+1);
      // pl.position[0] += 0.3;
      if(pl.lane == 0) {
        pl.lane = 1;
      }
      if(pl.lane == -1) {
        pl.lane = 0;
      }
    });

    Mousetrap.bind('up', function() {
      // pl.position[0] -= 0.3;
      pl.velocity[1] = 0.048;
    });


    Mousetrap.bind('down', function() {
      pl.position[0] += 0.3;
    });


    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    // Clear the canvas before we start drawing on it.
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var viewMatrix = mat4.create();
    eye[2] -= 0.03;
    center[2] -= 0.03;
    // tt.position[2] -= 0.03;
    mat4.lookAt(viewMatrix,
                eye,
                center,
                up);
    const shaderC = new Shader(gl, vsSource, fsSource);
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
        },
      };
      drawColor(trn,projectionMatrix, viewMatrix, gl,programInfoC);
      // drawColor(bt,projectionMatrix, viewMatrix, gl,programInfoC);

      // drawColor(fn,projectionMatrix, viewMatrix, gl,programInfoC);
      pl.tick();
      pl.draw(projectionMatrix, viewMatrix, gl, programInfoC);
      
      
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }