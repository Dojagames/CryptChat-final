<script setup>
import ChatHeader from "@/components/chat-Header.vue";
import Message from "@/components/message.vue";
import ChatFooter from "@/components/chat-footer.vue";

import { useRoute } from 'vue-router';
import {ref, onMounted, nextTick, inject} from 'vue';


import {useUsersStore} from "@/stores/usersStore.js";
import {useProfileStore} from "@/stores/profileStore.js";

const socket = inject('socket');
const ec = inject('ec');

const route = useRoute();
const userStore = useUsersStore();
const users = userStore.users;

const profile = useProfileStore();

const privateKeyImport = profile.profile.privateKey;
console.log(privateKeyImport);
let privateKey;
let keyPair;
if(privateKeyImport){
  keyPair = ec.keyFromPrivate(privateKeyImport, 'hex');
}

const chat = users[route.params.user] || {username: "test"}; // use for header

const chatContainer = ref(null);





var dateToCheck;


//load chat storage or store?
//split Msgs in tempBuffer?
const messages = ref([]);

messages.value = [ //temp
  {text: "testMsg1", you: false, timeStamp: "04:20", date: "23-03", type: "msg"},
  {text: "testMsg2", you: false, timeStamp: "04:20", date: "23-03", type: "msg"},
  {text: "testMsg3", you: true, timeStamp: "04:21", date: "23-03", type: "msg"},
  {text: "testMsg4", you: true, timeStamp: "04:22", date: "23-03", type: "msg"},
  {text: "testMsg5", you: false, timeStamp: "04:22", date: "24-03", type: "msg"},
  {text: "testMsg6", you: false, timeStamp: "04:20", date: "23-04", type: "msg"},
  {text: "testMsg7", you: false, timeStamp: "04:20", date: "23-04", type: "msg"},
  {text: "testMsg8", you: true, timeStamp: "04:21", date: "23-04", type: "msg"},
  {text: "testMsg9", you: true, timeStamp: "04:22", date: "23-04", type: "msg"},
  {text: "testMsg10", you: false, timeStamp: "04:22", date: "24-04", type: "msg"},
  {text: "testMsg11", you: false, timeStamp: "04:20", date: "23-05", type: "msg"},
  {text: "testMsg12", you: false, timeStamp: "04:20", date: "23-05", type: "msg"},
  {text: "testMsg13", you: true, timeStamp: "04:21", date: "23-05", type: "msg"},
  {text: "testMsg14", you: true, timeStamp: "04:22", date: "23-05", type: "msg"},
  {text: "testMsg15", you: false, timeStamp: "04:22", date: "24-05", type: "msg"},
  {text: "testMsg16", you: false, timeStamp: "04:20", date: "23-05", type: "msg"},
  {text: "testMsg17", you: false, timeStamp: "04:20", date: "23-05", type: "msg"},
  {text: "testMsg18", you: true, timeStamp: "04:21", date: "23-05", type: "msg"},
  {text: "testMsg19", you: true, timeStamp: "04:22", date: "23-05", type: "msg"},
  {text: "testMsg20", you: false, timeStamp: "04:22", date: "24-05", type: "msg"},
]



function loadMoreMessages(callback){
  return true
  //load msg from

  const newMessages = checkForMessagesToLoad();
  if (!newMessages.length){ //returns true if all messages are laoded
    callback(true);
    return
  }
  messages.value = [...newMessages, ...messages.value];
}

function checkForMessagesToLoad() {
  //check db or smth
}

function handleScroll() {
  const el = chatContainer.value;
  if (el.scrollTop / el.scrollHeight <= 0.2) {

    // User reached the top, load more messages
    const currentHeight = el.scrollHeight;
    loadMoreMessages((e) => {
      if(!e){
        // Keep the scroll position consistent after loading more messages
        nextTick(() => {
          el.scrollTop = el.scrollHeight - currentHeight;
        });
      }
    });
  }
}



function scrollToBottom() {
  const el = chatContainer.value;
  el.scrollTop = el.scrollHeight;
}




function addMessage(newMessage) {
  // Add the new message to the end of the messages array


  //add msg
  messages.value.push({
    id: messages.value.length + 1, // Use length for new ID (in production, use a unique identifier)
    text: newMessage,
  });

  //checks if it should scroll
  checkForScrollToBottom();
}

function checkForScrollToBottom() {
  const el = chatContainer.value;
  const threshold = .25;//in percent //let user pick a value
  const scrollBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) / (el.scrollHeight - el.clientHeight);
  if(scrollBottom <= threshold){

    // Scroll to bottom after adding a new message
    nextTick(() => {
      scrollToBottom();
    });
  } else {
    //show new message indicator at bottom
  }
}






onMounted(() => {
  // Load the initial messages
  //let msgsAvailable = true;
  //while (messages.value.length < 100 && msgsAvailable){
   // loadMoreMessages((e) => {
   //   console.log(e);
    //  if(!e){
    //    msgsAvailable = false;
     // }
   // });
   // msgsAvailable = false;
  //}



  // Scroll to the bottom when messages are first loaded
  nextTick(() => {
    scrollToBottom();
  });
});

function search(value) {
  console.log(value);
//handle search
  if(value){
    //search texts in chat ()
  }
}
//emits from header
function openProfile(){
  //create modal with profilepicture and username from chat.username and chat.displayName
  //modal should be closed when clicking outside

  console.log("open profile");
}

function call(){
  console.log("call");
}

function openSettings(){
  console.log("open settings");
}

async function sendMsg(msg){
  const encrypted = await EncryptMsg(msg);
  if(encrypted){
    const signature = keyPair.sign(encrypted).toDER('hex');
    socket.emit('send_message', {
      to: chat.username,
      from: profile.profile.username,
      message: encrypted,
      signature,
    });
    console.log("sent msg");
  } else {
    alert("couldnt encrypt msg");
  }
}

async function EncryptMsg(msg){
  const publicKeyHex = chat.publicKey;
  return JSON.stringify(await encryptMessage(publicKeyHex, msg));
}

async function encryptMessage(publicKeyHex, message) {
  const aesKey = await deriveSharedSecret(keyPair.getPrivate('hex'), publicKeyHex);

  // Encrypt the message using AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM requires a 12-byte IV
  const encodedMessage = new TextEncoder().encode(message);
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    aesKey,
    encodedMessage
  );

  return {
    iv: Array.from(iv).map((b) => b.toString(16).padStart(2, '0')).join(''),
    encryptedMessage: Array.from(new Uint8Array(encryptedBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
  };
}

async function deriveSharedSecret(privateKeyHex, otherPublicKeyHex) {
  try {
    const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');
    const otherPublicKey = ec.keyFromPublic(otherPublicKeyHex, 'hex');

    // Derive shared secret using ECDH
    const sharedSecret = privateKey.derive(otherPublicKey.getPublic());
    // Ensure ArrayBuffer conversion
    const sharedSecretArray = Uint8Array.from(sharedSecret.toString(16).match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    // Hash the shared secret
    const hashBuffer = await crypto.subtle.digest('SHA-256', sharedSecretArray);

    // Cache the hashed shared secret
    return await crypto.subtle.importKey('raw', hashBuffer, 'AES-GCM', false, ['encrypt', 'decrypt']);
  } catch (error) {
    console.error('Error in deriveSharedSecret:', error);
    throw error;
  }
}

</script>
<!-- wrap in div with flex and  -->
<template>
  <div id="chat-wrapper">
    <ChatHeader :chat="chat" @openProfile="openProfile" @search="search" @call="call" @openSettings="openSettings"/>
    <div ref="chatContainer" id="msgBox" @scroll="handleScroll">
      <Message  v-for="(msg, index) in messages"
                :msg="msg"
                :newDate="(index !== 0) ? (messages[index - 1].date !== messages[index].date) : true"
      />
    </div>
    <ChatFooter @changedHeight="scrollToBottom" @sendMsg="sendMsg"/>
  </div>

  <div id="profile-modal" v-if="showProfileModal">
    <div id="profile-modal-content">
      <img id="profile-modal-picture" src="https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg" alt="profile picture">
      <p id="profile-modal-displayName">{{chat.displayName}}</p>
    </div>
    <div id="profile-modal-buttons">
      <button id="profile-modal-button-close">Close</button>
      <button id="profile-modal-button-edit">Edit</button>
    </div>
  </div>
  <div id="profile-modal-buttons" v-if="showSearchModal">
    <!--  -->
  </div>
</template>

<style scoped>
  #chat-wrapper {
    width: 100vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  #msgBox{
    overflow: hidden;
    overflow-y: scroll;
    flex: 1;
  }
</style>
