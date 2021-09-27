<template>
  <v-row class="my-5">
    <v-col>
      <div class="text-h3 font-weight-black title">
        {{ title }}
      </div></v-col
    >
    <v-spacer></v-spacer>
    <v-col class="hidden-sm-and-down">
      <div class="text-h3 font-weight-black text-md-right title">
        {{ currentTime }}
      </div>

      <v-spacer></v-spacer>
      <div class="text-h4 font-weight-light text-md-right text-capitalize title">
        {{ currentDay }}

        <span class="text-h4 font-weight-black text-md-right title">
          {{ currentDate }}
        </span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TitleTimeDate',
  props: ['title'],
  data: () => ({
    currentTime: null,
    currentDate: null,
    currentDay: null
  }),
  methods: {
    updateTime() {
      this.currentTime = moment().format('LTS')
    }
  },
  created() {
    this.currentTime = moment().format('LTS')
    this.currentDay = moment().format('dddd')
    this.currentDate = moment().format('LL')
    setInterval(() => this.updateTime(), 1 * 1000)
  }
}
</script>
<style scoped>
.title {
  color: #435569 !important;
}
</style>
