// import Track from './track.js'

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
    attribute vec2 aTextureCoord;

    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;    
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

      highp vec3 ambientLight = vec3(0.2, 0.2, 0.2);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  const fsTSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_FragColor = vColor * vec4(vLighting, 1);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.

  var tr = new RailTracks(gl);
  var pl = new Player(gl);
  var cn = new Coin(gl);
   
  
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

  var eye = [0, 0.5, 1]
  var center = [0, 0, 0]
  var up = [0, 1, 0]
  
  const shaderT = new Shader(gl, vsTSource, fsTSource);
  // Draw the scene repeatedly
  function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    // Clear the canvas before we start drawing on it.
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var viewMatrix = mat4.create();
    eye[2] -= 0.03;
    center[2] -= 0.03;
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
          textureCoord: gl.getAttribLocation(shaderT.shaderProgram, 'aTextureCoord'),
          
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderT.shaderProgram, 'uProjectionMatrix'),
          viewMatrix: gl.getUniformLocation(shaderT.shaderProgram, 'uViewMatrix'),
          modelMatrix: gl.getUniformLocation(shaderT.shaderProgram, 'uModelMatrix'),
          uSampler: gl.getUniformLocation(shaderT.shaderProgram, 'uSampler'),
        },
      };
      
      tr.draw(projectionMatrix, viewMatrix, gl,programInfoT);
      // cn.draw(gl,programInfoT);
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
        pl.tick();
        pl.draw(projectionMatrix, viewMatrix, gl, programInfoC);
      
        
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }