<template>
  <div>
    <TitleDateTime :title="'Edit project ' + id" />
    <EditForm :id="id" />
  </div>
</template>

<script>
import TitleDateTime from '@/components/TitleDateTime.vue'
import EditForm from '@/components/EditForm.vue'

export default {
  components: {
    TitleDateTime,
    EditForm,
  },
  props: ['id'],
}
</script>

<style></style>
