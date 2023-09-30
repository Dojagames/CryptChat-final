const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket)=> {
    socket.emit("test", "testmsg");
});


let adRooms = [];


server.listen(3007);