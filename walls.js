  class Walls {
    constructor(gl){
      this.walls = [];
      for(let i = 0 ; i < 10 ; i+=1) {
        var c1 = new CubeT(1.0,1.0,1.0,"./wall.jpg",gl);
        var c2 = new CubeT(1.0,1.0,1.0,"./wall.jpg",gl);
        c1.setPosition([-1,0,-i*0.1]);
        c2.setPosition([1,0,-i*0.1]);

        this.walls.push(c1);
        this.walls.push(c2);
        // this.walls.push(new CubeT(0.3,0.3,0.3,"./wall.jpg",gl));
        // this.walls.push(new CubeT(0.3,0.3,0.3,"./wall.jpg",gl));
      }
    }
    tick(pos,gl) {
      if(this.walls[0].position[2] - pos[2] > 1) {
        this.wall.shift();
        this.wall.shift();

        var z = this.tracks[this.walls.length - 1].position[2];
        var c1 = new CubeT(0.1,0.1,0.1,"./wall.jpg",gl);
        var c2 = new CubeT(0.1,0.1,0.1,"./wall.jpg",gl);
        c1.setPosition([-1,0,z - 0.1]);
        c2.setPosition([1,0,z - 0.1]);

        this.walls.push(c1);
        this.walls.push(c2);

      }
    }
    draw(projectionMatrix, viewMatrix, gl, programInfo) {
      for(let i = 0 ; i < this.walls.length ; i+=1) {
        this.walls[i].draw(projectionMatrix, viewMatrix, gl, programInfo);
      }
    }
  }