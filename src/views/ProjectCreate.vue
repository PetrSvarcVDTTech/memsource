<template>
  <div>
    <TitleDateTime title="Create New Project" />
    <CreateForm />
  </div>
</template>

<script>
import TitleDateTime from '@/components/TitleDateTime.vue'
import CreateForm from '@/components/CreateEditForm.vue'

export default {
  components: {
    TitleDateTime,
    CreateForm
  }
}
</script>

<style></style>
