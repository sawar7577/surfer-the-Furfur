class Jetpack {
    constructor(gl) {
        this.cylinderL = new CubeT(0.03,0.1,0.03,"./cm2.jpeg",gl);
        this.cylinderL.setPosition([-0.03,0,0]);
        // this.cylinderLT = new CubeT();
        // this.cylinderLB = new CubeT();
        this.cylinderR = new CubeT(0.03,0.1,0.03,"./cm2.jpeg",gl);
        this.cylinderR.setPosition([0.03,0,0]);

        // this.cylinderRT = new CubeT();
        // this.cylinderRB = new CubeT();
    }
    draw(projectionMatrix, viewMatrix, gl, programInfo) {
    this.cylinderL.draw(projectionMatrix, viewMatrix, gl, programInfo);
    this.cylinderR.draw(projectionMatrix, viewMatrix, gl, programInfo);
    // this.cylinderLB.draw(projectionMatrix, viewMatrix, gl, programInfo);
    // this.cylinderRB.draw(projectionMatrix, viewMatrix, gl, programInfo);    
    // this.cylinderLT.draw(projectionMatrix, viewMatrix, gl, programInfo);
    // this.cylinderRT.draw(projectionMatrix, viewMatrix, gl, programInfo);    
    }
    tick() {
        // this.cylinderL.rotation[1] += 1.07;
    }

};