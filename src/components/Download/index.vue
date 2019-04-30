<template>
  <span>
    <el-button v-waves class="filter-item margin-right-10" type="primary" icon="el-icon-download" @click="downloadDialog=true">{{ caption ? caption : '导出' }}</el-button>
    <el-dialog :visible="downloadDialog" :title="caption? caption : '数据导出'" width="480px" top="30vh" @close="handleClose" @open="openDialog">
      <div v-loading="loading" class="padding-20 box" element-loading-text="文件生成中，请稍等…">
        <div v-if="loadUrl">
          <p class="text-center font-120 success margin-top-10">数据生成成功！请点击下面的链接下载文件 </p>
          <div class="text-center margin-top-20">
            <a v-waves :href="loadUrl" class="bton" icon="el-icon-circle-plus-outligeng" plain type="primary" size="medium">
              <i class="el-icon-download" /> 下载文件
            </a>
          </div>
        </div>
        <p v-else class="text-center font-120 margin-top-10">{{ title }}</p>
      </div>
    </el-dialog>
  </span>
</template>
<script>
import { download } from "@/api/downloadImport";
import waves from "@/directive/waves"; // 水波纹指令
const data = [
  { name: "jbxx", id: "1" },
  { name: "xsgbll", id: "2" },
  { name: "xsgb", id: "3" },
  { name: "ggpyxx", id: "4" },
  { name: "gzzj", id: "5" },
  { name: "hdzz", id: "6" },
  { name: "cxhd", id: "7" },
  { name: "xywh", id: "7" },
  { name: "shsj", id: "7" },
  { name: "zyfw", id: "7" },
  { name: "lxxnjz", id: "7" },
	{ name: "bykt", id: "7" },
  { name: "ltjzxx", id: "7" },
  { name: "ldxxdj", id: "8" },
  { name: "qmpxb", id: "9" },
  { name: "xyzp", id: "10" },
  { name: "jszz", id: "11" },
  { name: "zwcz", id: "12" },
  { name: "fwjt", id: "13" },
  { name: "fwjx", id: "14" },
  { name: "gegj", id: "15" },
  { name: "xycjfx", id: "16" },
  { name: "kcxm", id: "17" },
  { name: "xkjs", id: "18" },
  { name: "gjjlxx", id: "19" },
  { name: "jssq", id: "20" }
];

export default {
  directives: { waves },
  props: ["value", "caption", "importUrl"],
  data() {
    return {
      loading: false,
      downloadDialog: false,
      loadUrl: "",
      data,
      title: ""
    };
  },
  methods: {
    //打开
    openDialog() {
      let item = data.find(v => {
        return v.name == this.$route.name;
      });
      if (item) {
        this.loading = true;
        let params = JSON.parse(JSON.stringify(this.value));
        params.export_id = item.id
        download(params)
          .then(rs => {
            this.loadUrl = rs;
            this.loading = false;
          })
          .catch(() => {
            this.title = "数据生成失败！";
            this.loading = false;
          });
      } else {
        this.title = "数据生成失败!";
      }
    },
    //关闭
    handleClose() {
      this.downloadDialog = false;
      this.clear();
    },
    clear() {
      this.title = "";
      this.loadUrl = "";
    }
  }
};
</script>
<style>
.bton {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  font-weight: 500;
  outline: 0 !important;
  font-family: inherit;
  text-transform: none;
}
.box {
  min-height: 150px;
}
</style>
