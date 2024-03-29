class Boot {
    constructor(gl) {
        this.position = [0,0.18,-1];
        this.rotation = [0,0,0];
        this.scale = [0.02,0.02,0.02];
        this.lane = 0;
        this.ambientStrength = 0.9;
        this.directionalStrength = 0.01;
        this.box = new Cube(0.04,0.04,0.04,[1.0,0,1.0,1.0],gl)
        this.box.position = this.position;
        var ret = parseObj(bootStruct,bootColor);
        this.vertices = ret.verticesObj;
        this.textureCoord = ret.texturesObj;
        this.normals = ret.normalsObj;
        this.colors = ret.colorsObj;
        this.setMe = false;


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
        this.box.position = pos;
        this.position = pos;
    }
    tick(){
        this.rotation[1] += 0.05;
        this.rotation[2] += 0.05;

    }
}