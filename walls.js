  class Walls {
    constructor(gl){
      this.walls = [];
      for(let i = 0 ; i < 10 ; i+=1) {
        var c1 = new CubeT(1.0,1.5,2.0,"./wall.jpg",gl);
        var c2 = new CubeT(1.0,1.5,2.0,"./wall.jpg",gl);
        c1.setPosition([-1,0,-i*2]);
        c2.setPosition([1,0,-i*2]);

        this.walls.push(c1);
        this.walls.push(c2);
      }
    }
    tick(pos,gl) {
      if(this.walls[0].position[2] - pos[2] > 1) {
        this.wall.shift();
        this.wall.shift();

        var z = this.tracks[this.walls.length - 1].position[2];
        var c1 = new CubeT(1.0,1.5,2.0,"./wall.jpg",gl);
        var c2 = new CubeT(1.0,1.5,2.0,"./wall.jpg",gl);
        c1.setPosition([-1,0,z - 2.0]);
        c2.setPosition([1,0,z - 2.0]);

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