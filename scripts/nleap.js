var nleap = (function(){
    // exported object
    var exp = {};
    // is device connected?
    exp.deviceConnected = null;
    // map of event:handler {string:function}
    var handlers = {};
    // map of finger:extended {string:boolean}
    var exMap = {};
    // mode of extended fingers
    //      0 - all fingers extended
    //      1 - index and middle finger extended
    //      2 - index finger extended
    //      3 - other combination
    var moveMode = 3;

    var controller = Leap.loop({enableGestures: true}, function(frame) {
      if(frame.valid){
        if(frame.hands) {
          moveMode = getMoveMode(frame.hands[0]);

          // if in move mode #2, track circle gestures
          if(moveMode == 2 && frame.gestures.length > 0) {
            frame.gestures.forEach(function(gesture){
              if(gesture.type == "circle"){
                trackCircle(frame, gesture);
              }
            });
          }

          // if in move mode #1, track position of index finger
          if(moveMode == 1) {
            trackXPos(frame.hands[0]);
          }

          // if in move mode #0, track swipe gestures
          if(moveMode == 0 && frame.gestures.length > 0) {
            frame.gestures.forEach(function(gesture){
              if(gesture.type == "swipe"){
                trackSwipe(gesture);
              }
            });
          }
        }
      }
    });

    controller.on("streamingStarted", function(){
      exp.deviceConnected = true;
    });

    controller.on("streamingStopped", function(){
      exp.deviceConnected = false;
    });

    // if all fingers extended, move mode 0
    // if only index and middle extended, move mode 1
    // if only index extended, move mode 2
    // if any other combination, move mode 3
    function getMoveMode(hand) {
      if(hand && hand.fingers) {
        fillExMap(hand.fingers);

        if(exMap["THUMB"] && exMap["INDEX"] && exMap["MIDDLE"] && exMap["RING"] && exMap["PINKY"]){
          return 0;
        }

        if(!exMap["THUMB"] && exMap["INDEX"] && exMap["MIDDLE"] && !exMap["RING"] && !exMap["PINKY"]){
          return 1;
        }

        if(!exMap["THUMB"] && exMap["INDEX"] && !exMap["MIDDLE"] && !exMap["RING"] && !exMap["PINKY"]){
          return 2;
        }
      }
      return 3;
    }

    function fillExMap(fingers){
      fingers.forEach(function(finger){
        exMap[ fingerString(finger.type) ] = finger.extended;
      });
    }

    function fingerString(type){
      switch(type){
        case 0:
          return "THUMB";
        case 1:
          return "INDEX";
        case 2:
          return "MIDDLE";
        case 3:
          return "RING";
        case 4:
          return "PINKY";
        default:
          return "wut";
      }
    }

    function trackXPos(hand) {
      if(hand && hand.fingers) {
        hand.fingers.forEach(function(finger){
          if(fingerString(finger.type) == "INDEX") {
            // broadcast event
            event("xpos", Math.round(finger.dipPosition[0]));
          }
        });
      }
    }

    function trackSwipe(gesture) {
      var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);

      if(isHorizontal) {
        if(gesture.direction[0] > 0){
          event("right", null);
        }else{
          event("left", null);
        }
      } else {
        if(gesture.direction[1] <= 0){
          event("down", null);
        }
      }
    }

    function trackCircle(frame, gesture) {
      var pointableID = gesture.pointableIds[0];
      var direction = frame.pointable(pointableID).direction;
      var dotProduct = Leap.vec3.dot(direction, gesture.normal);

      if( dotProduct > 0) {
        event("rotate", true);
      }else{
        event("rotate", false);
      }
    }

    function event(name, param){
      if(!regulate(name))
        return

      if(!handlers[name])
        return

      if(name == "xpos" || name == "rotate"){
        handlers[name](param);
      }else{
        handlers[name]();
      }
    }

    /** Regulate how fast events are broadcasted **/
    var lastEvent = null;
    var lastEventTime = 0;
    var SWIPE_WAIT = 500;
    var POS_WAIT = 25;
    var CIRCLE_WAIT = 1000;

    function regulate(name){
      if(name == "xpos" && new Date().getTime() - lastEventTime > POS_WAIT){
        lastEventTime = new Date().getTime();
        lastEvent = name;
        return true;
      }

      if(name == "rotate" && new Date().getTime() - lastEventTime > CIRCLE_WAIT){
        lastEventTime = new Date().getTime();
        lastEvent = name;
        return true;
      }

      if(lastEvent != name || new Date().getTime() - lastEventTime > SWIPE_WAIT) {
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
