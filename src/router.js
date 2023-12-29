import { createWebHistory, createRouter } from "vue-router";
import Home from "/src/components/screens/Home.vue";
import Sandbox from '/src/components/screens/Sandbox.vue'

const routes = [
  
  {
    path: "/",
    component: Sandbox,
  },
  
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
