var uuid = require('node-uuid');
var io = require('socket.io')();

var matches = [];
var waitingClient = null;

var getGameRoom = function(socket) {
    var rooms = socket.rooms;
    var gameRoom;
    rooms.forEach(function(roomName) {
        if(roomName != socket.id) gameRoom  = roomName;
    });
    return gameRoom;
}

io.on('connection', function(socket){
    if(waitingClient == null) {
        waitingClient = socket;
        socket.emit('waiting on opponent');
    } else {
        var matchName = uuid.v4();
        waitingClient.join(matchName);
        waitingClient.emit('joined match', {opponent:socket.id});
        socket.join(matchName);
        socket.emit('joined match', {opponent:waitingClient.id});
        waitingClient.on('disonnect', function(data) {
            socket.emit('opponent disconnected', {opponent:waitingClient.id});
        });
        socket.on('disconnect', function(data) {
            waitingClient.emit('opponent disconnected', {opponent:socket.id});
        });
        waitingClient.on('lose', function(data) {
           socket.emit('win'); 
        });
        socket.on('lose', function(data){
            waitingClient.emit('win');
        });
        waitingClient = null;
    }
});
io.listen(3000);