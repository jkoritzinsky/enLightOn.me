(function(){

  nleap.lastGridPos = 20;
  nleap.lastHorizMove = 0;
  nleap.lastNewBlock = 0;

  gameEvents.on('loadNewBlock', function () {
    nleap.lastGridPos = 20;
    nleap.lastNewBlock = new Date().getTime();
    console.log("1");
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
  });

  nleap.handle("down", function(){
    window.controls.moveDown(true);
  });

  nleap.handle("rotate", function(clockwise){
    if(clockwise){
      window.controls.rotateClockwise();
    }else{
      window.controls.rotateCounterclockwise();
    }
  });

})();
