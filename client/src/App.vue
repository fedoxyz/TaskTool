<script setup>
import HeaderComponent from './components/HeaderComponent.vue'
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>



<style>
#app {
  display: block;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 23px;
  padding: 0rem;
  font-weight: normal;
  text-align: center;
}

header {
  text-align: center;
  color: white;
}

body {
  background: linear-gradient(135deg, var(--colorPrimary), #4e085f);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

 input {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    color: black; 
  }




  #inptBtn {
    border-radius: 23px;
    height: 59px;
    margin-bottom: 5%;
    width: 89%;
    background: transparent;
    color: white; 
  }


  #addBtn {
    width: 50%;
    border: 1px solid white !important;
  }



  button:hover {
    background-color: #aaaaaa23;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ffffff4a;
    border-radius: 23px;
    background-color: #fff;
    color: rgb(255, 255, 255); 
    background-color: transparent;
  }

  span {
    color: white;
  }
  .error {
    color: red;
  }

</style>