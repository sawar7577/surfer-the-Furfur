class Rocket {
    constructor(gl) {
        this.position = [0,0.18,-1];
        this.rotation = [-1.57,0.57,0.57];
        this.scale = [2.5,2.5,2.5];
        this.ambientStrength = 0.9;
        this.directionalStrength = 0.01;

        var ret = parseObj(rocketStruct,rocketColor);
        this.vertices = ret.verticesObj;
        this.textureCoord = ret.texturesObj;
        this.normals = ret.normalsObj;
        this.colors = ret.colorsObj;
        this.setMe = false;
        this.lane = 0;


        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ret.verticesObj), gl.STATIC_DRAW);
  
        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ret.texturesObj), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ret.normalsObj), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    }
    setPosition(pos) {
        this.position = pos;
    }
    tick(){
        this.rotation[0] += 0.1;
    }
}