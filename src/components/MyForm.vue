<template>
    <form @submit.prevent="onSubmit">
      <input v-model="value" />
  
      <button type="submit" :disabled="isLoading">Submit</button>
    </form>
  </template>
  
  <script>
  import { socket } from "../socket.js";


  export default {
    name: "MyForm",
  
    data() {
      return {
        isLoading: false,
        value: ""
        
      }
    },
  
    methods: {
      onSubmit() {
        console.log("Form submitted");
        this.isLoading = true;
        socket.timeout(5000).emit('test', this.value);
        console.log("Event emitted from client-side", this.value);
        this.isLoading = false;
      },
    },
  }
  </script>