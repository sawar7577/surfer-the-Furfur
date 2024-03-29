  class Walls {
    constructor(gl){
      this.walls = [];
      this.cnt = 0;
      for(let i = 0 ; i < 10 ; i+=1) {
        var c2 = new CubeT(1.0,1.5,2.0,"./wall4.jpeg",gl);
        var c1 = new CubeT(1.0,1.5,2.0,"./wall4.jpeg",gl);
        c1.setPosition([-1,0,-i*2.5]);
        c2.setPosition([1,0,-i*2.5]);

        this.walls.push(c1);
        this.walls.push(c2);
      }
    }
    tick(pos,gl) {
      this.cnt += 0.2;
      if(this.walls[0].position[2] - pos[2] > 2) {
        this.walls.shift();
        this.walls.shift();

        var z = this.walls[this.walls.length - 1].position[2];
        var c1 = new CubeT(1.0,1.5,2.0,"./wall4.jpeg",gl);
        var c2 = new CubeT(1.0,1.5,2.0,"./wall4.jpeg",gl);
        c1.setPosition([-1,0,z - 2.5]);
        c2.setPosition([1,0,z - 2.5]);

        this.walls.push(c1);
        this.walls.push(c2);

      }
      for(let i = 0 ; i < this.walls.length ; i+=1) {
        this.walls[i].ambientStrength += 0.01*Math.sin(this.cnt);
        // console.log(this.walls[i].ambientStrength);
      }
    }
    draw(projectionMatrix, viewMatrix, gl, programInfo) {
      for(let i = 0 ; i < this.walls.length ; i+=1) {
        this.walls[i].draw(projectionMatrix, viewMatrix, gl, programInfo);
      }
    }
  }