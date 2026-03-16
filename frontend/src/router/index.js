import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LearnView from '../views/LearnView.vue'
import PatternDetailView from '../views/PatternDetailView.vue'
import ReviewView from '../views/ReviewView.vue'
import StatsView from '../views/StatsView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/learn',
    name: 'Learn',
    component: LearnView,
  },
  {
    path: '/learn/:id',
    name: 'PatternDetail',
    component: PatternDetailView,
  },
  {
    path: '/review',
    name: 'Review',
    component: ReviewView,
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
