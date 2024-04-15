<template>
 
    <div class="container">
     <div class="row align-items-start">
     <div v-if="isTasksToggled" class='tasks-tab'>
<h1>{{taskboardName}}</h1>
<div class='d-flex'>
 <div class="col" id='column'>
 <h3 class='column-title' >To Do</h3>
      <div class="task d-flex align-self-left" :class="{selected: selectedTask == task.id}"  v-for="task in todo" :key="task.id" @dblclick="taskShow(task.id)" ><div class='task-wrapper' @click="taskSelect(task.id)"> {{ task.title }}</div>
      
      </div>
    </div>
    <div class="col" id='column'>
    <h3 class='column-title'>In Progress</h3>
     <div v-if="data.isMessage.value" :class="{ error: data.isError.value, message: true }">{{data.message.value}}</div>
       <div class="task d-flex align-self-left" :class="{selected: selectedTask == task.id}"  v-for="task in progress" :key="task.id" @dblclick="taskShow(task.id)" ><div class='task-wrapper' @click="taskSelect(task.id)"> {{ task.title }}</div>
 
      </div>
    </div>
    <div class="col" id='column'>
    <h3 class='column-title' >Completed</h3>
      <div class="task d-flex align-self-left" :class="{selected: selectedTask == task.id}"  v-for="task in completed" :key="task.id" @dblclick="taskShow(task.id)" ><div class='task-wrapper' @click="taskSelect(task.id)"> {{ task.title }}</div>
 
      </div>
    </div>
    </div>
    <div class='controls'>
    <button id='button' @click="taskToggle()" >Add Task</button>
    <router-link to='/app'>
          <button id='button' >Back</button>
        </router-link>
        </div>
    
  </div>


  <div v-if="!isTasksToggled" class="add-tab">
  <input placeholder="Title..." id='input' v-model='task.title.value' >
  <input placeholder="Description..." id='input' v-model='task.description.value' >
  <input placeholder="Due date..." id='input' v-model='task.dueDate.value' >
  <input placeholder="Assignee name..." id='input' v-model='task.assigneeName.value' >
  
  <div class='controls'>
  <button @click="addTask()" id='button'>Add Task</button>
  <button @click="taskToggle()" id='button'>Back</button>
  <div v-if="data.isMessage.value" :class="{ error: data.isError.value, message: true }">{{data.message.value}}</div>
  </div>
  </div>
 </div>
</div>

</template>

<script setup>
import {onMounted, ref, reactive, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { socket } from '@/utils/socket'


const router = useRouter()
const route = useRoute()
console.log(route, 'route')

const isTasksToggled = ref({type: Boolean, value: true})
const task = reactive({
    taskboardId: { type: Number, value: route.params.id },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    dueDate: { type: String, value: '' },
    assigneeId: { type: Number, value: 0 },
    assigneeName: { type: String, value: '' }
})
const data = reactive({
    isMessage: { type: Boolean, value: 0 },
    isError: { type: Boolean, value: 0 },
    message: { type: String, value: '' },
})
const taskboardName = ref({type: String, value: ''})

const selectedTask = ref({type: Number, value: 0 })

const tasks = ref([])
//const tasks = ref({type: Array, value: []})

 onMounted(async () => {
  await fetchTasks();

  socket.on('task-added', async (newTask) => {
    console.log(newTask, 'newTask')
    console.log(tasks, 'value taskboards')
    tasks.value.push(newTask);
  });

  socket.on('task-removed', async (taskId) => {
    const index = tasks.value.findIndex((t) => t.id === Number(taskId))
   if (index !== -1) {
    tasks.value.splice(index, 1)
  }
  });

})

function taskToggle() {
    isTasksToggled.value = !isTasksToggled.value 
}

function taskShow() {
  console.log('DOUBLE CLICK')
    // isTasksToggled.value = !isTasksToggled.value 
}

function taskSelect(id) {
  console.l
  selectedTask.value = id
  console.log(selectedTask.value, 'selected task value')
}

 // FETCH TASKS FROM REQUESTED TASKBOARD ON MOUNT
async function fetchTasks(){
   
    try {
    console.log(task.taskboardId.value, 'taskboard value')
    const token = document.cookie.match('token=([^;]+)');

    
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Authorization': `${token[1]}` },
      body: JSON.stringify({ taskboardId: task.taskboardId.value})
    };
    console.log(requestOptions, 'requestOptions')
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/get-tasks`, requestOptions);
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse, 'jsonResponse');
      tasks.value = jsonResponse.tasks;
      console.log(tasks.value, 'tasks.value')
      taskboardName.value = jsonResponse.taskboardName
      console.log(tasks);
    } else {
      router.push('/auth');
    }
    
  } catch (error) {
  console.log('1231123123123')
    console.error(error);
    
  }
} 
async function addTask() {
    
  try {
    const token = document.cookie.match('token=([^;]+)');
    console.log(token[1], '123123')
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
      'Authorization': `${token[1]}`,
      },
      body: JSON.stringify({ taskboard_id: task.taskboardId.value, title: task.title.value, description: task.description.value, due_date: task.dueDate, assigneeName: task.assigneeName.value })
      };
    console.log(requestOptions, 'requestedOptions')
    
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/tasks`, requestOptions)
    console.log(response, 'response')
   const jsonResponse = await response.json()
   console.log(jsonResponse, 'json response when adding task')
     if (!response.ok) {
        console.log('response not ok')
         console.log(jsonResponse)
    if (jsonResponse === 'UserNotFound') {
        data.isMessage.value = true
        data.isError.value = true
        data.message.value = `User with username ${task.assigneeName.value} not found`
        return
    }
      console.error("Failed", response.statusText);
      router.push('/auth');
      console.log(response, 'response')
    }
    data.isMessage.value = true
    data.isError.value = false
    data.message.value = `Task ${task.title.value} successfully created`
    task.value = {taskboardId: null, title: '', description: '', dueData: '', assigneeId: null};
  } catch (error) {
    console.log('123123')
    console.log('123123')
    router.push('/auth');
    console.error(error);
  }
}

const todo = computed(() => {
  return tasks.value.filter((task) => task.status === 0)
})

const progress = computed(() => {
  return tasks.value.filter((task) => task.status === 1)
})

const completed = computed(() => {
  return tasks.value.filter((task) => task.status === 2)
})

</script>

<style>
.controls {
    
    margin: 3% 0px 3% 0px
}
.task {
     user-select: none;
    cursor: pointer;
}

.column-title {
    margin: 0;
     border-bottom: 1px solid #ccc;
    padding: 10px 0px 10px 0px;
}
#column {
     border: 1px solid #ccc;
}

.task.selected {
  background-color: #55166a9e;
}

.task-wrapper {
  padding: 7px 10px 7px 10px;
  flex-grow: 1;
  text-align: left;
}
</style>