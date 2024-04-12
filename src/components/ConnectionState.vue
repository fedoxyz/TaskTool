<template>
    <p>State: {{ connected }}</p>
  </template>
  
  <script>
  import { state } from "../socket.js";
  
  
  export default {
    name: "ConnectionState",
  
    computed: {
      connected() {
        return state.connected;
      }
    }
  }
  </script>