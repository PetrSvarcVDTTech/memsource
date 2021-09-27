import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectList from '../views/ProjectList.vue'
import ProjectCreate from '../views/ProjectCreate.vue'
import ProjectShow from '../views/ProjectShow.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'project-list',
    component: ProjectList
  },
  {
    path: '/project/create',
    name: 'project-create',
    component: ProjectCreate
  },
  {
    path: '/project/:id',
    name: 'project-show',
    component: ProjectShow,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
