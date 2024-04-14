<script setup>
import { onMounted, ref, reactive } from 'vue'
import { socket } from '@/utils/socket'
import { useRouter } from 'vue-router';

const router = useRouter();

const taskboard = reactive({
  id: null,
  name: '',
  creatorId: null
})

const userId = ref(0)

const taskboards = ref([])


async function addTaskboard(name) {
  console.log(name, 'name in addTaskboard()')
  try {
    const token = document.cookie.match('token=([^;]+)');
    console.log(token[1], '123123')
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
      'Authorization': `${token[1]}`,
      },
      body: JSON.stringify({ name })
      };
    console.log(requestOptions, 'requestedOptions')
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/taskboards`, requestOptions)
     if (!response.ok) {
      console.error("Failed", response.statusText);
      router.push('/auth');
    }
    taskboard.value = {id: null, name: '', creatorId: null};
  } catch (error) {
    console.lop('123123')
    router.push('/auth');
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
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/taskboards/${id}`, requestOptions);
  if (!response.ok) {
      console.error("Failed", response.statusText);
      router.push('/auth');
    }
   
  } catch (error) {
    router.push('/auth');
    console.error(error);
  }
}



onMounted(async () => {
  await fetchTasks();

  socket.on('taskboard-added', async (newTask) => {
    console.log(newTask, 'newTask')
    console.log(taskboards.value, 'value taskboards')
    taskboards.value.push(newTask);
  });

  socket.on('taskboard-removed', async (taskId) => {
    const index = taskboards.value.findIndex((t) => t.id === Number(taskId))
   if (index !== -1) {
    taskboards.value.splice(index, 1)
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
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/taskboards`, requestOptions);
    if (response.ok) {
      
      const jsonResponse = await response.json();
      console.log(jsonResponse)
      userId.value = jsonResponse.userId
      taskboards.value = jsonResponse.taskboards
      console.log(userId.value)
    } else {
      router.push('/auth');
    }
    
  } catch (error) {
  console.log('1231123123123')
    console.error(error);
    
  }
}
</script>

<template>
  <div id="container" style="text-align: center; display: inline-block; width: 49%;"> 
<h1>Taskboards</h1>
     
    <ul>
      <li v-for="item in taskboards" :key="item.id">  
        {{ item.name}}      
        <button v-if="item.creatorId == userId" type="button" class="btn-close btn-close-white" aria-label="Close" @click="deleteTask(item.id)"></button>
      </li>
    </ul>
     <input autofocus placeholder="Taskboard title..." id='inptBtn' v-model="taskboard.name">
      <button @click="addTaskboard(taskboard.name)" id="addBtn">Add Taskboard</button>     
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