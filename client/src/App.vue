<script>
  import {io} from 'socket.io-client'
  const socket = io('localhost:3007');

export default {

    data(){
        return {
            view: "login",

            loginInput: "",
            loginPassword: "",
            loginStayLoggedIn: true,
            registerPassword: "",
            registerPassword2: "",
            registerUser: "",


            refreshToken: undefined,


            msgto: "",
            msg: "",

            privateKey: undefined,

            users: [],
            currentChat: {name: undefined, key: undefined},
            chats: [],
        }
    },
    components: {
        
    },
    props: {
        
    },
    methods: {
        Login(user, pw, stayLoggedin){
            socket.emit("login", {username: user, password: pw, stayLogged: stayLoggedin});
        },
        Register(user, pw1, pw2){
            //reset warnings
            if(pw1 != pw2){
                //show pw must match
                return;
            }

            // if(p1.length < 11){
            //     //show pw must be at least 12 characters long
            //     return;
            // }
            socket.emit("register", {"username": user, "password": pw1})
        },

        GetToken(){
            socket.emit("getToken", (refreshToken))
        },

        logOut(){
            socket.emit("logout");
            localStorage.removeItem("token");
            sessionStorage.removeItem("tempToken");
            this.view = "login";
        },

        changeView(_view){
            this.view = _view;
        },

        searchUser(_username){
            socket.emit("getUser", (_username));
        },

        sendMsg(_msg, _user){
            var pki = forge.pki;
            var publicKey = pki.publicKeyFromPem(_user.key);

            var bytes = window.btoa(_msg);
            var encrypted = publicKey.encrypt(bytes, "RSA-OAEP");
            var _sendMsg = JSON.stringify(encrypted);
  
            socket.emit("sendMsg", ({to: _user.name, msg: _sendMsg}));
        },
        
    },
    created() {
        socket.on("cantLogin", () => {
           alert("noUser")
        });

        socket.on("cantRegister", (_cause) => {
           alert(_cause);
            //show cant register
        });

        socket.on("loggedIn", (token) => {
            sessionStorage.setItem("tempToken", token);
            this.view = "main";
        });

        socket.on("alreadyLoggedIn", () => {
            alert("alreadyLoggedIn");
        });

        socket.on("registered", (key) => {
            var pki = forge.pki;
            var privateKey = pki.privateKeyFromPem(key);
            this.privateKey = privateKey;

            localStorage.setItem("pKey", JSON.stringify(key));
            this.view = "main";
        });

        socket.on("deleteToken", () => {
            localStorage.removeItem("token");
            //show that you have been locked out
        });

        socket.on("tempTokenExpired", () => {
            this.refreshToken = localStorage.getItem("token");
            if(this.refreshToken){
                socket.emit("getTempToken", (this.refreshToken));
            }
        });

        socket.on("getRefreshToken", (token) =>{
            this.refreshToken = token;
            localStorage.setItem("token", token);
        });

        socket.on("Userfound", (_user) => {
            if(_user == null) {
                alert("user not found");
                return;
            }

           
            //check if users is already in db
            if(this.users.some(e => e.name == _user.name)){
                this.view = "chat";
                this.currentChat = _user;
                return;
            }

            this.users.push(_user);
            this.chats.push({name: _user.name, chat: []});


            localStorage.setItem("users", JSON.stringify(this.users));
            localStorage.setItem(_user.name, JSON.stringify(this.chats.filter(e => e.name == _user.name)[0].chat));
            this.currentChat = _user;
            this.view = "chat";
        });

        socket.on("gotKey", (_user) => {
            const localuser = this.users.filter(e => e.name == _user.name);
            if(localuser.length > 0){
                this.users.filter(e => e.name == _user.name)[0].key = _user.key;
                localStorage.setItem("users", JSON.stringify(this.users));
                localStorage.setItem(_user.name, JSON.stringify(this.chats.filter(e => e.name == _user.name)[0].chat));
            } else {
                this.users.push(_user);
                this.chats.push({name: _user.name, chat: []});
                localStorage.setItem("users", JSON.stringify(this.users));
                localStorage.setItem(_user.name, JSON.stringify(this.chats.filter(e => e.name == _user.name)[0].chat));
            }
        })

        socket.on("getMsg", (msg) => {
            const _user = msg.from;
            const _msg = window.atob(this.privateKey.decrypt(JSON.parse(msg.msg), "RSA-OAEP"));
            const localuser = this.chats.filter(e => e.name == _user);

            if(localuser.length > 0){
                this.chats.filter(e => e.name == _user)[0].chat.push(_msg);
                localStorage.setItem(_user, JSON.stringify(this.chats.filter(e => e.name == _user)[0].chat));
            } else {
                socket.emit("getPublicKeyFromNewUser", (_user));

                this.users.push({name: _user, key: null});
                this.chats.push({name: _user, chat: [_msg]});
                localStorage.setItem("users", JSON.stringify(this.users));
                localStorage.setItem(_user, JSON.stringify(this.chats.filter(e => e.name == _user)[0].chat));
            }
        });

    },
    mounted(){
        const privateKey = localStorage.getItem("pKey");
        if(privateKey) {
            var pki = forge.pki;

            const tempkey = JSON.parse(privateKey);
            var pKey = pki.privateKeyFromPem(tempkey);
            this.privateKey = pKey;
        }

        const _users = localStorage.getItem("users");
        if(_users){
            this.users = JSON.parse(_users);
            this.users.forEach(e => {
                let _tempUser = localStorage.getItem(e.name);
                if(_tempUser){
                    _tempUser = JSON.parse(_tempUser);
                    this.chats.push({name: e.name, chat: _tempUser});
                }
            });
        }




        const tempToken = sessionStorage.getItem("tempToken");
        if(!tempToken){
            this.refreshToken = localStorage.getItem("token");
            if(this.refreshToken) {
                socket.emit("getTempToken", (this.refreshToken));
            }
        } else {
            socket.emit("verifyToken", (tempToken));
        }

       
        
    },
    watch: {
        
    },
    computed: {
        currentChatMsgs(){
            const chat = this.chats.filter(e => e.name == this.currentChat.name);
            if(chat.length > 0){
                const chatMsgs = chat[0].chat;
                return chatMsgs;
            }
           else {
            return [];
           }
        },
    }

}
</script>

<template>
    
    <div class="login" v-if="view === 'login'">
        <h3>Login</h3>
        <input type="text" placeholder="username" v-model="loginInput" style="background-color: transparent;"><br>
        <input type="password" placeholder="password" v-model="loginPassword" style="background-color: transparent;"><br>
        <button @click="Login(loginInput, loginPassword, false)">login</button>

        <br><br>
        <button @click="changeView('register')">Register?</button>
    </div>

    <div class="login" v-if="view === 'register'">
        <h3>Register</h3>
        <input type="text" placeholder="username" v-model="registerUser" style="background-color: transparent;"><br><br>

        <input type="password" placeholder="password" v-model="registerPassword" style="background-color: transparent;"><br>
        <input type="password" placeholder="password" v-model="registerPassword2" style="background-color: transparent;"><br>
        <button @click="Register(registerUser, registerPassword, registerPassword2 )">Register</button>

        <br><br>
        <button @click="changeView('login')">Login?</button>
    </div>

    <div id="main" v-if="view === 'main'">
        <button @click="logOut()" style="background-color: transparent;">log out</button>
        
        <div id="userlist">
            <div class="userInList" v-for="user in users" @click="currentChat = user; view = 'chat'; ">
                {{ user.name }}
            </div>
        </div>


        <button @click="changeView('search')" style="position: absolute; right: 15px; bottom: 15px; background-color: transparent; font-size: x-large;">add User</button>
        
        <!-- <div id="window" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center;">
            <input type="text" style="background-color: transparent;" v-model="msgto" placeholder="send to"><br>
            <input type="text" style="background-color: transparent;" v-model="msg" placeholder="msg"><br>
            <button @click="sendMsg()">send</button>
        </div> -->
        
    </div>

    <div id="addUser" v-if="view ==='search'">
        <input type="text" style="background-color: transparent;" v-model="msgto" placeholder="username"><br>
        <button @click="searchUser(msgto)">Search</button>
    </div>

    <div id="chat" v-if="view === 'chat'">
        <h1>{{ this.currentChat.name }}</h1>

        <div id="chatInterface">
            <div class="msg" v-for="msg in currentChatMsgs">
                {{ msg }}
            </div>
            <input type="text" style="background-color: transparent;" v-model="msg" placeholder="msg"><br>
            <button @click="sendMsg(msg, this.currentChat)">send</button>
        </div>
    </div>

</template>

<style scoped>
    .login{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

        width: 300px;
        height: 400px;

        background-color: rgba(255, 0, 0, 0.178);

        text-align: center;
    }

    #addUser{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
</style>