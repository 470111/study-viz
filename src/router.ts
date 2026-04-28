import { createRouter, createWebHashHistory } from 'vue-router'

import HomeMap from './pages/HomeMap.vue'
import MathPage from './pages/MathPage.vue'
import Cs408Page from './pages/Cs408Page.vue'
import EnglishPage from './pages/EnglishPage.vue'
import CustomPage from './pages/CustomPage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeMap },
    { path: '/math', component: MathPage },
    { path: '/cs408', component: Cs408Page },
    { path: '/english', component: EnglishPage },
    { path: '/custom', component: CustomPage },
  ],
})

