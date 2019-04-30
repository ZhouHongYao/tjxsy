<template>
  <el-select v-model="value.status" placeholder="不限审核状态" style="width: 180px;" class="filter-item" clearable>
    <el-option v-for="item in reviewData" :key="item.id" :label="item.title" :value="item.id" />
  </el-select>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: ["value"],
  computed: mapState({
    reviewData: state => state.reviewData
  })
};
</script>

