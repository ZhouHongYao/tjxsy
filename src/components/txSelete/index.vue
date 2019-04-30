<template>
  <el-select v-if="!currentRole()" v-model="value.tx" placeholder="检索：填写状态" style="width: 150px;" class="filter-item" clearable>
    <el-option v-for="item in txData" :key="item.id" :label="item.title" :value="item.id"/>
  </el-select>
</template>
<script>
import { publicMixin } from "@/api/mixins";

export default {
  mixins: [publicMixin],
  props: ["value"],
  data() {
    return {
      txData: [{
        id: '1',
        title: '已填写'
      }, {
        id: '2',
        title: '未填写'
      }]
    }
  }
};
</script>
