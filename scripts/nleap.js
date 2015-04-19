var nleap = (function(){
    // exported object
    var exp = {};
    // is device connected?
    exp.deviceConnected = null;
    // map of event:handler {string:function}
    var handlers = {};

    var controller = Leap.loop({enableGestures: true}, function(frame) {
      if(frame.valid){
        if(frame.hands) {
          trackXYZPos(frame.hands[0]);
        }
      }
    });

    controller.on("streamingStarted", function(){
      exp.deviceConnected = true;
      console.log("Leapmotion device connected.");
    });

    controller.on("streamingStopped", function(){
      exp.deviceConnected = false;
      console.log("Leapmotion device disconnected.");
    });

    function trackXYZPos(hand) {
      if(hand){

        if(hand.palmPosition[1] < 100){
          event("down", null);
        }else if(hand.palmPosition[1] < 300){
          event("xpos", Math.round(hand.palmPosition[0]));
        }else {
          event("rotate", true);
        }

        event("xyzpos", hand.palmPosition);
      }
    }

    function event(name, param){
      if(!regulate(name))
        return

      if(!handlers[name])
        return

      handlers[name](param);
    }

    /** Regulate how fast events are broadcasted **/
    var lastEvent = null;
    var lastEventTime = 0;
    var waitMap = {
      xpos: 25,
      swipe: 500,
      rotate: 1500
    }

    function regulate(name){

      if(!handlers[name])
        return false;

      if(name == "xyzpos")
        return true;

      if(lastEvent != name || new Date().getTime() - lastEventTime > waitMap[name]) {
        lastEventTime = new Date().getTime();
        lastEvent = name;
        return true;
      }

      return false;
    }

    exp.handle = function(event, func){
        handlers[event] = func;
    }

    return exp;
})();
