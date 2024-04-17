<template>
  <div id="theContainer">
    <h1>Hello World</h1>
    <h2>TaskTool</h2>
    <router-link to="/app">
      <button class="main" style="margin: 23px; width: 24%">Start</button>
    </router-link>
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
h2 {
  text-align: center;
  margin-bottom: 24px;
  font-weight: lighter;
  font-family: system-ui;
  color: #ddd;
}
</style>
