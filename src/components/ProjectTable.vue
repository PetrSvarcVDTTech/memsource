<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          small
          color="success"
          :to="{ name: 'project-create' }"
          class="mt-2"
        >
          <v-icon class="mr-2">mdi-plus-circle-outline</v-icon> New
          Project</v-btn
        >
      </v-card-title>
      <v-data-table :headers="headers" :items="projects" :search="search" dense>
        <template v-slot:item.dateDue="{ item }">
          <span :class="`${dateColor(item.dateDue)}--text`">{{
            modDate(item.dateDue)
          }}</span>
        </template>
        <template v-slot:item.dateCreated="{ item }">
          {{ modDate(item.dateCreated) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon @click="editProject(item.id)" color="primary" class="mr-2"
            >mdi-pencil-outline</v-icon
          >
          <v-icon @click="openDeleteDialog(item.id)" color="error" class="ml-2"
            >mdi-trash-can-outline</v-icon
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog.isOn" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Delete </v-card-title>
        <v-card-text
          >Are you sure you want to proceed with this action?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog.isOn = false"> Cancel </v-btn>
          <v-btn color="error" text @click="deleteProject(dialog.projectId)">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import router from '../router'
import ProjectServices from '../services/ProjectServices'

export default {
  props: ['projects'],
  data() {
    return {
      dialog: {
        isOn: false,
        projectId: null,
      },
      confirmed: false,
      search: '',
      headers: [
        { text: '#', value: 'id', filterable: false, sortable: true },
        { text: 'Name', value: 'name', filterable: true, sortable: true },
        { text: 'Status', value: 'status', filterable: true, sortable: true },
        { text: 'Due', value: 'dateDue', filterable: false, sortable: true },
        {
          text: 'Created',
          value: 'dateCreated',
          filterable: false,
          sortable: false,
        },
        { text: '', value: 'actions', sortable: false },
      ],
    }
  },
  methods: {
    modDate(date) {
      //Formats date to
      if (date) {
        return moment(date).format('LLL')
      } else return ''
    },
    dateColor(date) {
      //Date of the overdue project is highlighted by red color
      let color = ''
      if (moment(date).format() < moment().format()) {
        color = 'red'
      }
      return color
    },
    editProject(id) {
      //Opens edit page for the project
      router.push({ name: 'project-show', params: { id: id } })
    },
    openDeleteDialog(id) {
      //Opens delete confirmation dialog and sets the id of the project to be deleted
      this.dialog.isOn = true
      this.dialog.projectId = id
    },

    deleteProject(id) {
      //Deletes the project and emits 'refresh' event to the parent component
      ProjectServices.deleteProject(id)
        .then(() => {
          this.dialog.isOn = false
          this.dialog.projectId = null
          this.$emit('refreshPage')
        })
        .catch((error) => console.log(error))
    },
  },
}
</script>

<style></style>
