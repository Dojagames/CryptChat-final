const socketIo = require('socket.io');
const cors = require('cors');
const server = require('http').createServer();
const { v4: uuidv4 } = require('uuid');

const {connectDB, createUser, loadUser, loadUserSettings, SaveOfflineMessages, LoadOfflineMessages, setDisplayName} =  require("./db.js")
const {verifySignature} = require("./crypto");
const {getUsernameFromSocketId} = require("./functions");


const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'], // Specify allowed methods
    },
});


const users = {}; // Store connected users { username: { socketId, publicKey } }


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user registration with public keys generated on the client side
    socket.on('register', async (data) => {
        const { username, publicKey } = data;
        console.log(username + " tries to register");

        let user = await loadUser(username);
        if(user){
            socket.emit('register_failed', "username_taken");
        }

        const uniqueId = uuidv4();
        await createUser(username, uniqueId, publicKey, (done) => {
            if(!done){
                socket.emit("register_failed", "error while creating user");
                return;
            }

            users[username] = {
                socketId: socket.id,
                publicKey,
                uniqueId
            }

            socket.emit("registered");
            console.log(`user: ${username} registered`);
        });
    });

    socket.on('setDisplayName', async (name) => {
        const username = getUsernameFromSocketId(users, socket.id);
        if(!username){
            socket.emit("displayNameSet_failed", "error while setting Display Name");
            return;
        }
        await setDisplayName(username, name, (done) => {
            if(!done){
                socket.emit("displayNameSet_failed", "error while setting displayname");
                return;
            }
            socket.emit("displayNameSet", (name));
        });
    });

    socket.on('addUser', async (username) => {
        const user = await loadUser(username);
        if(!user){
            socket.emit("addUser_failed", "user not found");
            return;
        }

        delete user._id;
        delete user.uuid;

        socket.emit('receivedUser', user);

        console.log(`user: ${getUsernameFromSocketId(users, socket.id)} added user: ${username}`);

    });

    socket.on('login', async (data) => {
        const { message, signature, username} = data;
        if(users[username]){
            console.log("already logged in");
            socket.emit("login_failed", "already logged in");
            return;
        }

        let user = await loadUser(username);
        if(!user){
            console.log("user does not exist");
            socket.emit("login_failed", "user does not exist");
            return;
        }
//
        if(!verifySignature(signature, message, user.publicKey)){
            console.log("private Key is not valid");
            socket.emit("login_failed", "private Key is not valid");
            return;
        }

        users[username] = {
            socketId: socket.id,
            publicKey: user.publicKey,
            uniqueId: user.uuid
        }

        let msgs = await LoadOfflineMessages(username);
        socket.emit("login_success", ({msgs}));
        console.log(`User ${username} logged in`);
    })

    // Handle sending a message
    socket.on('send_message', async (data) => {//update to use type and message as object, image or video can also include text
        const { to, from, message, signature } = data;

        if (!users[to]) {//user is offline, check if they have a user by loadUser(to), if true -> save message to db and try push api, else send error msg
            const result = SaveOfflineMessages(to, JSON.stringify(message), from);
            if(result){
                console.log("message saved to db");
                //socket.emit("message_saved_toDB") //if userprivacy settings allows
            } else {
                console.log("user not found");
                socket.emit('error', 'Recipient not found');
            }
            return;
        }

        const sender = users[from];
        if (!sender) {
            socket.emit('error', 'Sender not found');
            console.log("sender not found")
            return;
        }

        if (!verifySignature(signature, message, users[from].publicKey)) {
            socket.emit('error', 'Message verification failed');
            console.log("verification failed")
            return;
        }

        const recipientSocketId = users[to].socketId;
        io.to(recipientSocketId).emit('receive_message', {
            from,
            message,
            signature,
        });
        console.log(`Message sent from ${from} to ${to}`);
    });

    socket.on('send_image', (data) => {
        const { to, from, image, signature } = data;

        if (!users[to]) {
            socket.emit('error', 'Recipient not found');
            return;
        }

        const sender = users[from];
        if (!sender) {
            socket.emit('error', 'Sender not found');
            return;
        }

        if (!verifySignature(signature, image, users[from].publicKey)) {
            console.log('fail');
            socket.emit('error', 'Image verification failed');
            return;
        }

        const recipientSocketId = users[to].socketId;
        io.to(recipientSocketId).emit('receive_image', {
            from,
            image,
            signature,
            publicKey: sender.publicKey
        });
        console.log(`Image sent from ${from} to ${to}`);

    });

    socket.on("getPublicKey", async (username) => {//
        const user = await loadUser(username);
        console.log(user, username);
        if(user){
            socket.emit("receive_public_key", {username, publicKey: user.publicKey});
            console.log("key send");
        }
    });

    socket.on('getUserInfo', async (username) => {
        const user = await loadUser(username);
        if(user){
            delete user._id;
            delete user.uuid;
            socket.emit("receive_user_info", {username, user});
            console.log("user info send");
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log("disconnect");
        for (let username in users) {
            if (users[username].socketId === socket.id) {
                delete users[username];
                console.log(`User ${username} disconnected`);
                break;
            }
        }
    });
});






server.listen(3000, async () => {
    console.log('Server listening on port 3000');

    await connectDB();

});

