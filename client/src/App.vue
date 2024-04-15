

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
  padding: 0rem;
  font-weight: normal;
  text-align: center;
   min-height: 100vh;
}

header {
  text-align: center;
  color: white;
}

a {
  text-decoration: none;
  flex-grow:1;
}

h1 {
  color: #ddd!important;
}

body {
  background: linear-gradient(135deg, var(--colorPrimary), #4e085f);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  color: #ddd;
}

 input {

    padding: 10px;
    border-radius: 5px;
    color: black; 
  }

  #input {
    border-radius: 23px;
    width: 100%;
    background: transparent;
    color: white; 
  }




  button {
    border-radius: 23px;
    width: 100%;
    background: transparent;
    color: #ddd; 
    width: 33%;
    border: 2px solid rgba(0, 0, 0, 0.1) !important;
    padding: 10px;
  }

  button.main {
    background:  linear-gradient(135deg, #401f819e, #30206b);
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
    border: 1px solid #ffffff4a;
    border-radius: 23px;
    background-color: #ddd;
    color: #ddd; 
    background-color: transparent;
    overflow: hidden;
    
  }

  .message {
    color: #fff;
    margin-top: 3%;
    font-weight: 200;
  }
  .error {
    color: red;
  }

#button {
      margin-left: 3.5%;
    margin-right: 3.5%;
}




</style>