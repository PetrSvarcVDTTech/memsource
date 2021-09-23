<template>
  <v-app>
    <v-navigation-drawer permanent expand-on-hover app color="#435569" dark>
      <v-list-item>
        <v-list-item-content class="px-0">
          <v-list-item-title
            ><v-img
              src="./assets/memsource.svg"
              class="pa-0"
              min-height="24"
              min-width="24"
              max-height="72"
              max-width="72"
            ></v-img
          ></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense class="px-0 mt-0">
        <v-list-item
          link
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          exact
          class="mb-2"
        >
          <v-list-item-icon class="mx-2">
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="content">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      //Main navigation links to Views components
      links: [
        {
          text: 'Projects',
          name: 'project-list',
          icon: 'mdi-folder-outline',
        },
        {
          text: 'Create New Project',
          name: 'project-create',
          icon: 'mdi-folder-plus-outline',
        },
      ],
    }
  },
  computed: {},
}
</script>

<style>
html {
  overflow-y: auto !important;
}

.content {
  background-color: #f1f9ff !important;
}

.v-list-item--active {
  color: #53b6f9 !important;
}
</style>
