<template>
  <component :is="currentRole" />
</template>

<script>
import { mapGetters } from "vuex";
import admin from "./index";
import student from "./detail";

export default {
  name: "zynh",
  components: { admin, student },
  data() {
    return {
      currentRole: ""
    };
  },
  computed: {
    ...mapGetters(["group"])
  },
  created() {
    this.currentRole = this.group ? this.group == 3 ? "student" : "admin" : '';
  }
};
</script>
