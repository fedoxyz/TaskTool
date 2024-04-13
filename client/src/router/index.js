import { createRouter, createWebHistory } from 'vue-router'
import TheWelcomeView from '@/views/TheWelcomeView.vue'
import MainView from '@/views/MainView.vue'
import AuthorizationView from '@/views/AuthorizationView.vue'


const routes = [
  { path: '/', component: TheWelcomeView },
  { path: '/app', component: MainView },
  { path: '/auth', component: AuthorizationView }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  console.log('beforeEach')
  if (to.path == '/') {
    next();
  }
  const token = document.cookie.match('token=([^;]+)');
  console.log(token, 'token before each')
  if (to.path == '/auth') {
    if (token) {
      console.log('to path is auth is token is present')
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
      'Authorization': `${token[1]}`
      }
      };
      await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/verify`, requestOptions);
      next('/app');
      
    } catch (error) {
      console.log(error, 'when fetching token verification')
    }
  } else {
    next()
  } 
  
  } else {
    if (token) {
    try {
      console.log('else than /auth')
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
      'Authorization': `${token[1]}`
      }
      };
      await fetch(`${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/verify`, requestOptions);
      next();
      
    } catch (error) {
      console.log(error, 'when fetching token verification, clear cookies')
    }
    } else {
      next('/auth')
    }
  }
});

export default router
