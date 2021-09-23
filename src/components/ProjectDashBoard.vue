<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="primary" dark min-height="150" class="pa-4">
          <v-card-title># of projects by the status</v-card-title>
          <v-card-text>
            <v-row v-for="status in projectByStatus" :key="status.status">
              <v-col
                class="text-h6 text-md-h6 text-lg-h5 font-weight-bold text-left"
                >{{ status.status }}</v-col
              >
              <v-spacer></v-spacer>
              <v-col
                class="
                  text-h6 text-md-h6 text-lg-h5
                  font-weight-bold
                  text-right
                "
                >{{ status.freq }} x</v-col
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="error" dark min-height="150" class="pa-4">
          <v-card-title># of overdue projects</v-card-title>
          <v-card-text>
            <div
              class="text-h4 text-md-h4 text-lg-h4 font-weight-black text-right"
            >
              {{ overDueProjects.length }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="warning" dark min-height="150" class="pa-4">
          <v-card-title>Most prominent source(s)</v-card-title>
          <v-card-text>
            <div
              v-for="lang in mostProminentLang"
              :key="lang"
              class="text-h5 text-md-h5 ext-h4 font-weight-bold text-right"
            >
              {{ lang }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['projects'],
  data() {
    return {}
  },
  computed: {
    projectByStatus() {
      //Returns status/freguency pairs
      const newList = []
      const statuses = this.projects.map((project) => project.status)
      const uniqueStatuses = [...new Set(statuses)]
      uniqueStatuses.forEach((status) => {
        let listItem = {
          status: status,
          freq: statuses.filter((s) => s == status).length,
        }
        newList.push(listItem)
      })
      return newList
    },
    overDueProjects() {
      //Returns overdue projects that are not status DELIVERED
      return this.projects.filter(
        (project) => moment(project.dateDue).format() < moment().format()
      )
    },
    mostProminentLang() {
      //Return most prominent languge/languages
      const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })
      let prominetLanguages = []
      const languages = this.projects.map((project) => project.sourceLanguage)

      const uniqueLanguages = [...new Set(languages)]
      prominetLanguages.push(uniqueLanguages[0])
      for (let i = 1; i < uniqueLanguages.length; i++) {
        if (
          languages.filter((lang) => lang == uniqueLanguages[i]).length >
          languages.filter((lang) => lang == prominetLanguages[0]).length
        ) {
          prominetLanguages = []
          prominetLanguages.push(uniqueLanguages[i])
        } else if (
          languages.filter((lang) => lang == uniqueLanguages[i]).length ==
          languages.filter((lang) => lang == prominetLanguages[0]).length
        ) {
          prominetLanguages.push(uniqueLanguages[i])
        }
      }

      return prominetLanguages.map((lang) => languageNames.of(lang))
    },
  },
}
</script>

<style></style>
