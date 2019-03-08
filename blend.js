function loader(url) {
    var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    document.getElementById("demo").innerHTML = myObj.name;
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

class Blend {
    constructor(color, gl) {
        this.position = [0, 0, 0];
        // this.length = length;
        // this.width = width;
        // this.depth = depth;

        this.rotation = [0, 0, 0];

        var obj = loader("~/Downloads/low-poly-fox-by-pixelmannen-obj/a.json");
        // var myData = JSON.parse(a);
        // var object = new JSONObject("~/Downloads/low-poly-fox-by-pixelmannen-obj/a.json");
        // var getArray = object.getJSONArray("verts");

        // for(var i = 0 ; i < getArray.size() ; ++i) {
            // console.log(getArray.getJSONObject(i));
        // }
        
        
        // this.vertexBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  
        // this.indexBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    
        // this.normalBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
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
