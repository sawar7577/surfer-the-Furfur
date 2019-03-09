class Track {
    constructor(pos, length, width, gl) {
      this.length = length;
      this.width = width;
      this.position = pos
      this.vertexCount = 4
      this.texture = loadTexture(gl, "./track5.png")

      this.vertices = [
        -this.length/2, 0,  this.width/2,
         this.length/2, 0,  this.width/2,
         this.length/2, 0, -this.width/2,
        -this.length/2, 0, -this.width/2,
      ];
  
      this.indices = [
        0, 1, 2,
        2, 3, 0,
      ];

      this.normals = [
        0.0, 1.0, 0,
        0.0, 1.0, 0,
        0.0, 1.0, 0,
        0.0, 1.0, 0,
      ];
  
      this.textureCoordinates = [
        0, 1,
        1, 1,
        1, 0,
        0, 0,
      ];


      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

      this.textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);

      this.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    }
    setPosition(x, y, z) {
      this.position = [x, y, z];
    }

    drawTrack(projectionMatrix, viewMatrix, gl, programInfo) {


        const modelMatrix = mat4.create();
        var translate = mat4.create();
        mat4.translate(translate,     // destination matrix
        translate,     // matrix to translate
        this.position);

        // const normalMatrix = mat4.create();
        // mat4.invert(normalMatrix, projectionMatrix * viewMatrix * modelMatrix);
        // mat4.transpose(normalMatrix, normalMatrix);

        mat4.multiply(modelMatrix, modelMatrix, translate);
        
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

        
        gl.activeTexture(gl.TEXTURE0);
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


        {
            const vertexcount = 6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexcount, type, offset);
          // gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
  };


  class RailTracks {
    constructor(gl){
      // this.position = pos;
      this.tracks = [];
      for(let i = 0 ; i < 80 ; i+=1) {
        this.tracks.push(new Track([ -0.33, 0, -0.33*i], 0.33, 0.33, gl));
        this.tracks.push(new Track([    0, 0, -0.33*i], 0.33, 0.33, gl));
        this.tracks.push(new Track([  0.33, 0, -0.33*i], 0.33, 0.33, gl));
      }
    }
    tick(pos,gl) {
      if(this.tracks[0].position[2] - pos[2] > 1) {
        this.tracks.shift();
        this.tracks.shift();
        this.tracks.shift();

        var z = this.tracks[this.tracks.length - 1].position[2];
        this.tracks.push(new Track([-0.33,0,z-0.33] ,0.33, 0.33, gl));
        this.tracks.push(new Track([0,0,z-0.33] ,0.33, 0.33, gl));
        this.tracks.push(new Track([0.33,0,z-0.33] ,0.33, 0.33, gl));


      }
    }
    draw(projectionMatrix, viewMatrix, gl, programInfo) {
      for(let i = 0 ; i < this.tracks.length ; i+=1) {
        this.tracks[i].drawTrack(projectionMatrix, viewMatrix, gl, programInfo);
      }
    }


  }