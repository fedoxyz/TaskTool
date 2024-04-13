<script setup>
import { ref, reactive, watch } from 'vue'

const isSignIn = ref(true)
const data = reactive({
    isMessage: false,
    isError: false,
    message: '',
})
const user = reactive({
    username: '',
    password: '',
    email: ''
})




function switchTab() {
  isSignIn.value = !isSignIn.value
}

async function SignIn() {
   try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password })
    };
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/sign-in`, requestOptions)
    if (response.ok) {
      console.log(...response.headers, await response.json())
        data.isMessage = true;
        data.isError = false;
        data.message = 'Successfully signed in';
    } else {
    const jsonResponse = await response.json()
    data.isMessage = true;
    data.isError = true;
    data.message = jsonResponse.message;
      console.error("Failed", jsonResponse.message, response.ok);
    }
  } catch (error) {
    console.error(error);
  }
}

async function SignUp() {
  try {
    console.log('123')
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, password: user.password, email: user.email })
    };
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/sign-up`, requestOptions)
    if (response.ok) {
        data.isMessage = true;
        data.isError = false;
        data.message = 'User created, now sign in';
    } else {
        data.isMessage = true;
        data.isError = true;
        data.message = 'Failed to sig123n up';
      console.error("Failed", response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

watch(data, (newValue, oldValue) => {
  console.log('Count changed:', newValue, 'Old value:', oldValue);
});


    console.log(isSignIn, 'sdasd')

</script>

<template>
  <div id='theContainer'>
    <h1>Authorization is needed</h1>
    <div class="form">
    <div class='signin-tab' v-if='isSignIn'>
    <h2>Sign in</h2>
    <input autofocus placeholder="E-mail" id='inptBtn' v-model='user.email'>
    <input placeholder="Password" id='inptBtn' v-model='user.password' >
     <button @click="SignIn()" style="margin: 23px; width: 24%;">Sign In</button>
     <button @click="switchTab()" style="margin: 23px; width: 24%;">Sign Up</button>
    </div>
    <div class='signup-tab' v-else>
    <h2>Sign Up</h2>
    <input autofocus placeholder="Username" id='inptBtn' v-model='user.username'>
    <input placeholder="E-mail" id='inptBtn' v-model='user.email'>
    <input placeholder="Password" id='inptBtn' v-model='user.password'>
      <button @click="SignUp()" style="margin: 23px; width: 24%;">Sign Up</button>
      <button @click="switchTab()" style="margin: 23px; width: 24%;">Sign In</button>
    </div>
    <span v-if="data.isMessage" :class="{ error: data.isError }">{{data.message}}</span>
    </div>
  </div>
</template>

<style>
body {
  background: linear-gradient(135deg, #153575, #4e085f);
}
#theContainer {
  text-align: center;
  margin: 23px;
  padding: 23px;
}
h1 {
    text-align: center;
    margin-top: 45px;
    margin-bottom: 45px;
    color: white;
    width: 100%;
}
h2 {
  text-align: center;
  margin-bottom: 24px;
  font-weight: lighter;
  font-family: system-ui;
  color: white;
}
button {
    width: 50%;
    border: 1px solid white !important;
    padding: 10px;
    background-color: transparent;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
  }
</style>