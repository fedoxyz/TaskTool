<script setup>
import { onMounted, ref } from 'vue'
import { socket } from '@/utils/socket'

const newTodo = ref('')
const todos = ref([])

async function addTask(text) {
  try {
    const token = document.cookie.match('token=([^;]+)');
    console.log(token[1], '123123')
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
      'Authorization': `${token[1]}`,
      },
      body: JSON.stringify({ text: text })
      };
    console.log(requestOptions, 'requestedOptions')
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/tasks`, requestOptions)
    console.log(response)
    newTodo.value = '';
  } catch (error) {
    console.error(error);
  }
}

// FETCH API
async function deleteTask(id) {
  try {
    const token = document.cookie.match('token=([^;]+)');
    const requestOptions = {
      method: "DELETE",
      headers: { 'Authorization': `${token[1]}` },
    };
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/tasks/${id}`, requestOptions);

    if (response.ok) {
      
      
    } else {
      console.error("Failed", response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}



onMounted(async () => {
  await fetchTasks();

  socket.on('task-added', async (newTask) => {
    console.log(newTask, 'newTask')
    console.log(todos.value, 'value todos')
    todos.value.push(newTask);
  });

  socket.on('task-removed', async (taskId) => {
    const index = todos.value.findIndex((t) => t.id === Number(taskId))
   if (index !== -1) {
    todos.value.splice(index, 1)
  }
  });

})

async function fetchTasks() {
  try {
    const token = document.cookie.match('token=([^;]+)');
    const requestOptions = {
      method: "get",
      headers: { 'Authorization': `${token[1]}` },
    };
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/tasks`, requestOptions);
    todos.value = await response.json();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div id="container" style="text-align: center; display: inline-block; width: 49%;"> 

      <input autofocus placeholder="add your texthere" id='inptBtn' v-model="newTodo">
      <button @click="addTask(newTodo)" id="addBtn">Add Todo</button>     
    <ul>
      <li v-for="item in todos" :key="item.id">  
        {{ item.text }}         
        <button style='height: 39px; width: 39px; border-radius: 23px;' @click="deleteTask(item.id)">X</button>
      </li>
    </ul>
    <router-link to="/">
        <button style="width: 157px;">Back to Home</button>
    </router-link>
  </div>
</template>


<style scoped> 
 

  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }


  form {
    display: flex;
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 23px;
    flex-direction: column;
    align-items: center;
    border: 2px solid #ccc;
    border-radius: 34px;
    padding-top: 34px;
    padding-bottom: 34px;
    background-color: transparent;
  }

 
</style>