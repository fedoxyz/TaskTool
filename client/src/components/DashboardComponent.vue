<template>
  <div class="container">
    <h1>Dashboard</h1>
    <h2>My Taskboards</h2>
    <ul>
      <li id="dashboard" v-for="taskboard in taskboardsCreated">
        {{ taskboard.name }} {{ taskboard.updatedAt }} 
        NEED TO SHOW MANY TASKS THERE ARE
        All:
        Todo:
        In Progress:
        <li v-for="task in taskboard.tasks">
        {{task.id}} {{task.title}}
        </li>
      </li>
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

onMounted(async () => {
  await fetchOverview();
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
