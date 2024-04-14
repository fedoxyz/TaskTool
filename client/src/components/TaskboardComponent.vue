<template>
 
    <div class="container">
     <div class="row align-items-start">
    
<h1>{{taskboardName}}</h1>
 <div class="col">
      <div class="task" v-for="task in todo" :key="task.id">
        <router-link
          :to="{ name: 'Task', params: { id: task.id }, props: { task } }"
        >
          {{ task.title }}
        </router-link>
      </div>
    </div>
    <div class="col">
       <div class="task" v-for="task in progress" :key="task.id">
        <router-link
          :to="{ name: 'Task', params: { id: task.id }, props: { task } }"
        >
          {{ task.title }}
        </router-link>
      </div>
    </div>
    <div class="col">
      <div class="task" v-for="task in completed" :key="task.id">
        <router-link
          :to="{ name: 'Task', params: { id: task.id }, props: { task } }"
        >
          {{ task.title }}
        </router-link>
      </div>
    </div>
  </div>
  <input placeholder="Title..." id='inptBtn' v-model='task.title' >
  <input placeholder="Description..." id='inptBtn' v-model='task.description' >
  <input placeholder="Due date..." id='inptBtn' v-model='task.dueDate' >
  <input placeholder="Assignee name..." id='inptBtn' v-model='task.assigneeName' >
  </div>

</template>

<script setup>
import {onMounted, ref, reactive, defineProps} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { socket } from '@/utils/socket'

const router = useRouter()
const route = useRoute()
console.log(route, 'route')
const task = reactive({})
const taskboardId = ref(route.params.id)
const taskboardName = ref(0)

const tasks = ref([])
 // NEED INITIALIZE PROPS
// const props = defineProps({
//   taskboardName: {
//     type: String,
//     required: true
//   }
// })



 onMounted(async () => {
  await fetchTasks();

  socket.on('task-added', async (newTask) => {
    console.log(newTask, 'newTask')
    console.log(tasks.value, 'value taskboards')
    tasks.value.push(newTask);
  });

  socket.on('task-removed', async (taskId) => {
    const index = tasks.value.findIndex((t) => t.id === Number(taskId))
   if (index !== -1) {
    tasks.value.splice(index, 1)
  }
  });

})


 // FETCH TASKS FROM REQUESTED TASKBOARD ON MOUNT
async function fetchTasks(){
    try {
    console.log(taskboardId.value, 'taskboard value')
    const token = document.cookie.match('token=([^;]+)');

    
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Authorization': `${token[1]}` },
      body: JSON.stringify({ taskboardId: taskboardId.value })
    };
    console.log(requestOptions, 'requestOptions')
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/tasks`, requestOptions);
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse, 'jsonResponse');
      tasks.value = jsonResponse.tasks;
      taskboardName.value = jsonResponse.taskboardName
      console.log(tasks.value);
    } else {
      router.push('/auth');
    }
    
  } catch (error) {
  console.log('1231123123123')
    console.error(error);
    
  }
} 

</script>