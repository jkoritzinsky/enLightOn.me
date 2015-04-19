var server = io('http://enlightonme.azurewebsites.net');

$(document).ready(function() {
    var blockrain = $('.game').data('aerolab-blockrain');
    console.log(blockrain);
    console.log(blockrain.options.onGameOver);
    blockrain.options.onGameOver = function(score) {
        server.emit('lose', {});
    }
    server.on('connect', function(data) {
        console.log('Your id is:' + data.id);
    });
    server.on('win', function(data) {
        console.log('You win!');
    });
    server.on('joined match', function(data) {
        console.log('your opponent id is: ' + data.opponent);
    });
});