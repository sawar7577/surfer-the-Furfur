class Train {
    constructor(gl) {
        // start 1 end 3.1
        this.position = [-0.3,0,-1];
        this.rotation = [0,1.57,0];
        this.scale = [0.08,0.08,0.08];
        // this.texture = loadTexture(gl, "./wood.jpg");


        var ret = parseObj(trainStruct, trainColor);
        this.vertices = ret.verticesObj;
        this.textureCoord = ret.texturesObj;
        this.normals = ret.normalsObj;
        this.colors = ret.colorsObj;

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
};