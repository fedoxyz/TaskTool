import { createRouter, createWebHistory } from 'vue-router'
import TheWelcomeView from '@/views/TheWelcomeView.vue'
import TodoView from '@/views/TodoView.vue'
import AuthorizationView from '@/views/AuthorizationView.vue'

const routes = [
  { path: '/', component: TheWelcomeView },
  { path: '/todo-app', component: TodoView },
  { path: '/auth', component: AuthorizationView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
