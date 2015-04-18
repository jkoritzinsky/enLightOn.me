nleap.handle("xpos", function(pos){
  console.log(pos);
});

nleap.handle("left", function(){
  console.log("LEFT!");
});

nleap.handle("right", function(){
  console.log("RIGHT!");
});

nleap.handle("down", function(){
  console.log("DOWN!");
});

nleap.handle("rotate", function(){
  console.log("ROTATE!");
});
