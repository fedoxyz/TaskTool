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
</style>