<script setup>
import { defineProps } from "vue";

const props = defineProps({
  msg: Object,
  newDate: Boolean
})

</script>

<template>

  <div class="msg-container" v-if="props.newDate">
    <p class="msg-date">{{msg.date}}</p>
  </div>

  <div v-if="msg.type === 'msg'" class="msg-container">
    <div class="msg-msg" :class="(!msg.you) ? 'msg-left' : 'msg-right'">
      <p>{{msg.text}}</p>
    </div>
  </div>

<div class="msg-system" v-if="false">

</div>
</template>

<style scoped>
.msg-date{
  background-color: rgba(0,0,0,0.25);
  backdrop-filter: blur(8px);
  color: var(--date-text-color);
  width: fit-content;
  padding: .5rem 1rem;
  margin: 0;
  margin-left: 50vw;
  transform: translateX(-50%);
  border-radius: 1vw;
  user-select: none;
}

.msg-container{
  width: 100vw;
  height: fit-content;
  margin: .5rem 0 .8rem 0;
  display: flex;
  flex-direction: column;
}

.msg-msg{
  padding: .75rem .8rem;
  margin: 0 1vw;
  height: fit-content;
  background-color: var(--transparent-background);
  backdrop-filter: blur(8px);
  border-radius: .85rem;
}

.msg-msg p{
  height: fit-content;
  margin: 0;
  color: inherit;
}

.msg-left{
  align-self: start;

}

.msg-right{
  align-self: end;
}

</style>
