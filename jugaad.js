class Jugaad {
    constructor(gl) {
        this.myCube = new CubeT(0.3,0.4,0.05,"./jugaad.jpeg",gl);
        this.position = [0,0,0];
        this.lane = 0;
    }
    setPosition(pos) {
        this.position = pos;
        this.myCube.position = pos;
    }
    draw(projectionMatrix, viewMatrix, gl,programInfoT) {
        this.myCube.draw(projectionMatrix, viewMatrix, gl,programInfoT);
    }
}