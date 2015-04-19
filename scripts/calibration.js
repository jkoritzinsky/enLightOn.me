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


    nleap.handle("xyzpos", function(vector3){

    if(vector3[0] >= -50 && vector3[0] <= 50
      && vector3[1] >= 100 && vector3[1] <= 200
      && vector3[2] >= 0 && vector3[2] <= 60){
        $('#calibration').hide();
        $('.game').show();
        nleap.handle("xyzpos", null);
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
