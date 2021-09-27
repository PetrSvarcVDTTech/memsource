<template>
  <div>
    <!-- create/edit form v-card wrapper -->
    <v-card max-width="800" class="mr-auto my-10 pa-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- name of the project -->
        <v-text-field v-model="name" :counter="25" :rules="nameRules" label="Project name*" required class="mb-2"></v-text-field>
        <!-- source language -->
        <v-select dense v-model="sourceLanguage" :items="languages" :rules="[(v) => !!v || 'Item is required']" item-text="name" item-value="abbr" label="Source language*" required class="mb-2"></v-select>
        <!-- target languages -->
        <v-select
          dense
          v-model="targetLanguages"
          :items="languages"
          :rules="[(v) => !!v || 'Item is required']"
          item-text="name"
          item-value="abbr"
          label="Target languages*"
          multiple
          chips
          hint="You can choose multiple"
          persistent-hint
          class="mb-2"
        ></v-select>
        <!-- due date and time -->
        <v-row
          ><v-col>
            <v-menu v-model="openDateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y max-width="290px" min-width="290px" :disabled="Boolean(id)">
              <template v-slot:activator="{ on }">
                <v-text-field label="Due Date" readonly :value="pickedDate" v-on="on" :disabled="Boolean(id)"></v-text-field>
              </template>
              <v-date-picker locale="en-in" v-model="dateDue" @input="openDateMenu = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu v-model="openTimeMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y max-width="290px" min-width="290px" :disabled="Boolean(id)">
              <template v-slot:activator="{ on }">
                <v-text-field label="Due Time" readonly :value="pickedTime" v-on="on" :disabled="Boolean(id)"></v-text-field>
              </template>
              <v-time-picker ref="timepicker" locale="en-in" v-model="timeDue" @click:minute="openTimeMenu = false"></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <!-- project status -->
        <v-select dense v-model="status" :items="statuses" label="Status" :disabled="Boolean(id)"></v-select>
        <!-- actions -->
        <v-btn small :disabled="!valid" color="success" class="mr-4 mt-2" @click="create" v-if="!id">
          {{ confirmButton }}
        </v-btn>
        <v-btn small :disabled="!valid" color="success" class="mr-4 mt-2" @click="edit" v-else>
          {{ confirmButton }}
        </v-btn>
        <v-btn small color="error" class="mr-4 mt-2" @click="reset" v-if="!id">Clear</v-btn>
        <v-btn small :disabled="!valid" color="error" class="mr-4 mt-2" @click="dialog = true" v-else> Delete project </v-btn>
      </v-form>
    </v-card>
    <!-- delete confirmation dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Delete </v-card-title>
        <v-card-text>Are you sure you want to proceed with this action?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false"> Cancel </v-btn>
          <v-btn color="error" text @click="deleteProject()"> Delete </v-btn>
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
  props: {
    id: {
      default: null
    }
  },
  data() {
    return {
      valid: false,
      dialog: false,

      //Table variables
      name: '',
      nameRules: [(v) => !!v || 'Name is required', (v) => (v && v.length <= 25) || 'Name must be less than 25 characters'],
      sourceLanguage: null,
      targetLanguages: null,
      languagesAbbr: [
        'af',
        'sq',
        'ar-SA',
        'ar-IQ',
        'ar-EG',
        'ar-LY',
        'ar-DZ',
        'ar-MA',
        'ar-TN',
        'ar-OM',
        'ar-YE',
        'ar-SY',
        'ar-JO',
        'ar-LB',
        'ar-KW',
        'ar-AE',
        'ar-BH',
        'ar-QA',
        'eu',
        'bg',
        'be',
        'ca',
        'zh-TW',
        'zh-CN',
        'zh-HK',
        'zh-SG',
        'hr',
        'cs',
        'da',
        'nl',
        'nl-BE',
        'en',
        'en-US',
        'en-EG',
        'en-AU',
        'en-GB',
        'en-CA',
        'en-NZ',
        'en-IE',
        'en-ZA',
        'en-JM',
        'en-BZ',
        'en-TT',
        'et',
        'fo',
        'fa',
        'fi',
        'fr',
        'fr-BE',
        'fr-CA',
        'fr-CH',
        'fr-LU',
        'gd',
        'gd-IE',
        'de',
        'de-CH',
        'de-AT',
        'de-LU',
        'de-LI',
        'el',
        'he',
        'hi',
        'hu',
        'is',
        'id',
        'it',
        'it-CH',
        'ja',
        'ko',
        'la',
        'lv',
        'lt',
        'mk',
        'mt',
        'no',
        'pl',
        'pt-BR',
        'pt',
        'rm',
        'ro',
        'ro-MO',
        'ru',
        'ru-MI',
        'sz',
        'sr',
        'sk',
        'sl',
        'sb',
        'es',
        'es-AR',
        'es-GT',
        'es-CR',
        'es-PA',
        'es-DO',
        'es-MX',
        'es-VE',
        'es-CO',
        'es-PE',
        'es-EC',
        'es-CL',
        'es-UY',
        'es-PY',
        'es-BO',
        'es-SV',
        'es-HN',
        'es-NI',
        'es-PR',
        'sx',
        'sv',
        'sv-FI',
        'th',
        'ts',
        'tn',
        'tr',
        'uk',
        'ur',
        've',
        'vi',
        'xh',
        'ji',
        'zu'
      ], //list of languages (abbr)
      status: null,
      statuses: ['NEW', 'COMPLETED', 'DELIVERED'],
      openDateMenu: false,
      dateDue: null,
      openTimeMenu: false,
      timeDue: null
      /////////////////////////////////////
    }
  },

  computed: {
    confirmButton() {
      return this.id ? 'Confirm changes' : 'Create'
    },
    languages() {
      let languages = []
      const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })
      this.languagesAbbr.forEach((abbr) => {
        let newLanguage = {
          name: languageNames.of(abbr),
          abbr: abbr
        }
        languages.push(newLanguage)
      })
      return languages
    },

    pickedDate() {
      return this.dateDue
    },
    pickedTime() {
      return this.timeDue
    }
  },

  methods: {
    //Create project methods
    create() {
      this.valid = this.$refs.form.validate()
      if (this.valid) {
        this.createNewProject()
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    createNewProject() {
      const currentTime = moment.utc()
      if (!this.timeDue) {
        this.timeDue = '00:00'
      }
      const dueDateTime = moment(this.dateDue + 'T' + this.timeDue).utc()
      const newProject = {
        name: this.name,
        sourceLanguage: this.sourceLanguage,
        status: this.status,
        targetLanguages: this.targetLanguages,
        dateCreated: currentTime,
        dateUpdated: currentTime,
        dateDue: dueDateTime
      }
      ProjectServices.postProject(newProject)
        .then(() => {
          const notification = {
            type: 'success',
            message: 'Project created succefully!'
          }
          this.$store.dispatch('add', notification)
          router.push({ name: 'project-list' })
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: `Error: ${error.message}`
          }
          this.$store.dispatch('add', notification)
        })
    },
    ////////////////////////////////////////////////////////////////

    //Edit project methods
    getProject() {
      ProjectServices.getProject(this.id)
        .then((response) => {
          this.project = response.data
          this.initValues()
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: `Error: ${error.message}`
          }
          this.$store.dispatch('add', notification)
          router.push({ name: 'project-list' })
        })
    },

    initValues() {
      //Set init values for the form
      this.name = this.project.name
      this.sourceLanguage = this.project.sourceLanguage
      this.status = this.project.status
      this.targetLanguages = this.project.targetLanguages
      this.dateDue = moment(this.project.dateDue).format('ll')
      this.timeDue = moment(this.project.dateDue).format('LT')
    },

    edit() {
      this.valid = this.$refs.form.validate()
      if (this.valid) {
        this.editProject()
      }
    },
    editProject() {
      const currentTime = moment.utc()
      const newProject = {
        id: this.id,
        name: this.name,
        sourceLanguage: this.sourceLanguage,
        status: this.status,
        targetLanguages: this.targetLanguages,
        dateCreated: this.project.dateCreated,
        dateUpdated: currentTime,
        dateDue: this.project.dateDue
      }
      ProjectServices.putProject(this.id, newProject)
        .then(() => {
          const notification = {
            type: 'success',
            message: 'Project was edited succefully!'
          }
          this.$store.dispatch('add', notification)
          this.getProject()
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: `Error: ${error.message}`
          }
          this.$store.dispatch('add', notification)
        })
    },
    deleteProject() {
      //Deletes the project
      ProjectServices.deleteProject(this.id)
        .then(() => {
          this.dialog = false
          const notification = {
            type: 'success',
            message: 'Project deleted succefully!'
          }
          this.$store.dispatch('add', notification)
          router.push({ name: 'project-list' })
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: `Error: ${error.message}`
          }
          this.$store.dispatch('add', notification)
        })
    }
    //////////////////////////////////////////////
  },
  created() {
    if (this.id) {
      this.getProject()
    }
  }
}
</script>
