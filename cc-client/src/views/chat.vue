<script setup>
import ChatHeader from "@/components/chat-Header.vue";
import Message from "@/components/message.vue";
import ChatFooter from "@/components/chat-footer.vue";

import { useRoute } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue';

const route = useRoute();
const chat = route.params.user; // use for header


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



</script>
<!-- wrap in div with flex and  -->
<template>
  <div id="chat-wrapper">
    <ChatHeader :chat="chat"/>
    <div ref="chatContainer" id="msgBox" @scroll="handleScroll">
      <Message  v-for="(msg, index) in messages"
                :msg="msg"
                :newDate="(index !== 0) ? (messages[index - 1].date !== messages[index].date) : true"
      />
    </div>
    <ChatFooter/>
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
