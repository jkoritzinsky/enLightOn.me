var uuid = require('node-uuid');

var app = require('http').createServer(handler);
var io = require('socket.io')(app);

app.listen(process.env.PORT);

function handler (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
    res.end();
}

var matches = [];
var waitingClients = [];

var getGameRoom = function(socket) {
    var rooms = socket.rooms;
    var gameRoom;
    rooms.forEach(function(roomName) {
        if(roomName != socket.id) gameRoom  = roomName;
    });
    return gameRoom;
}

var promptRematch = function(socket1, socket2) {
    var socket1Rematch = null;
    var socket2Rematch = null;
    socket1.on('rematch', function(data) {
        socket1Rematch = data;
        if(socket1Rematch) {
            if(socket2Rematch) {
                socket1.emit('joined match', {opponent:socket2.id});
                socket2.emit('joined match', {opponent:socket1.id});
                var matchName = uuid.v4();
                socket1.join(matchName);
                socket2.join(matchName);
            } else if (socket2Rematch === false) {
                socket1.emit('rematch denied');
            }
        } else {
            waitingClients.push(socket1);
        }
    });
    socket2.on('rematch', function(data) {
        socket2Rematch = data;
        if(socket2Rematch) {
            if(socket1Rematch) {
                socket1.emit('joined match', {you: socket1.id, opponent:socket2.id});
                socket2.emit('joined match', {you: socket2.id, opponent:socket1.id});
                var matchName = uuid.v4();
                socket1.join(matchName);
                socket2.join(matchName);
            } else if (socket1Rematch === false) {
                socket1.emit('rematch denied');
            }
        } else {
            waitingClients.push(socket2);
        }
    });
}

io.on('connection', function(socket){
    if(waitingClients.length == 0) {
        waitingClients.push(socket);
        socket.emit('waiting on opponent');
    } else {
        var matchName = uuid.v4();
        var waitingClient = null;
        // Get first connected client
        while(waitingClient = waitingClients.shift()) {
            if(waitingClient == null) break;
            if(waitingClient.connected) break;
        }
        if(waitingClient == null) {
            waitingClients.push(socket);
            socket.emit('waiting on opponent');
            return;
        }
        waitingClient.join(matchName);
        waitingClient.emit('joined match', {you: waitingClient.id, opponent:socket.id});
        socket.join(matchName);
        socket.emit('joined match', {you : socket.id, opponent:waitingClient.id});
        waitingClient.on('disonnect', function(data) {
            socket.emit('opponent disconnected', {opponent:waitingClient.id});
            socket.leave(matchName);
            waitingClients.push(waitingClient);
        });
        socket.on('disconnect', function(data) {
            waitingClient.emit('opponent disconnected', {opponent:socket.id});
            waitingClient.leave(matchName);
            waitingClients.push(socket);
        });
        waitingClient.on('lose', function(data) {
            socket.emit('win'); 
            waitingClient.leave(matchName);
            socket.leave(matchName);
            //promptRematch(waitingClient, socket);
            waitingClients.push(waitingClient);
        });
        socket.on('lose', function(data){
            waitingClient.emit('win');
            waitingClient.leave(matchName);
            socket.leave(matchName);
            //promptRematch(waitingClient, socket);
            waitingClients.push(socket);
        });
        socket.on('opponent update', function(data) {
            console.log("Opponent Update");
            console.log(data);
           socket.to(waitingClient.id).emit('opponent update', data); 
        });
        waitingClient.on('opponent update', function(data) {
            console.log("Opponent Update");
            console.log(data);
           waitingClient.to(socket.id).emit('opponent update', data); 
        });
    }
});
/**/