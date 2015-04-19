(function(){

  nleap.lastGridPos = 5;
  nleap.lastHorizMove = 0;

  gameEvents.on('loadNewBlock', function () {
    nleap.lastGridPos = 5;
  });

  nleap.handle("xpos", function(pos){
    var gridPos = Math.floor((200 + pos)/25);
    if(new Date().getTime() - nleap.lastHorizMove > 50){
      if(nleap.lastGridPos > gridPos){
        window.controls.moveLeft();
      }else if(nleap.lastGridPos < gridPos){
        window.controls.moveRight();
      }
      nleap.lastGridPos = gridPos;
      nleap.lastHorizMove = new Date().getTime();
    }
    console.log(gridPos);
  });

  nleap.handle("left", function(){
    console.log("LEFT!");
  });

  nleap.handle("right", function(){
    console.log("RIGHT!");
  });

  nleap.handle("down", function(){
    console.log("DOWN!");
    for(var i = 0; i < 50; i++){
      window.controls.moveDown();
    }
  });

  nleap.handle("rotate", function(clockwise){
    if(clockwise){
      window.controls.rotateClockwise();
    }else{
      window.controls.rotateCounterclockwise();
    }
    console.log("Rotate " + (clockwise ? "clockwise" : "counter-clockwise"));
  });

})();
