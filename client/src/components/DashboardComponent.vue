<template>
  <div class="container">
    <h1>Dashboard</h1>
    <h2>My Taskboards</h2>
    <ul>
    <div @click='showTasks(taskboard.dataValues.id)' v-for="taskboard in taskboardsCreated" class='mytaskboard-wrapper'>
      <li id="dashboard">
        {{ taskboard.dataValues.name }} {{ taskboard.dataValues.updatedAt }} 

        All: {{taskboard.tasks.length}}
        Todo: {{taskboard.tasks.filter(task => task.status === 0).length}}
        In Progress: {{taskboard.tasks.filter(task => task.status === 1).length}}
        
      </li>
      <ul v-if="tasksDrop.includes(taskboard.dataValues.id )">
      <li v-for="task in taskboard.tasks">
        {{task.title}}  {{ task.status }}  {{task.updatedAt}}
        </li>
        </ul>
      </div>
    </ul>

    <h2>Tasks</h2>
    <h4>Created:</h4>
    <ul>
      <li id="dashboard" v-for="task in tasksCreated">
        {{ task.title }} {{ task.status }} {{ task.updatedAt }}
      </li>
    </ul>
    <h4>Assigned to:</h4>
    <ul>
      <li id="dashboard" v-for="task in tasksAssigned">
        {{ task.title }} {{ task.status }} {{ task.updatedAt }}
      </li>
    </ul>

    <router-link to="/app">
      <button class="main" style="margin: 23px; width: 24%">Back</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const taskboardsCreated = ref([]);
const tasksCreated = ref([]);
const tasksAssigned = ref([]);

const tasksDrop = ref([])

async function fetchOverview() {
  try {
    const token = document.cookie.match("token=([^;]+)");

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token[1]}`,
      },
    };
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST}:${
        import.meta.env.VITE_API_PORT
      }/api/overview`,
      requestOptions
    );
    if (response.ok) {
      const jsonResponse = await response.json();
      taskboardsCreated.value = jsonResponse.taskboardsCreated;
      tasksCreated.value = jsonResponse.tasksCreated;
      tasksAssigned.value = jsonResponse.tasksAssigned;
      console.log(
        taskboardsCreated.value,
        tasksCreated.value,
        tasksAssigned.value
      );
    } else {
      router.push("/auth");
    }
  } catch (error) {
    console.error(error);
  }
}

function showTasks(taskboardId) {
  if (tasksDrop.value.includes(taskboardId)) {
    tasksDrop.value = tasksDrop.value.filter(id => id !== Number(taskboardId));
  } else {
tasksDrop.value.push(taskboardId)
  }
    

}

onMounted(async () => {
  await fetchOverview();
  console.log(taskboardsCreated.value, 'taskboards created')
});
</script>

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

li#dashboard {
  padding: 10px;
}
</style>
