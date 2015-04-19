var server = io('http://enlightonme.azurewebsites.net');

$(document).ready(function() {
    var blockrain = $('.game').data('aerolab-blockrain');
    console.log(blockrain);
    console.log(blockrain.options.onGameOver);
    blockrain.options.onGameOver = function(score) {
        server.emit('lose', {});
    }
    server.on('win', function(data) {
        console.log('You win!');
    })
});