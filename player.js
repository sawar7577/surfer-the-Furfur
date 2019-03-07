class Cube {
    constructor(length, width, depth, color, gl) {
        this.position = [0, 0, 0];
        this.length = length;
        this.width = width;
        this.depth = depth;

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

        // this.indices = [
        //     0,1,2,  2,3,0,
        //     4,5,6,  6,7,4,
        //     3,2,6,  6,7,3,
        //     0,1,5,  5,4,0,
        //     1,5,6,  6,2,1,
        //     0,4,7,  7,3,0,
        // ];


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

        // const fieldOfView = 45 * Math.PI / 180;   // in radians
        // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        // const zNear = 0.1;
        // const zFar = 100.0;
        // const projectionMatrix = mat4.create();

        // mat4.perspective(projectionMatrix,
        //                 fieldOfView,
        //                 aspect,
        //                 zNear,
        //                 zFar);

        // const eye = [0, 0.5, 1]
        // const center = [0, 0, 0]
        // const up = [0, 1, 0]
        // const viewMatrix = mat4.create();

        // mat4.lookAt(viewMatrix,
        //             eye,
        //             center,
        //             up);

        const modelMatrix = mat4.create();
        var translate = mat4.create();
        mat4.translate(translate,     // destination matrix
        translate,     // matrix to translate
        this.position);

        mat4.multiply(modelMatrix, modelMatrix, translate);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, projectionMatrix * viewMatrix * modelMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        var rotate = mat4.create();
        mat4.rotate(rotate, rotate, this.rotation[0], [1,0,0]);
        mat4.rotate(rotate, rotate, this.rotation[1], [0,1,0]);
        mat4.rotate(rotate, rotate, this.rotation[2], [0,0,1]);

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
            const vertexcount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexcount, type, offset);
        }
    }
}

// class Cube {
//     constructor(length, width, depth, color, gl) {
//         this.position = [0, 0, 0];
//         this.length = length;
//         this.width = width;
//         this.depth = depth;

//         this.rotation = [0, 0, 0];

//         this.vertices = [
//             -length/2, -width/2, -depth/2,
//             length/2, -width/2, -depth/2,
//             length/2,  width/2, -depth/2,
//            -length/2,  width/2, -depth/2,
       
//            -length/2, -width/2, depth/2,
//             length/2, -width/2, depth/2,
//             length/2,  width/2, depth/2,
//            -length/2,  width/2, depth/2,       
//         ];

//         this.indices = [
//             0,1,2,  2,3,0,
//             4,5,6,  6,7,4,
//             3,2,6,  6,7,3,
//             0,1,5,  5,4,0,
//             1,5,6,  6,2,1,
//             0,4,7,  7,3,0,
//         ];

//         this.faceColors = [
//             color, color, color, color, color, color,
//         ];
        
//           // Convert the array of colors into a table for all the vertices.
        
//         var colors = [];
        
//         for (var j = 0; j < this.faceColors.length; ++j) {
//         const c = this.faceColors[j];
        
//         // Repeat each color four times for the four vertices of the face
//         colors = colors.concat(c, c, c, c);
//         }
        
//         this.colorBuffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        
//         this.vertexBuffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  
//         this.indexBuffer = gl.createBuffer();
//         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
//         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
//     }
//     setPosition(pos) {
//         this.position = pos;
//     }
//     draw(gl, programInfo) {

//         const fieldOfView = 45 * Math.PI / 180;   // in radians
//         const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
//         const zNear = 0.1;
//         const zFar = 100.0;
//         const projectionMatrix = mat4.create();

//         mat4.perspective(projectionMatrix,
//                         fieldOfView,
//                         aspect,
//                         zNear,
//                         zFar);

//         const eye = [0, 0.1, 1]
//         const center = [0, 0, 0]
//         const up = [0, 1, 0]
//         const viewMatrix = mat4.create();

//         mat4.lookAt(viewMatrix,
//                     eye,
//                     center,
//                     up);

//         const modelMatrix = mat4.create();
//         var translate = mat4.create();
//         mat4.translate(translate,     // destination matrix
//         translate,     // matrix to translate
//         this.position);


//         mat4.multiply(modelMatrix, modelMatrix, translate);
        
        
//         {
//             const numComponents = 3;
//             const type = gl.FLOAT;
//             const normalize = false;
//             const stride = 0;
//             const offset = 0;
//             gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
//             gl.vertexAttribPointer(
//                 programInfo.attribLocations.vertexPosition,
//                 numComponents,
//                 type,
//                 normalize,
//                 stride,
//                 offset);
//             gl.enableVertexAttribArray(
//                 programInfo.attribLocations.vertexPosition);
//         }
//         {
//             const numComponents = 4;
//             const type = gl.FLOAT;
//             const normalize = false;
//             const stride = 0;
//             const offset = 0;
//             gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
//             gl.vertexAttribPointer(
//                 programInfo.attribLocations.vertexColor,
//                 numComponents,
//                 type,
//                 normalize,
//                 stride,
//                 offset);
//             gl.enableVertexAttribArray(
//                 programInfo.attribLocations.vertexColor);
//           }
            
            
//             gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
//             gl.useProgram(programInfo.program);
            
            
//             gl.uniformMatrix4fv(
//                 programInfo.uniformLocations.projectionMatrix,
//             false,
//             projectionMatrix);
            
//             gl.uniformMatrix4fv(
//                 programInfo.uniformLocations.viewMatrix,
//             false,
//             viewMatrix);

//             gl.uniformMatrix4fv(
//                 programInfo.uniformLocations.modelMatrix,
//             false,
//             modelMatrix);


//         {
//             const vertexcount = 36;
//             const type = gl.UNSIGNED_SHORT;
//             const offset = 0;
//             gl.drawElements(gl.TRIANGLES, vertexcount, type, offset);
//         }
//     }
// };


class Player {
    constructor(gl) {
        this.position = [0,0,0];

        this.runningCycle = 0;
        this.torso = new Cube(0.04,0.04,0.04, [1.0,0,0,1.0], gl);

        this.handR = new Cube(0.02,0.02,0.02, [1.0,0,0,1.0],gl);
        this.handL = new Cube(0.02,0.02,0.02, [1.0,0,0,1.0],gl);

        this.legR = new Cube(0.05,0.05,0.05, [1.0,0,0,1.0],gl);
        this.legL = new Cube(0.05,0.05,0.05, [1.0,0,0,1.0],gl);

        this.head = new Cube(0.08,0.08,0.08, [1.0,0,0,1.0],gl);
    
        this.torso.setPosition([0,0.1,0]);
        this.handR.setPosition([0.05,0.1,0]);
        this.handL.setPosition([-0.05,0.1,0]);
        this.legR.setPosition([0.05,0,0]);
        this.legL.setPosition([-0.05,0,0]);
        this.head.setPosition([0,0.18,0]);
    }
    tick() {
        this.position[2] -= 0.03;
        const PI = 3.14159265359; 
        this.runningCycle += 0.2;
        var t = this.runningCycle;

        t = t % (2*PI);

        var amp = 0.035;

        this.legR.position[2] =  this.position[2] + Math.cos(t) * amp;
        this.legR.position[1] =  this.position[1] + Math.max (0, - Math.sin(t) * amp);

        this.legL.position[2] =  this.position[2] + Math.cos(t + PI) * amp;
        this.legL.position[1] =  this.position[1] + Math.max (0, - Math.sin(t + PI) * amp);

        if (t<PI){
        // this.legR.rotation[0] = -Math.cos(t * 2 + PI/2) * PI/4;
        this.legL.rotation[0] = 0;
        } else{
        this.legR.rotation[0] = 0;
        // this.legL.rotation[0] = -Math.cos(t * 2 + PI/2) *  PI/4;
        }

        this.torso.position[1] +=  - Math.cos(  t * 2 ) * amp * 0.02;
        this.torso.position[2] = this.position[2];
        // this.torso.rotation[1] = -Math.cos( t + PI ) * amp * .05;

        this.head.position[1] +=  - Math.cos(  t * 2 ) * amp * 0.03;
        this.head.position[2] = this.position[2];

        // this.head.rotation[0] += Math.cos( t ) * amp * .02;
        // this.head.rotation[1] +=  Math.cos( t ) * amp * .01;

        this.handL.position[1] += -Math.cos( t ) * amp * 0.1;
        this.handL.position[2] = this.position[2];
        
        // this.handR.rotation[0] = -Math.cos( t ) * PI/8;
        this.handR.position[1] += -Math.cos( t + PI) * amp * 0.1;
        this.handR.position[2] = this.position[2];
        
        // this.handL.rotation[0] = -Math.cos( t + PI) * PI/8;
    }

    draw(projectionMatrix, viewMatrix, gl, programInfo) {
        this.torso.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.head.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.handR.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.handL.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.legR.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.legL.draw(projectionMatrix, viewMatrix, gl, programInfo);
    }
}