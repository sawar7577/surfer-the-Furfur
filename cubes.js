class Cube {
    constructor(length, width, depth, color, gl) {
        this.position = [0, 0, 0];
        this.length = length;
        this.width = width;
        this.depth = depth;
        this.ambientStrength = 0.3;
        this.directionalStrength = 0.3;

        this.rotation = [0, 0, 0];

        this.vertices = [
            // Front face
            -length/2.0, -width/2.0,  depth/2.0,
             length/2.0, -width/2.0,  depth/2.0,
             length/2.0,  width/2.0,  depth/2.0,
            -length/2.0,  width/2.0,  depth/2.0,
        
            // Back face
            -length/2.0, -width/2.0, -depth/2.0,
            -length/2.0,  width/2.0, -depth/2.0,
             length/2.0,  width/2.0, -depth/2.0,
             length/2.0, -width/2.0, -depth/2.0,
        
            // Top face
            -length/2.0,  width/2.0, -depth/2.0,
            -length/2.0,  width/2.0,  depth/2.0,
             length/2.0,  width/2.0,  depth/2.0,
             length/2.0,  width/2.0, -depth/2.0,
        
            // Bottom face
            -length/2.0, -width/2.0, -depth/2.0,
             length/2.0, -width/2.0, -depth/2.0,
             length/2.0, -width/2.0,  depth/2.0,
            -length/2.0, -width/2.0,  depth/2.0,
        
            // Right face
             length/2.0, -width/2.0, -depth/2.0,
             length/2.0,  width/2.0, -depth/2.0,
             length/2.0,  width/2.0,  depth/2.0,
             length/2.0, -width/2.0,  depth/2.0,
        
            // Left face
            -length/2.0, -width/2.0, -depth/2.0,
            -length/2.0, -width/2.0,  depth/2.0,
            -length/2.0,  width/2.0,  depth/2.0,
            -length/2.0,  width/2.0, -depth/2.0,
        ];

        // this.vertices = [
        //     -length/2, -width/2, -depth/2,
        //     length/2, -width/2, -depth/2,
        //     length/2,  width/2, -depth/2,
        //    -length/2,  width/2, -depth/2,
       
        //    -length/2, -width/2, depth/2,
        //     length/2, -width/2, depth/2,
        //     length/2,  width/2, depth/2,
        //    -length/2,  width/2, depth/2,       
        // ];

        this.normals = [
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0, 0.0, 0.0
        ];

        this.indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        this.faceColors = [
            color, color, color, color, color, color,
        ];
        
          // Convert the array of colors into a table for all the vertices.
        
        var colors = [];
        
        for (var j = 0; j < this.faceColors.length; ++j) {
        const c = this.faceColors[j];
        
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
        }
        
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    }
    setPosition(pos) {
        this.position = pos;
    }
    draw(projectionMatrix, viewMatrix, gl, programInfo) {

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

            gl.uniform1f(
                programInfo.uniformLocations.ambientStrength,
            // false,
            this.ambientStrength);

            gl.uniform1f(
                programInfo.uniformLocations.directionalStrength,
            // false,
            this.directionalStrength);

        {
            const vertexcount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexcount, type, offset);
        }
    }
}

class CubeT {
    constructor(length, width, depth, img, gl) {
        this.position = [0, 0, 0];
        this.length = length;
        this.width = width;
        this.depth = depth;
        this.ambientStrength = 0.3;
        this.directionalStrength = 1.0;

        this.rotation = [0, 0, 0];

        this.texture = loadTexture(gl, img)
        
        
        this.vertices = [
            // Front face
            -length/2.0, -width/2.0,  depth/2.0,
             length/2.0, -width/2.0,  depth/2.0,
             length/2.0,  width/2.0,  depth/2.0,
            -length/2.0,  width/2.0,  depth/2.0,
        
            // Back face
            -length/2.0, -width/2.0, -depth/2.0,
            -length/2.0,  width/2.0, -depth/2.0,
            length/2.0,  width/2.0, -depth/2.0,
            length/2.0, -width/2.0, -depth/2.0,
        
            // Top face
            -length/2.0,  width/2.0, -depth/2.0,
            -length/2.0,  width/2.0,  depth/2.0,
             length/2.0,  width/2.0,  depth/2.0,
             length/2.0,  width/2.0, -depth/2.0,
             
             // Bottom face
             -length/2.0, -width/2.0, -depth/2.0,
             length/2.0, -width/2.0, -depth/2.0,
             length/2.0, -width/2.0,  depth/2.0,
             -length/2.0, -width/2.0,  depth/2.0,
             
             // Right face
             length/2.0, -width/2.0, -depth/2.0,
             length/2.0,  width/2.0, -depth/2.0,
             length/2.0,  width/2.0,  depth/2.0,
             length/2.0, -width/2.0,  depth/2.0,
             
             // Left face
             -length/2.0, -width/2.0, -depth/2.0,
            -length/2.0, -width/2.0,  depth/2.0,
            -length/2.0,  width/2.0,  depth/2.0,
            -length/2.0,  width/2.0, -depth/2.0,
        ];

        
        this.normals = [
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            
            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            
            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            
            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            
            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0, 0.0, 0.0
        ];

        this.indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
        
        
        this.textureCoord = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0, 1.0,
        ];

        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoord), gl.STATIC_DRAW);
        
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
        
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    setPosition(pos) {
        this.position = pos;
    }
    draw(projectionMatrix, viewMatrix, gl, programInfo) {

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
        
            // console.log(this.vertexBuffer);
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

            gl.uniform1f(
                programInfo.uniformLocations.ambientStrength,
            this.ambientStrength);
    
            gl.uniform1f(
                programInfo.uniformLocations.directionalStrength,
            this.directionalStrength);

            gl.activeTexture(gl.TEXTURE0);
        
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexcount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexcount, type, offset);
        }
    }
}
