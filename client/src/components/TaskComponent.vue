<template>
  <div class='container'>
    <div>Title:
    <h2 v-if="isNotEdited">{{selectedTask.value.title}}</h2>
    <input v-else v-model='updatedTask.title'/>
    </div>
    
    <div>Description: 
    <p v-if="isNotEdited">{{selectedTask.value.description}} </p>
     <input v-else v-model='updatedTask.description'/>
    </div>

 <div>Assigned to: 
    <p v-if="isNotEdited" >{{selectedTask.value.assignee_name}} </p>
     <input v-else v-model='updatedTask.assigneeName'/>
    </div>
  

    <div><button v-if="isNotEdited" @click="switchEdit()" class='main'>Edit</button>
    <button v-else @click="updateTask()" class="main">Save</button>
    </div>
      
  </div>
</template>

<script setup>
import {reactive, defineProps, ref, watch} from 'vue'




const props = defineProps({
  selectedTask: Object,
})

const updatedTask = reactive({
  title: String,
  description: String,
  assigneeName: String
})

const isTaskReset = ref(false)
const isNotEdited = ref(true)

// ЕСЛИ ВЫБИРАЕТСЯ НОВЫЙ ТАСК, ПОМЕНЯТЬ SHOW TASK НА TRUE И ПЕРЕДАТЬ SHOW TASK В РЕБЕНКА

// ЧАЙЛДУ ОТПРАВЛЯЕТСЯ SHOWTASK, ПРИ ЕГО ИЗМЕНЕНИИ НУЖНО 

watch(props.selectedTask, async () => {
  isNotEdited.value = true
})

function switchEdit() {
  console.log(isTaskReset.value, 'reset task')
  //  if (isTaskReset.value) {
  //   isNotEdited.value = true
  //   return
  //  }
  console.log(props.selectedTask.value.id, 'selectedTask')
  if (!props.selectedTask.value.id ) {
    console.log('select task first')
    return
  }

  console.log(isNotEdited.value, 'isNotEdited value')
  if (isNotEdited.value) {
    updatedTask.title =  props.selectedTask.value.title
    updatedTask.description =  props.selectedTask.value.description
    updatedTask.assigneeName =  props.selectedTask.value.assignee_name
    isTaskReset.value = false;
    console.log(updatedTask.title, 'updatedTask')
  }
  console.log('we get here')
  isNotEdited.value = !isNotEdited.value;
}

async function updateTask() {
  const token = document.cookie.match('token=([^;]+)');
  try {
   const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Authorization': `${token[1]}` },
      body: JSON.stringify({ taskId: props.selectedTask.value.id, title: updatedTask.title, description: updatedTask.description, assignee_name: updatedTask.assigneeName })
      }
      console.log(requestOptions, 'requestOptions')
      const response = await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/update-task`, requestOptions);

       if (response.ok) {
     switchEdit()
    } else {
      console.log('error occured when updating task')
    }
  } catch (error) {
    console.log('')
    console.error(error);
  }
      

}

</script>

on

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