(function(){

  nleap.lastGridPos = 20;
  nleap.lastHorizMove = 0;

  gameEvents.on('loadNewBlock', function () {
    nleap.lastGridPos = 20;
    window.controls.refreshDelay();
  });

  nleap.handle("xpos", function(pos){
    var gridPos = Math.floor((200 + pos)/10);
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

  nleap.handle("down", function(){
    console.log("DOWN!");
    window.controls.moveDown(true);
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
