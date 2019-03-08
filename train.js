class Train {
    constructor(gl) {
        this.cubeObject = new CubeT(0.1,0.1,0.1,"./train.jpg", gl);
    }
    setPosition(pos) {
        this.cubeObject.position = pos;
    }
    draw(projectionMatrix, viewMatrix, gl, programInfo) {
        this.cubeObject.draw(projectionMatrix, viewMatrix, gl, programInfo);
    }
    
}