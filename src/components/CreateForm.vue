<template>
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
      <v-row
        ><v-col>
          <v-menu
            v-model="openDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Due Date"
                readonly
                :value="pickedDate"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="en-in"
              v-model="dateDue"
              @input="openDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu
            v-model="openTimeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Due Time"
                readonly
                :value="pickedTime"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              ref="timepicker"
              locale="en-in"
              v-model="timeDue"
              @click:minute="openTimeMenu = false"
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-select
        dense
        v-model="status"
        :items="statuses"
        label="Status"
      ></v-select>

      <v-btn
        small
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="create"
      >
        Create
      </v-btn>

      <v-btn small color="error" class="mr-4" @click="reset">Clear</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import moment from 'moment'
import router from '../router'
import ProjectServices from '../services/ProjectServices'

export default {
  data() {
    return {
      valid: false,
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
      const dueDateTime = moment(this.dateDue + 'T' + this.timeDue).utc()
      const newProject = {
        name: this.name,
        sourceLanguage: this.sourceLanguage,
        status: this.status,
        targetLanguages: this.targetLanguages,
        dateCreated: currentTime,
        dateUpdated: currentTime,
        dateDue: dueDateTime,
      }
      ProjectServices.postProject(newProject)
        .then(() => {
          router.push({ name: 'project-list' })
        })
        .catch((error) => console.log(error))
    },
  },
}
</script>
