class Coin {
    constructor(gl) {
        this.radius = 0.1;
        this.depth = 0.02;
        this.position = [0,0.0,0];
        this.rotation = [0,0,0];
        const PI = 3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067;

        this.vertices = [];
        this.textureCoordinates = [];

        this.texture = loadTexture(gl, "./index.jpeg")


        var inc = 2*PI/25;

        for(let i = 0 ; i < 25 ; ++i) {
            this.vertices.push(0.0);
            this.vertices.push(0.0);
            this.vertices.push(0.0 + this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            // this.textureCoordinates.push(0.5);

            this.vertices.push(this.radius*Math.cos(i*inc));
            this.vertices.push(this.radius*Math.sin(i*inc));
            this.vertices.push(0.0 + this.depth/2.0);
            this.textureCoordinates.push(0.5 + 0.5*Math.cos(i*inc));
            this.textureCoordinates.push(0.5 + 0.5*Math.sin(i*inc));
            // this.textureCoordinates.push(0.5);

            this.vertices.push(this.radius*Math.cos((i+1)*inc));
            this.vertices.push(this.radius*Math.sin((i+1)*inc));
            this.vertices.push(0.0 + this.depth/2.0);
            this.textureCoordinates.push(0.5 + 0.5*Math.cos((i+1)*inc));
            this.textureCoordinates.push(0.5 + 0.5*Math.sin((i+1)*inc));
        }

        for(let i = 0 ; i < 25 ; ++i) {
            this.vertices.push(0.0);
            this.vertices.push(0.0);
            this.vertices.push(0.0 - this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            
            this.vertices.push(this.radius*Math.cos(i*inc));
            this.vertices.push(this.radius*Math.sin(i*inc));
            this.vertices.push(0.0 - this.depth/2.0);
            this.textureCoordinates.push(0.5 + 0.5*Math.cos(i*inc));
            this.textureCoordinates.push(0.5 + 0.5*Math.sin(i*inc));
            
            this.vertices.push(this.radius*Math.cos((i+1)*inc));
            this.vertices.push(this.radius*Math.sin((i+1)*inc));
            this.vertices.push(0.0 - this.depth/2.0);
            this.textureCoordinates.push(0.5 + 0.5*Math.cos((i+1)*inc));
            this.textureCoordinates.push(0.5 + 0.5*Math.sin((i+1)*inc));
            
        }

        for(let i = 0 ; i < 25   ; ++i) {
            this.vertices.push(this.radius*Math.cos(i*inc));
            this.vertices.push(this.radius*Math.sin(i*inc));
            this.vertices.push(this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);


            this.vertices.push(this.radius*Math.cos((i+1)*inc));
            this.vertices.push(this.radius*Math.sin((i+1)*inc));
            this.vertices.push(this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);


            this.vertices.push(this.radius*Math.cos(i*inc));
            this.vertices.push(this.radius*Math.sin(i*inc));
            this.vertices.push(-this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);

            this.vertices.push(this.radius*Math.cos(i*inc));
            this.vertices.push(this.radius*Math.sin(i*inc));
            this.vertices.push(-this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);

            this.vertices.push(this.radius*Math.cos((i+1)*inc));
            this.vertices.push(this.radius*Math.sin((i+1)*inc));
            this.vertices.push(-this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);

            this.vertices.push(this.radius*Math.cos((i+1)*inc));
            this.vertices.push(this.radius*Math.sin((i+1)*inc));
            this.vertices.push(this.depth/2.0);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);

        }

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  
        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);

    }
    setPosition(pos) {
        this.position = pos;
    }
    tick() {
        this.rotation[1] += 0.01;
    }
    draw(gl, programInfo){
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
                        fieldOfView,
                        aspect,
                        zNear,
                        zFar);

        const eye = [0, 0.1, 1]
        const center = [0, 0, 0]
        const up = [0, 1, 0]
        const viewMatrix = mat4.create();

        mat4.lookAt(viewMatrix,
                    eye,
                    center,
                    up);

        const modelMatrix = mat4.create();
        var translate = mat4.create();
        mat4.translate(translate,     // destination matrix
        translate,     // matrix to translate
        this.position);

        var rotate = mat4.create();
        mat4.rotate(rotate, rotate, this.rotation[1], [0,1,0]);

        mat4.multiply(modelMatrix, modelMatrix, translate);
        mat4.multiply(modelMatrix, modelMatrix, rotate);

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
            const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                num,
                type,
                normalize,
                stride,
                offset);
                gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
            }
        
            
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

        
        gl.activeTexture(gl.TEXTURE0);
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


        {
            // const vertexcount = 6;
            // const type = gl.UNSIGNED_SHORT;
            // const offset = 0;
            // gl.drawElements(gl.TRIANGLES, vertexcount, type, offset);
          gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
        }
    }
};