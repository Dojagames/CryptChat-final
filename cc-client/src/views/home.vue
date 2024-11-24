<script setup>
import HomeHeader from "@/components/home-header.vue";
import HomeChat from "@/components/home-chat-list.vue";
import {ref, inject} from "vue";
import {useUsersStore} from "@/stores/usersStore.js";

const userStore = useUsersStore();

const socket = inject('socket');

let addUserModal = ref(false);
let usernameToAdd = ref("");
let error = ref(null);

function addUser(username){
  socket.emit("addUser", (username));
}

socket.on('receivedUser', (user) => {
  userStore.addUser(user);
  addUserModal.value = false;
});

socket.on('addUser_failed', (reason) => {
  error.value = reason;
});



</script>

<template>
    <div class="home">
      <HomeHeader/>
      <HomeChat/>
      <div id="addUserButton" @click="addUserModal = true">
        <img src="../assets/icons/plus.png" alt="plus">
      </div>
    </div>

    <div id="addUserModal" v-if="addUserModal">
      <p style="position: absolute; right: 1vw; top: -1.5vh; font-size: 1.5rem; cursor: pointer;" @click="addUserModal = false">x</p>
      <input id="addUserModalInput" type="text" placeholder="add user" @keyup.enter="addUser(usernameToAdd)" v-model="usernameToAdd">
      <button id="addUserModalButton" @click="addUser(usernameToAdd)">Add</button>
      <p v-if="error" id="addUserModalError">{{ error }}</p>
    </div>

    <!-- userNotFoundModal -->


</template>

<style scoped>
.home {
  position: relative;
  height: 100%;
}

#addUserButton{
  position: absolute;
  right: 1vw;
  bottom: 1vh;
  width: fit-content;
  height: fit-content;
  background-color: var(--transparent-background);
  border: none;
  cursor: pointer;
  border-radius: 40%;
  padding: .2rem;
  box-shadow: -5px -5px 20px 10px rgba(255, 255, 255, 0.08), 5px 5px 20px 10px rgba(0, 0, 0, 0.1); /* More subtle 3D effect shadow */
}

#addUserButton img{
  height: 100%;
  aspect-ratio: 1;

}

#addUserModal{
  position: absolute;
  height: 20vh;
  width: 70vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--transparent-background);
  border-radius: 1vw;
  padding: 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#addUserModalInput{
  height: 2rem;
  width: 50%;
  border: 2px solid white;
  border-radius: 1rem;
  padding: .2rem .5rem;
  margin: 1rem;
  outline: none;
  background-color: transparent;
  text-align: center;
  font-size: 1.2rem;
}

#addUserModalButton{
  height: 2rem;
  width: 40%;
  border: none;
  border-radius: 1rem;
  padding: .2rem .5rem;
  margin: 1rem;
  outline: none;
  background-color: var(--secondary-background-color);
  font-size: 1.25rem;
  font-weight: bold;
}

</style>
