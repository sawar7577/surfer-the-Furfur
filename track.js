class Track {
    constructor(length, width, gl) {
      this.length = length;
      this.width = width;
      this.position = [0,0,0]
      this.vertexCount = 4
      this.texture = loadTexture(gl, "./rails.png")

      this.vertices = [
        -this.length/2, 0,  this.width/2,
         this.length/2, 0,  this.width/2,
         this.length/2, 0, -this.width/2,
        -this.length/2, 0, -this.width/2,
      ];

    //   this.vertices = [
    //     -this.length/2, 0,  this.width/2,
    //     this.length/2, 0,  this.width/2,
    //     this.length/2, 0, -this.width/2,

    //     this.length/2, 0, -this.width/2,
    //     -this.length/2, 0, -this.width/2,
    //     -this.length/2, 0,  this.width/2,
    //   ]
  
      this.indices = [
        0, 1, 2,
        2, 3, 0,
      ];
  
      this.textureCoordinates = [
        0, 0,
        0, 1,
        1, 0,
        1, 1,
      ];


      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

      this.textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);

    }
    setPosition(x, y, z) {
      this.position = [x, y, z];
    }

    drawTrack(gl, programInfo) {

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

        const eye = [0, 0, 0]
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

        mat4.multiply(modelMatrix, modelMatrix, translate);

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
            
            
            // const modelMatrix = mat4.create();
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

        
        gl.activeTexture(gl.TEXTURE0);
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


        {
            const vertexcount = 6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, this.indices.length, type, offset);
        }
    }
  }