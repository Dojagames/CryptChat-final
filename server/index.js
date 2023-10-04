const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


var msgCollection;
var userCollection;
var tokenCollection;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


io.on('connection', (socket)=> {
    socket.emit("test", "testmsg");


    //acounts
    socket.on("getTempToken", async (_token) => {
        jwt.verify(_token, process.env.REFRESH_TOKEN_SECRET, async (err, user) =>{
            if (err) socket.emit("deleteToken"); 

            if(Users.some(e => e.name == user.user)){
                socket.emit("alreadyLoggedIn");
                return;
            }
            
            let _token = await tokenCollection.findOne({ "_id": user.user });
            if(!_token) {
                console.log("noDBentryFound");
                socket.emit("deleteToken");
                return;
            }

            const jwtToken = jwt.sign({user: user.user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"}); 
            Users.push({name: user.user, id: socket.id});
            
            socket.emit("loggedIn", (jwtToken));
        });
        //check token
        //if valid -> login 
        // else send invalid token + delete token on client and send to login page with "you have been locked out"
    });

    socket.on("verifyToken", async ( _token) => {
        jwt.verify(_token, process.env.ACCESS_TOKEN_SECRET, async (err, user) =>{
            if (err) {
               socket.emit("tempTokenExpired");
               return;
            }

            let userToken = await tokenCollection.findOne({ "_id": user.user });
            if(!userToken) {
                console.log("noDBentryFound");
                socket.emit("deleteToken");
                return;
            }
            
            if(Users.some(e => e.name == user.user)){
                socket.emit("alreadyLoggedIn");
                return;
            }
            
            Users.push({name: user.user, id: socket.id});
            socket.emit("loggedIn", (_token));
        });
    });

    socket.on("login", async (_data) => {

        if(Users.some(e => e.name == _data.username)){
            socket.emit("alreadyLoggedIn");
            return;
        }
        
        let result = await userCollection.findOne({ "_id": _data.username });
        if(!result) {
            socket.emit("cantLogin");
            return;
        }

        
        try{
            if (await bcrypt.compare(_data.password, result.pw)){

                let _token = await tokenCollection.findOne({ "_id": _data.username });
                if(!_token){
                    await tokenCollection.insertOne({ "_id": _data.username})
                }

                const jwtRefreshToken = jwt.sign({user: _data.username}, process.env.REFRESH_TOKEN_SECRET);
                const jwtTempToken = jwt.sign({user: _data.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"});  
                Users.push({name: _data.username, id: socket.id});

                socket.emit("getRefreshToken", (jwtRefreshToken));
                socket.emit("loggedIn", (jwtTempToken));
            } else {
                socket.emit("cantLogin"); 
            }
        }catch{
            console.log("errorCom")
        } 
    });

    socket.on("register", async (_data) => {
        let result = await userCollection.findOne({ "_id": _data.username });

        if(result) {
            socket.emit("cantRegister", ("user already exists"));
            return;
        } 

        try {
            const _pw = await bcrypt.hash(_data.password, 10);
            await userCollection.insertOne({ "_id": _data.username, "pw": _pw});
            socket.emit("registered");
            Users.push({name: _data.username, id: socket.id});
        } catch {
            socket.emit("cantRegister", ("server error"));
        }
    });

    socket.on("logout", async () =>{
        // console.log(Users.filter(e => e.id == socket.id)[0].name);
        const name = Users.filter(e => e.id == socket.id)[0].name;
        await tokenCollection.deleteOne({ "_id": name});
    })

    socket.on("disconnecting", () => {
        Users = Users.filter(e => e.id != socket.id);
    });

    //msgs
    socket.on("sendMsg", (_data) =>{
        console.log(Users.some(e => e.name == _data.to));
        if(Users.some(e => e.name == _data.to)){
            console.log("test");
            const _id = Users.filter(e => e.name == _data.to)[0].id;
            io.to(_id).emit("getMsg", ({from: "user", msg: _data.msg}));
        }
    })
});


var Users = [];






server.listen(3007, async () => {
    try {
        await client.connect();
        userCollection = client.db("CC-local").collection("Users");
        msgCollection = client.db("CC-local").collection("msgs");
        tokenCollection = client.db("CC-local").collection("tokens");
        console.log("DB connected...");
    } catch (e){
        console.error(e);
    }
});