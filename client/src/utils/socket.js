import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  barEvents: []
});

const URL = "http://localhost:5173";


export const socket = io(URL, {
  // autoConnect: false,
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});


socket.on("connect", () => {
  console.log('connect ')
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});


socket.on("test-event", (message) => {
  console.log("Test event received on client-side");
  console.log(message);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});