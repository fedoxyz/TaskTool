<template>
 
    <div class="container">
     <div class="row align-items-start">
     <div v-if="isTasksToggled" class='tasks-tab'>
<h1>{{taskboardName}}</h1>
<div class='d-flex'>
 <div class="col" id='column'>
 <h3 class='column-title' >To Do</h3>
       <draggable @end='checkMove' class="tasks"  item-key="id" :animation="300" :list="todo" tag="ul" group='tasks' id='0'>
    <template #item="{ element: task }">
      <li id='task'>
      <div  tag='div' class="task d-flex align-self-left" :class="{selected: selectedTask == task.id}"  @dblclick="taskShow(task.id)" ><div class='task-wrapper' @mousedown="taskSelect(task.id)"> {{ task.title }}</div>
      </div>
      </li>
    </template>
  </draggable>
    </div>
    <div style="border-right: none; border-left: none" class="col" id='column'>
    <h3 class='column-title'>In Progress</h3>
     <div v-if="data.isMessage.value" :class="{ error: data.isError.value, message: true }">{{data.message.value}}</div>
       <draggable @end='checkMove' class="tasks"   item-key="id" :animation="300"  :list="progress" tag="ul" group='tasks' id='1'>
    <template #item="{ element: task }">
      <li id='task'>
      <div tag='div' class="task d-flex align-self-left" :class="{selected: selectedTask == task.id}"  @dblclick="taskShow(task.id)" ><div class='task-wrapper' @mousedown="taskSelect(task.id)"> {{ task.title }}</div>
      </div>
      </li>
    </template>
  </draggable>
    </div>
    <div class="col" id='column'>
    <h3 class='column-title' >Completed</h3>
      <draggable @end='checkMove' class="tasks" item-key="id" :animation="300" :list="completed" tag="ul" group='tasks' id='2'>
    <template #item="{ element: task }">
      <li id='task'>
      <div tag='div' class="task d-flex align-self-left" :class="{selected: selectedTask == task.id}"  @dblclick="taskShow(task.id)" ><div class='task-wrapper' @mousedown="taskSelect(task.id)"> {{ task.title }}</div>
      </div>
      </li>
    </template>
  </draggable>
    </div>
    </div>
    <div class='controls'>
    <button class='main' id='button' @click="taskToggle()" >Add Task</button>
    <router-link to='/app'>
          <button id='button' >Back</button>
        </router-link>
        </div>
    
  </div>


  <div v-if="!isTasksToggled" class="add-tab">
  <h1>Add Task</h1>
  <input placeholder="Title..." id='input' v-model='task.title.value' >
  <input class='mt-3' placeholder="Description..." id='input' v-model='task.description.value' >
  <input class='mt-3' placeholder="Due date..." id='input' v-model='task.dueDate.value' >
  <input class='mt-3' placeholder="Assignee name..." id='input' v-model='task.assigneeName.value' >
  
  <div class='controls'>
  <button class='main' @click="addTask()" id='button'>Add Task</button>
  <button @click="taskToggle()" id='button'>Back</button>
  <div v-if="data.isMessage.value" :class="{ error: data.isError.value, message: true }">{{data.message.value}}</div>
  </div>
  </div>
 </div>
</div>

</template>

<script setup>
import {onMounted, ref, reactive, computed, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { socket } from '@/utils/socket'
import draggable from 'vuedraggable';



const router = useRouter()
const route = useRoute()
console.log(route, 'route')

const isTasksToggled = ref({type: Boolean, value: true})
const task = reactive({
    taskboardId: { type: Number, value: route.params.id },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    dueDate: { type: String, value: '' },

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

const todo = ref([])
const progress = ref([])
const completed = ref([])


 onMounted(async () => {
  await fetchTasks();
  console.log(tasks.value)
  todo.value = tasks.value.filter((task) => task.status === 0)
progress.value = tasks.value.filter((task) => task.status === 1)
completed.value = tasks.value.filter((task) => task.status === 2)
  console.log(todo.value, 'after fetch tasks')
console.log(progress.value)
console.log(completed.value) 

  socket.on('task-added', async (newTask) => {
    console.log(newTask, 'newTask')
    if (newTask.taskboard_id == task.taskboardId.value) {
      console.log(tasks, 'value taskboards')
    todo.value.push(newTask);
    }
    
  });

  socket.on('task-removed', async (taskId) => {
    const index = tasks.value.findIndex((t) => t.id === Number(taskId))
   if (index !== -1) {
    tasks.value.splice(index, 1)
  }
  });
   socket.on('task-updated', async (taskUpdated) => {
    console.log(taskUpdated, 'task on socket update')
    console.log(todo.value.filter(task => task.id === taskUpdated.id), 'value todo')
    var taskIndex = null;

    if (taskUpdated.status === 0) { 
      console.log('status is 0')
        taskIndex = todo.value.findIndex((t) => t.id === Number(taskUpdated.id))
      if (taskIndex !== -1) {
        console.log(taskIndex, 'in todo')
      taskIndex = progress.value.findIndex((t) => t.id === Number(taskUpdated.id))
      if (taskIndex !== -1) { 
        console.log(taskIndex, 'in progress')
        progress.value.splice(taskIndex, 1)
        return
      } else {
        taskIndex = completed.value.findIndex((t) => t.id === Number(taskUpdated.id))
        if (taskIndex !== -1) { 
        console.log(taskIndex, 'in completed')
        completed.value.splice(taskIndex, 1)
        return
      } else {
return
      }
        
      }
  } else {
    todo.value.push(taskUpdated)
    taskIndex = progress.value.findIndex((t) => t.id === Number(taskUpdated.id))
    if (taskIndex !== -1) { 
        progress.value.splice(taskIndex, 1)
        return
      } else {
        taskIndex = completed.value.findIndex((t) => t.id === Number(taskUpdated.id))
        completed.value.splice(taskIndex, 1)
        return
      }
  }
    } else if (taskUpdated.status === 1) {
      console.log('status is 1')
      taskIndex = progress.value.findIndex((t) => t.id === Number(taskUpdated.id))
      console.log(taskIndex, 'in progress')
      if (taskIndex !== -1) {
        console.log('found in progress')
      taskIndex = todo.value.findIndex((t) => t.id === Number(taskUpdated.id))
      console.log(taskIndex, 'index in todo')
      if (taskIndex !== -1) { 
        console.log('splice todo')
        todo.value.splice(taskIndex, 1)
        return
      } else {
        taskIndex = completed.value.findIndex((t) => t.id === Number(taskUpdated.id))
        if (taskIndex !== -1) { 
        console.log('splice todo')
        completed.value.splice(taskIndex, 1)
        return
        }
      }
  } else  {
    progress.value.push(taskUpdated)
    taskIndex = todo.value.findIndex((t) => t.id === Number(taskUpdated.id))
    if (taskIndex !== -1) { 
        todo.value.splice(taskIndex, 1)
        return
      } else {
        taskIndex = completed.value.findIndex((t) => t.id === Number(taskUpdated.id))
        completed.value.splice(taskIndex, 1)
        return
      }
  }
    } else  {
      taskIndex = completed.value.findIndex((t) => t.id === Number(taskUpdated.id))
      console.log(taskIndex, 'task index in completed')
      if (taskIndex !== -1) {
      taskIndex = todo.value.findIndex((t) => t.id === Number(taskUpdated.id))
      console.log(taskIndex, 'task index in todo')
      if (taskIndex !== -1) { 
        console.log(taskIndex, 'splice todo')
        todo.value.splice(taskIndex, 1)
        return
      } else {
        console.log(taskIndex, 'task index in progress')
        taskIndex = progress.value.findIndex((t) => t.id === Number(taskUpdated.id))
        if (taskIndex !== -1) { 
        console.log(taskIndex, 'splice completed')
        progress.value.splice(taskIndex, 1)
        return
      } else {
        return
      } }
  } else  {
    console.log(taskUpdated, 'we here ')
    completed.value.push(taskUpdated)
    taskIndex = todo.value.findIndex((t) => t.id === Number(taskUpdated.id))
    console.log(taskIndex, 'task index in here ')
    if (taskIndex !== -1) { 
        todo.value.splice(taskIndex, 1)
        return
      } else {
        taskIndex = progress.value.findIndex((t) => t.id === Number(taskUpdated.id))
        progress.value.splice(taskIndex, 1)
        console.log(progress.value)
        return
      }
  }
    }
  //   const index = tasks.value.findIndex((t) => t.id === Number(taskId))
  //  if (index !== -1) {
  //   tasks.value.splice(index, 1)
  // }

    // ПРОВЕРИТЬ ЕСТЬ ЛИ ЭЛЕМЕНТ, ЕСЛИ НЕТ ДОБАВИТЬ, А СТАРЫЙ УДАЛИТЬ 
    // ЧТОБЫ УДАЛИТЬ СТАРЫЙ НУЖНО ЕГО ПОИСКАТЬ В ДВУХ ОСТАВШИХСЯ МАССИВАХ


  });

})

async function checkMove(evt){
  console.log(Number(evt.to.id))
const taskId = evt.item._underlying_vm_.id
const status = Number(evt.to.id)



//return false
  // RETURN FALSE TO CANCEL

   try {
    const token = document.cookie.match('token=([^;]+)');

    const requestOptions = {
      method: "PUT",
      headers: { 'Content-Type': 'application/json', 'Authorization': `${token[1]}` },
      body: JSON.stringify({ taskId, status})
    };
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/tasks`, requestOptions);
    if (response.ok) {
      console.log('ok');
    } else {
      console.log('occured error on server side')
    }
  } catch (error) {
    console.error(error);
    
  }
}

function taskToggle() {
    isTasksToggled.value = !isTasksToggled.value;
    data.isMessage.value = false;
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
    var jsonResponse = null
    const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/tasks`, requestOptions)
    console.log(response, 'response')
   var jsonResponse = await response.json()
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
       data.isMessage.value = true
    data.isError.value = true
    data.message.value = `Failed to add task`
      console.log(response, 'response')
      return
    }
    data.isMessage.value = true
    data.isError.value = false
    data.message.value = `Task ${task.title.value} successfully created`
    clearValues()
    
  } catch (error) {
    console.log('123123')
    console.log('123123')
    router.push('/auth');
    console.error(error);
  }
}

watch(task, (newValue, oldValue) => {
  console.log('Count changed:', newValue, 'Old value:', oldValue);
});



function clearValues() {
  task.title.value = '';
  task.description.value = '';
  task.dueDate.value = '';
  task.assigneeName.value = '';
  // task.value = {
  //   title: '',
  //   description: '',
  //   dueData: '',
  //   assigneeName: '',
  // }
  console.log(task.value, 'task value')
}

</script>

<style>
.controls {
    
        margin: 1em 0px 1em 0px;
}
.task {
     user-select: none;
    cursor: pointer;
    width: 100%;
}

.column-title {
    margin: 0;
     border-bottom: 1px solid #383977;;
    padding: 10px 0px 10px 0px;
    font-weight: 200;
}
#column {
     border: 1px solid #383977;;
}

.task.selected {
  background-color: #aaaaaa23;
}

.task-wrapper {
  padding: 7px 10px 7px 10px;
  flex-grow: 1;
  text-align: left;
}

li#task {
  border: none;
  overflow: unset;
  margin: 0;
}

.tasks {
  margin: 0;
  height: 100%;
}
</style>