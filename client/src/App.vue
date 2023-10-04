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
            // localStorage.removeItem("token");
            // sessionStorage.removeItem("tempToken");
            // this.view = "login";
        },

        changeView(_view){
            this.view = _view;
        },

        sendMsg(){
            socket.emit("sendMsg", ({to: this.msgto, msg: this.msg}));
        },
        
    },
    created() {
        socket.on("cantLogin", () => {
           alert("noUser")
        });

        socket.on("cantRegister", (_cause) => {
           alert("test");
            //show cant register
        });

        socket.on("loggedIn", (token) => {
            sessionStorage.setItem("tempToken", token);
            this.view = "main";
        });

        socket.on("alreadyLoggedIn", () => {
            alert("alreadyLoggedIn");
        });

        socket.on("registered", () => {
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

        socket.on("getMsg", (msg) => {
            alert(msg.from + " : " + msg.msg);
        });

    },
    mounted(){
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

}
</script>

<template>
    
    <div id="login" v-if="view === 'login'">
        <h3>Login</h3>
        <input type="text" placeholder="username" v-model="loginInput" style="background-color: transparent;"><br>
        <input type="password" placeholder="password" v-model="loginPassword" style="background-color: transparent;"><br>
        <button @click="Login(loginInput, loginPassword, false)">login</button>

        <br><br>
        <button @click="changeView('register')">Register?</button>
    </div>

    <div id="register" v-if="view === 'register'">
        <h3>Register</h3>
        <input type="text" placeholder="username" v-model="registerUser" style="background-color: transparent;"><br><br>

        <input type="password" placeholder="password" v-model="registerPassword" style="background-color: transparent;"><br>
        <input type="password" placeholder="password" v-model="registerPassword2" style="background-color: transparent;"><br>
        <button @click="Register(registerUser, registerPassword, registerPassword2 )">Register</button>

        <br><br>
        <button @click="changeView('login')">Login?</button>
    </div>

    <div id="main" v-if="view === 'main'">
        <button @click="logOut()">log out</button>
        <div id="window" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center;">
            <input type="text" style="background-color: transparent;" v-model="msgto" placeholder="send to"><br>
            <input type="text" style="background-color: transparent;" v-model="msg" placeholder="msg"><br>
            <button @click="sendMsg()">send</button>
        </div>
        
    </div>

</template>

<style scoped>
    #login{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

        width: 300px;
        height: 400px;

        background-color: rgba(255, 0, 0, 0.178);

        text-align: center;
    }
</style>