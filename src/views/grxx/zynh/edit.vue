<template>
  <div v-loading="listLoading" element-loading-text="数据载入中">
    <sticky :z-index="10" class-name="sub-navbar">
      <el-button-group>
        <el-button v-loading="loading" v-waves type="primary" icon="el-icon-success" @click="save">
          提交
        </el-button>
      </el-button-group>
      <goBack style="margin-left: 10px;" />
    </sticky>
    <div class="app-container margin-top-20">
      <el-form ref="form" :model="form" :rules="rules" label-suffix="：" label-width="100px">
        <el-form-item label="主题" prop="title" class="form_item">
          <el-input v-model="form.title" autosize placeholder="请填写主题" clearable />
        </el-form-item>
        <el-form-item label="关键词" prop="gjc" class="form_item">
          <el-tag v-for="tag in form.gjc" :key="tag" :disable-transitions="false" closable @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input v-if="inputVisible" ref="saveTagInput" v-model="inputValue" class="input-new-tag" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 关键词</el-button>
        </el-form-item>
        <el-form-item label="正文" prop="content" class="form_item">
          <el-input v-model="form.content" :autosize="{ minRows: 10, maxRows: 18 }" type="textarea" maxlength="800" placeholder="请填写正文" />
          还可填写
          <span class="text-danger">{{ 800 - form.content.length }}</span> 个字符
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky"; // 粘性header组件
import goBack from "@/components/goBack";
import { zynhEdit, zynhRead } from "@/api/grxx/zynh";
import { publicMixin } from "@/api/mixins";

const form = {
  title: '',
  content: "",
  gjc: []
}

export default {
  directives: { waves },
  components: { goBack, Sticky },
  mixins: [publicMixin],
  data() {
    return {
      listLoading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      inputVisible: false,
      inputValue: '',
      rules: {}
    }
  },
  activated() {
    this.getRead();
  },
  deactivated() {
    this.form = JSON.parse(JSON.stringify(form))
  },
  methods: {
    handleClose(tag) {
      this.form.gjc.splice(this.form.gjc.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        if (this.form.gjc.indexOf(inputValue) != '-1') {
          this.$message({
            message: "您已添加过该关键词，请勿重复添加！",
            type: "warning"
          });
          return
        }
        this.form.gjc.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    //保存
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          zynhEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              this.backout()
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    //获取数据
    getRead() {
      this.listloading = true;
      let id = this.$route.query.id || 's'
      zynhRead(id)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px !important;
}
.input-new-tag {
  width: 90px !important;
  margin-left: 10px !important;
  vertical-align: bottom;
}
</style>

