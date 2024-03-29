function drawColor(obj, projectionMatrix, viewMatrix, gl, programInfo) {
    const modelMatrix = mat4.create();
    var translate = mat4.create();
    mat4.translate(translate,     // destination matrix
    translate,     // matrix to translate
    obj.position);

    mat4.multiply(modelMatrix, modelMatrix, translate);

    var rotate = mat4.create();
    mat4.rotate(rotate, rotate, obj.rotation[0], [1,0,0]);
    mat4.rotate(rotate, rotate, obj.rotation[1], [0,1,0]);
    mat4.rotate(rotate, rotate, obj.rotation[2], [0,0,1]);

    mat4.multiply(modelMatrix, modelMatrix, rotate);
    mat4.scale(modelMatrix, modelMatrix, obj.scale);

    var normalMatrix = mat4.create();
    // mat4.multiply(normalMatrix, viewMatrix, modelMatrix);


    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
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
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
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
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
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
        
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
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

        // console.log(obj.ambientStrength);
        gl.uniform1f(
            programInfo.uniformLocations.ambientStrength,
        obj.ambientStrength);

        gl.uniform1f(
            programInfo.uniformLocations.directionalStrength,
        obj.directionalStrength);

    {
        gl.drawArrays(gl.TRIANGLES, 0, obj.vertices.length/3);

    }
};


function drawTexture(obj, projectionMatrix, viewMatrix, gl, programInfo) {
    const modelMatrix = mat4.create();
    var translate = mat4.create();
    mat4.translate(translate,     // destination matrix
    translate,     // matrix to translate
    obj.position);

    mat4.multiply(modelMatrix, modelMatrix, translate);

    var rotate = mat4.create();
    mat4.rotate(rotate, rotate, obj.rotation[0], [1,0,0]);
    mat4.rotate(rotate, rotate, obj.rotation[1], [0,1,0]);
    mat4.rotate(rotate, rotate, obj.rotation[2], [0,0,1]);

    mat4.multiply(modelMatrix, modelMatrix, rotate);
    mat4.scale(modelMatrix, modelMatrix, obj.scale);

    var normalMatrix = mat4.create();
    // mat4.multiply(normalMatrix, viewMatrix, modelMatrix);


    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
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
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
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
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.textureBuffer);
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

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);

        gl.activeTexture(gl.TEXTURE0);
        
        gl.bindTexture(gl.TEXTURE_2D, obj.texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    {
        gl.drawArrays(gl.TRIANGLES, 0, obj.vertices.length/3);

    }
};


