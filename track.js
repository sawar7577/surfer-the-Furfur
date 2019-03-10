class RailTracks {
  constructor(gl){
    // this.position = pos;
    this.tracks = [];
    for(let i = 0 ; i < 80 ; i+=1) {

      var c1 = new CubeT(0.33,0.001,0.33,"./track5.png",gl);
      var c2 = new CubeT(0.33,0.001,0.33,"./track5.png",gl);
      var c3 = new CubeT(0.33,0.001,0.33,"./track5.png",gl);
      c1.ambientStrength = 0.7;
      c2.ambientStrength = 0.7;
      c3.ambientStrength = 0.7;

      c1.setPosition([-0.33,0,-i*0.33]);
      c2.setPosition([0,0,-i*0.33]);
      c3.setPosition([0.33,0,-i*0.33]);


      this.tracks.push(c1);
      this.tracks.push(c2);
      this.tracks.push(c3);
    }
  }
  tick(pos,gl) {
    if(this.tracks[0].position[2] - pos[2] > 2) {
      this.tracks.shift();
      this.tracks.shift();
      this.tracks.shift();

      var z = this.tracks[this.tracks.length - 1].position[2];
      // var z = this.walls[this.walls.length - 1].position[2];
        var c1 = new CubeT(0.33,0.001,0.33,"./track5.png",gl);
        var c2 = new CubeT(0.33,0.001,0.33,"./track5.png",gl);
        var c3 = new CubeT(0.33,0.001,0.33,"./track5.png",gl);

        c1.setPosition([-0.33,0,z - 0.33]);
        c2.setPosition([0,0,z - 0.33]);
        c3.setPosition([0.33,0,z - 0.33]);


    this.tracks.push(c1);
    this.tracks.push(c2);
    this.tracks.push(c3);

    }
  }
  draw(projectionMatrix, viewMatrix, gl, programInfo) {
    for(let i = 0 ; i < this.tracks.length ; i+=1) {
      this.tracks[i].draw(projectionMatrix, viewMatrix, gl, programInfo);
    }
  }


}