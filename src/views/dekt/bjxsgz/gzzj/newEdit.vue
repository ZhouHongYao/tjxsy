<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="5vh" @close="handleClose" @open="openDialog">
      <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
        <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
          <el-row>
            <el-col :span="24">
              <el-form-item label="学期" prop="xq" class="form_item">
                <el-select v-model="form.xq" placeholder="请选择学期" style="width:320px;">
                  <el-option v-for=" item in xqData" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="班级职务" class="form_item">
                <span v-if="currentRole()">{{ $store.state.user.userinfo.bjzw || '--' }}</span>
                <span v-else>{{ form.bjzw || '' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工作总结" prop="gzzj">
                <el-input :autosize="{ minRows: 10, maxRows: 14}" v-model="form.gzzj" type="textarea" maxlength="800" placeholder="请填写工作总结" />
                还可填写
                <span class="text-danger">{{ 800 - ( form.gzzj ? form.gzzj.length : 0 ) }}</span> 个字符
              </el-form-item>
            </el-col>
            <el-col v-if="form.bzrpy && currentRole()" :span="24">
              <el-form-item label="班主任评语">
                <div v-html="Trim(form.bzrpy)" />
              </el-form-item>
            </el-col>
            <el-col v-if="!currentRole()" :span="24">
              <el-form-item label="班主任评语" prop="bzrpy">
                <el-input :autosize="{ minRows: 6, maxRows: 14}" v-model="form.bzrpy" type="textarea" maxlength="500" placeholder="请填写班主任评语" />
                还可填写
                <span class="text-danger">{{ 500 - ( form.bzrpy ? form.bzrpy.length : 0 ) }}</span> 个字符
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { gzzjEdit, gzzjRead } from "@/api/dekt/bjxsgz/gzzj";
import { publicMixin } from "@/api/mixins";

const form = {
  xq: null, //学期
  gzzj: "", //工作总结
  bzrpy: "" //班主任评语
};
const xqData = [{ id: 1, value: '第一学期' }, { id: 2, value: '第二学期' }]
export default {
  directives: { elDragDialog, waves },
  mixins: [publicMixin],
  props: ["dialogState", "gzzjId"],
  data() {
    return {
      title: "添加工作总结",
      listloading: false,
      loading: false,
      xqData,
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        xq: [{
          required: true,
          message: "请选择学期！",
          trigger: "change"
        }],
        gzzj: [{
          required: true,
          message: "请填写工作总结！",
          trigger: "blur"
        }]
      }
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.9 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.gzzjId) {
        this.title = "编辑工作总结";
        this.getRead();
      }
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.gzzjId ? "put" : "post";
          this.loading = true;
          gzzjEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-gzzj", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    getRead() {
      this.listloading = true;
      gzzjRead(this.gzzjId)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //清空数据
    clear() {
      this.title = "添加工作总结";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-gzzj", false);
    }
  }
};
</script>
