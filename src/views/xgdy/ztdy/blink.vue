<template>
  <el-dialog :visible="dialogBlink" :fullscreen="isphone()" title="问题预览" top="20vh" width="500px" @close="handleClose" @open="openDialog">
    <el-row :gutter="30" class="padding-left-20 padding-right-20 padding-bottom-20">
      <el-form label-width="110px" label-position="top" class="padding-right-10">
        <el-form-item :label="data.tm" prop="title">
          <span v-if="data.lx==1">
            <el-input :autosize="{ minRows: 4, maxRows: 8}" type="textarea" placeholder="请填写" />
          </span>
          <span v-if="data.lx==2">
            <el-radio v-for="(v,i) in data.options" v-model="radio" :key="i" :label="i" class="no-margin margin-bottom-10 " style="width:100%">{{ v.note }}</el-radio>
          </span>
          <span v-if="data.lx==3">
            <el-checkbox v-for="(v,i) in data.options" v-model="checkbox" :key="i" :label="i" class="no-margin margin-bottom-10 " style="width:100%">{{ v.note }}</el-checkbox>
          </span>
        </el-form-item>
      </el-form>
    </el-row>
  </el-dialog>
</template>
<script>
import { publicMixin } from "@/api/mixins";

export default {
  name: "XmlxDetail",
  mixins: [publicMixin],
  props: ["dialogBlink", "data"],
  data() {
    return {
      loading: false,
			radio: null,
			checkbox: []
    };
  },
  methods: {
    //打开
    openDialog() {
    },
    //关闭
    handleClose() {
      this.$emit("CB-blink", false);
    }
  }
};
</script>

