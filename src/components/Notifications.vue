<template>
  <div class="notification-container">
    <v-card v-for="notification in notifications" :key="notification.id" width="200" class="mb-2 pa-4" :color="notification.type" dark>
      {{ notification.message }}
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['notifications'])
  },
  methods: {
    ...mapActions(['remove'])
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 0;
  right: 0;
  padding-right: 40px;
}
</style>
