<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="gkcjDialog" :close-on-click-modal="false" :append-to-body="true" width="580px" top="20vh" @close="handleClose" @open="openDialog">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="科目名称" prop="km">
          <el-input v-model="form.km" placeholder="科目名称" clearable />
        </el-form-item>
        <el-form-item label="学分" prop="xf">
          <el-input v-model.number="form.xf" type="number" placeholder="学分" clearable />
        </el-form-item>
        <el-form-item label="成绩" prop="cj">
          <el-input v-model="form.cj" placeholder="成绩" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

const form = {
  km: "", //科目名称
  xf: "", //学分
	cj: "" //成绩
};
export default {
  directives: { elDragDialog, waves },
  props: ["gkcjDialog", "gkcjitem", "index"],
  data() {
    return {
      title: "添加各科成绩",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        km: [
          {
            required: true,
            message: "请填写科目名称！",
            trigger: "blur"
          }
        ],
        xf: [
          {
            required: true,
            message: "请填写学分！",
            trigger: "blur"
          }
        ],
        cj: [
          {
            required: true,
            message: "请填写成绩！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    openDialog() {
      if (this.gkcjitem) {
        this.title = "编辑各科成绩"
        this.form = JSON.parse(JSON.stringify(this.gkcjitem))
      } else {
        this.form = JSON.parse(JSON.stringify(form))
      }
    },

    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form));
          let i = JSON.parse(JSON.stringify(this.index));
          this.$emit("CB-gkcj", { data: data, index: i })
        }
      });
    },
    //清空数据
    clear() {
      this.title = "添加各科成绩";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-gkcj", false);
    }
  }
};
</script>
