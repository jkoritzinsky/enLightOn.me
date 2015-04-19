var server = io('http://enlightonme.azurewebsites.net');

$(document).ready(function() {
    var blockrain = $('.game').data('aerolab-blockrain');
    blockrain.options.onGameOver = function(score) {
        server.emit('lose', {});
    }
    server.on('win', function(data) {
        alert('You win!');
        server.emit('rematch', {});
    });
    server.on('joined match', function(data) {
        console.log('your id is: ' + data.you);
        console.log('your opponent id is: ' + data.opponent);
        $('.spinner').hide();
        $('.game').show();
        $('.opponentView').show();
    });

    server.on('opponent disconnected', function(data) {
        console.log('Your opponent disconnected');
        alert('Your opponent disconnected! You win!');
    });
    server.on('waiting on opponent', function(data){
        console.log('Waiting on opponent');
    });
    server.on('rematch denied', function(data) {
        console.log('Rematch denied');
    });
    server.on('opponent update', function (data) {
        if(data != null) {
            oppCvs.render(data);
        }
    });
});
