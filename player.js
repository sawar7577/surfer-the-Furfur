class Player {
    constructor(gl) {
        this.position = [0,0,0];
        this.velocity = [0,0,0];
        this.lane = 0;

        this.runningCycle = 0;
        this.torso = new Cube(0.04,0.04,0.04, [1.0,0,0,1.0], gl);

        this.handR = new Cube(0.02,0.02,0.02, [1.0,0,0,1.0],gl);
        this.handL = new Cube(0.02,0.02,0.02, [1.0,0,0,1.0],gl);

        this.legR = new Cube(0.03,0.01,0.05, [1.0,0,0,1.0],gl);
        this.legL = new Cube(0.03,0.01,0.05, [1.0,0,0,1.0],gl);

        this.head = new Cube(0.08,0.08,0.08, [1.0,0,0,1.0],gl);
    
        this.torso.setPosition([0,0.1,0]);
        this.handR.setPosition([0.05,0.1,0]);
        this.handL.setPosition([-0.05,0.1,0]);
        this.legR.setPosition([0.05,0,0]);
        this.legL.setPosition([-0.05,0,0]);
        this.head.setPosition([0,0.18,0]);
    }
    tick() {
        if(this.lane == 0) {
            if(this.position[0] > 0) {
                this.position[0] -= 0.02;
                this.position[0] = Math.max(0, this.position[0]);
            }
            else if(this.position[0] < 0) {
                this.position[0] += 0.02;
                this.position[0] = Math.min(0, this.position[0]);
            }
        }
        else if(this.lane == -1) {
            if(this.position[0] > -0.3) {
                this.position[0] -= 0.02;
                this.position[0] = Math.max(-0.3, this.position[0]);
            }
            else if(this.position[0] < -0.3) {
                this.position[0] += 0.02;
                this.position[0] = Math.min(-0.3, this.position[0]);
            }
        }
        else if(this.lane == 1) {
            if(this.position[0] > 0.3) {
                this.position[0] -= 0.02;
                this.position[0] = Math.max(0.3, this.position[0]);
            }
            else if(this.position[0] < 0.3) {
                this.position[0] += 0.02;
                this.position[0] = Math.min(0.3, this.position[0]);
            }
        }
        this.velocity[1] = this.velocity[1] - 0.004;
        this.position[1] += this.velocity[1];
        this.position[1] = Math.max(this.position[1],0);
        this.position[2] -= 0.02;
        const PI = 3.14159265359; 
        this.runningCycle += 0.4;
        var t = this.runningCycle;

        t = t % (2*PI);

        var amp = 0.035;

        this.legR.position[0] =  this.position[0] + 0.02;
        this.legR.position[2] =  this.position[2] - Math.cos(t) * amp;
        this.legR.position[1] =  this.position[1] + Math.max (0, - Math.sin(t) * amp);

        this.legL.position[0] =  this.position[0] - 0.02;
        this.legL.position[2] =  this.position[2] - Math.cos(t + PI) * amp;
        this.legL.position[1] =  this.position[1] + Math.max (0, - Math.sin(t + PI) * amp);

        if (t<PI){
        this.legR.rotation[0] = Math.cos(t * 1 + PI/2) * PI/4;
        this.legL.rotation[0] = 0;
        } else{
        this.legR.rotation[0] = 0;
        this.legL.rotation[0] = Math.cos(t * 1 + PI/2) *  PI/4;
        }

        this.torso.position[0] = this.position[0];
        this.torso.position[1] = this.position[1] - Math.cos(  t * 2 ) * amp * 0.1 + 0.1;
        this.torso.position[2] = this.position[2];
        this.torso.rotation[0] = -Math.cos( t + PI ) * amp * 1.5;

        this.head.position[0] = this.position[0];
        this.head.position[1] = this.position[1] - Math.cos(  t * 2 ) * amp * 0.03 + 0.2;
        this.head.position[2] = this.position[2];
        this.head.rotation[0] += Math.cos( t ) * amp * 1.02;
        this.head.rotation[1] +=  Math.cos( t ) * amp * 1.01;

        this.handL.rotation[0] += -Math.cos( t/2 + PI) ;
        this.handL.position[2] = this.position[2] -Math.cos( t ) * amp * 1.1;
        this.handL.position[1] = this.position[1] + 0.1;
        this.handL.position[0] = this.position[0] - 0.05;

        
        this.handR.rotation[0] += -Math.cos( t/2 ) * PI/8;
        this.handR.position[2] = this.position[2] -Math.cos( t + PI) * amp * 1.1;
        this.handR.position[1] = this.position[1] + 0.1;
        this.handR.position[0] = this.position[0] + 0.05;

        
        // this.handL.rotation[0] += -Math.cos( t/2 + PI) * PI/8;

        // this.handR.position[1] = this.position[1] + 0.1;
        // this.handL.position[0] = this.position[0];

        // this.legR.position[0] = this.position[0];
        // this.legL.position[0] = this.position[0];


    }

    draw(projectionMatrix, viewMatrix, gl, programInfo) {
        this.torso.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.head.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.handR.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.handL.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.legR.draw(projectionMatrix, viewMatrix, gl, programInfo);
        this.legL.draw(projectionMatrix, viewMatrix, gl, programInfo);
    }

    move(flag) {

    }
}

