import { createRouter, createWebHistory } from "vue-router";
import TheWelcomeView from "@/views/TheWelcomeView.vue";
import MainView from "@/views/MainView.vue";
import AuthorizationView from "@/views/AuthorizationView.vue";
import TaskboardView from "@/views/TaskboardView.vue";
import DashboardView from "@/views/DashboardView.vue";

const routes = [
  { path: "/", component: TheWelcomeView },
  { path: "/app", component: MainView },
  { path: "/auth", component: AuthorizationView },
  {
    path: "/taskboard/:id",
    component: TaskboardView,
    name: "Taskboard",
    props: true,
  },
  { path: "/dashboard", component: DashboardView, name: "Dashboard" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log("beforeEach");
  if (to.path == "/") {
    next();
  }

  const token = document.cookie.match("token=([^;]+)");

  console.log(token, "token before each");
  if (to.path == "/auth") {
    if (token) {
      if (token[1]) {
        console.log("to path is auth is token is present");
      } else {
        next();
      }
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token[1]}`,
          },
        };
        console.log("after fetch");
        const response = await fetch(
          `${import.meta.env.VITE_API_HOST}:${
            import.meta.env.VITE_API_PORT
          }/api/verify`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Token verification failed");
        }
        next("/app");
        return;
      } catch (error) {
        console.log(error, "when fetching token verification");
        next();
      }
    } else {
      next();
    }
  } else {
    console.log("else than /auth");
    if (token) {
      console.log("token cookies are present");
      try {
        if (token[1]) {
          console.log(token[1], "token is present");
        } else {
          next("/auth");
        }

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token[1]}`,
          },
        };
        console.log("erere3");
        const response = await fetch(
          `${import.meta.env.VITE_API_HOST}:${
            import.meta.env.VITE_API_PORT
          }/api/verify`,
          requestOptions
        );
        if (!response.ok) {
          next("/auth");
          throw new Error("Token verification failed");
        }
        next();
      } catch (error) {
        console.log("when fetching token verification, try removing cookies");
        // remove cookies and redirect to auth
        document.cookie = "token" + "=;";
        next("/auth");
      }
    } else {
      next("/auth");
    }
  }
});

export default router;
