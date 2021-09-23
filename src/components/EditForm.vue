<template>
  <div>
    <v-card max-width="800" class="mr-auto my-10 pa-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :counter="25"
          :rules="nameRules"
          label="Project name*"
          required
          class="mb-2"
        ></v-text-field>

        <v-select
          dense
          v-model="sourceLanguage"
          :items="languages"
          :rules="[(v) => !!v || 'Item is required']"
          item-text="name"
          item-value="abbr"
          label="Source language*"
          required
          class="mb-2"
        ></v-select>

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
        <v-text-field
          label="Due Date"
          readonly
          disabled
          v-model="dateDue"
        ></v-text-field>
        <v-text-field disabled v-model="status" label="Status"></v-text-field>

        <v-btn
          small
          :disabled="!valid"
          color="success"
          class="mr-4 mt-2"
          @click="edit"
        >
          Confirm changes
        </v-btn>
        <v-btn
          small
          :disabled="!valid"
          color="error"
          class="mr-4 mt-2"
          @click="dialog = true"
        >
          Delete project
        </v-btn>
      </v-form>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Delete </v-card-title>
        <v-card-text
          >Are you sure you want to proceed with this action?</v-card-text
        >
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
  props: ['id'],
  data() {
    return {
      project: null,
      valid: false,
      dialog: false,
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => (v && v.length <= 25) || 'Name must be less than 25 characters',
      ],
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
        'zu',
      ],
      status: null,
      statuses: ['NEW', 'COMPLETED', 'DELIVERED'],
      openDateMenu: false,
      dateDue: null,
      openTimeMenu: false,
      timeDue: null,
    }
  },

  computed: {
    languages() {
      let languages = []
      const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })
      this.languagesAbbr.forEach((abbr) => {
        let newLanguage = {
          name: languageNames.of(abbr),
          abbr: abbr,
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
    },
  },

  methods: {
    getProject() {
      ProjectServices.getProject(this.id)
        .then((response) => {
          this.project = response.data
          this.initValues()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    initValues() {
      this.id = this.project.id
      this.name = this.project.name
      this.sourceLanguage = this.project.sourceLanguage
      this.status = this.project.status
      this.targetLanguages = this.project.targetLanguages
      this.dateDue = moment(this.project.dateDue).format('LLL')
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
        dateDue: this.project.dateDue,
      }
      ProjectServices.putProject(this.id, newProject)
        .then(() => {
          this.getProject()
        })
        .catch((error) => console.log(error))
    },
    deleteProject() {
      //Deletes the project
      ProjectServices.deleteProject(this.id)
        .then(() => {
          this.dialog = false
          router.push({ name: 'project-list' })
        })
        .catch((error) => console.log(error))
    },
  },
  created() {
    this.getProject()
  },
}
</script>
