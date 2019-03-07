class Shader {
    constructor(gl, vsSource, fsSource) {
        this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    }
    attachShaderProgram(gl) {
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, this.vertexShader);
        gl.attachShader(this.shaderProgram, this.fragmentShader);
        gl.linkProgram(this.shaderProgram);
    }
};

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    // See if it compiled successfully
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  