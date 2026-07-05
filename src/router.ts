import { createRouter, createWebHistory } from 'vue-router';
import GeneratorPage from './pages/GeneratorPage.vue';
import VerifyPage from './pages/VerifyPage.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: GeneratorPage },
    { path: '/verify', component: VerifyPage },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});
