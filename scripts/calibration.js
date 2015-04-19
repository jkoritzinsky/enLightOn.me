(function(){
  var calibration = $('#calibration');

  setTimeout(function(){
    if(nleap.deviceConnected){
      $('.game').hide();
      init();
    }
  }, 500);

  function init(){
    calibration.html("<h3>Position your hand above the Leapmotion.</h3>"
              + "<p></p>");

    var secondsToStart = 5
    var lastCalibration = -1

    nleap.handle("xyzpos", function(vector3){

    if(vector3[0] >= -50 && vector3[0] <= 50
      && vector3[1] >= 150 && vector3[1] <= 250
      && vector3[2] >= 0 && vector3[2] <= 60){

        if(secondsToStart < 0){
          $('#calibration').hide();
          $('.game').show();
          nleap.handle("xyzpos", null);
          window.controls.start();
        }else{
          // if hand was in wrong position for more than second, restart
          if(new Date().getTime() - lastCalibration > 1000){
            secondsToStart = 5
          }else{
            secondsToStart -= (new Date().getTime() - lastCalibration)/1000;
          }
          lastCalibration = new Date().getTime();

          $('#calibration p').html(Math.abs(secondsToStart).toFixed(1) + " seconds until start.");
          // $('.blockrain-btn').html(secondsToStart + " seconds until start.");
        }
        return;
    }

    if(vector3[0] < -50){
      $('#calibration p').html("Move your hand right.");
      return;
    }

    if(vector3[0] > 50){
      $('#calibration p').html("Move your hand left.");
      return;
    }

    if(vector3[1] < 100){
      $('#calibration p').html("Move your hand up.");
      return;
    }

    if(vector3[1] > 200){
      $('#calibration p').html("Move your hand down.");
      return;
    }

    if(vector3[2] < 0){
      $('#calibration p').html("Move your hand backward.");
      return;
    }

    if(vector3[2] > 60){
      $('#calibration p').html("Move your hand forward.");
      return;
    }

  });
  }
})();
