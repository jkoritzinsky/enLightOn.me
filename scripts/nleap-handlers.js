nleap.lastGridPos = 5;

nleap.handle("xpos", function(pos){
  var gridPos = Math.floor((200 + pos)/40);
  if(nleap.lastGridPos > gridPos){
    window.controls.moveLeft();
  }else{
    window.controls.moveRight();
  }
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
  console.log("ROTATE " + (clockwise ? "clockwise" : "counter-clockwise"));
  if(clockwise){
    window.controls.rotateClockwise();
  }else{
    window.controls.rotateCounterclockwise();
  }
});
