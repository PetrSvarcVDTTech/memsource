<template>
  <div>
    <TitleDateTime title="Projects" />
    <v-sheet v-if="!projects.length" color="transparent" width="500" class="my-10 mx-auto">
      <v-progress-circular v-if="loading" :size="200" width="7" color="#435569" indeterminate></v-progress-circular>
      <v-btn v-else color="success" fab x-large dark :to="{ name: 'project-create' }">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-sheet>
    <ProjectDashBoard v-if="projects.length" :projects="projects" class="my-5" />
    <ProjectTable v-if="projects.length" :projects="projects" @refreshPage="refreshPage" />
  </div>
</template>

<script>
import ProjectServices from '../services/ProjectServices'
import TitleDateTime from '@/components/TitleDateTime.vue'
import ProjectTable from '@/components/ProjectTable.vue'
import ProjectDashBoard from '@/components/ProjectDashBoard.vue'

export default {
  components: {
    TitleDateTime,
    ProjectTable,
    ProjectDashBoard
  },
  data() {
    return {
      projects: [],
      loading: true
    }
  },
  methods: {
    getProjects() {
      ProjectServices.getProjects()
        .then((response) => {
          this.projects = response.data._embedded.projects
          this.loading = false
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: `There was an error getting the projects. Details: ${error.message}`
          }
          this.$store.dispatch('add', notification)
          this.loading = false
        })
    },
    refreshPage() {
      this.getProjects()
    }
  },

  created() {
    this.getProjects()
  }
}
</script>

<style></style>
