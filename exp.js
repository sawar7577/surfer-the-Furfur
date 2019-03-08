class Tra {
    constructor(gl) {
        this.position = [0,0,0];
        this.rotation = [0,0,0];
        // this.texture = loadTexture(gl, "./cm.jpg");


        // this.texture = loadTexture(gl, "~/Downloads/Textures/engine/sct.png");
        var ret = parseObj(s,s2);
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
    draw(projectionMatrix, viewMatrix, gl, programInfo) {

        // console.log("called");
        const modelMatrix = mat4.create();
        var translate = mat4.create();
        mat4.translate(translate,     // destination matrix
        translate,     // matrix to translate
        this.position);

        mat4.multiply(modelMatrix, modelMatrix, translate);

        var rotate = mat4.create();
        mat4.rotate(rotate, rotate, this.rotation[0], [1,0,0]);
        mat4.rotate(rotate, rotate, this.rotation[1], [0,1,0]);
        mat4.rotate(rotate, rotate, this.rotation[2], [0,0,1]);

        mat4.multiply(modelMatrix, modelMatrix, rotate);

        var normalMatrix = mat4.create();
        mat4.multiply(normalMatrix, viewMatrix, modelMatrix);


        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexNormal);
        }

        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }
            
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.useProgram(programInfo.program);
            
            
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
            
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.viewMatrix,
            false,
            viewMatrix);

            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelMatrix,
            false,
            modelMatrix);

            gl.uniformMatrix4fv(
                programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);

        {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);

        }
    }
};