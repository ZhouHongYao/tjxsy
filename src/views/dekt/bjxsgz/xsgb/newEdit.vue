<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="15vh" @close="handleClose" @open="openDialog">
      <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
        <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
          <el-row>
            <el-col :span="24">
              <el-form-item label="班级职务" prop="srzw" class="form_item">
                <el-input v-model="form.srzw" autosize placeholder="请填写班级职务" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="培养学校所在小组" prop="szzb" class="form_item" label-width="140px">
                <el-select v-model="form.szzb" placeholder="请选择培养学校所在小组" style="width:100%">
                  <el-option v-for="item in zbData" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组长" prop="is_zz" class="form_item">
                <el-radio-group v-model="form.is_zz">
                  <el-radio :label="2">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注信息" prop="beizhu">
                <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.beizhu" type="textarea" maxlength="300" placeholder="备注信息，非必填项" />
                还可填写
                <span class="text-danger">{{ 300 - (form.beizhu ? form.beizhu.length : 0) }}</span> 个字符
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
import { xsgbEdit, xsgbRead } from "@/api/dekt/bjxsgz/xsgb";
import { cateChild } from "@/api/system/category";
import { publicMixin } from "@/api/mixins";

const form = {
  srzw: "", //所任职务
  szzb: "", //培养学校所在小组
  is_zz: 1, //是否组长
  beizhu: ""
};
export default {
  directives: { elDragDialog, waves },
  mixins: [publicMixin],
  props: ["dialogState", "xsgbId"],
  data() {
    return {
      title: "添加学生干部信息",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      zbData: [],
      rules: {}
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.xsgbId) {
        this.title = "编辑学生干部信息";
        this.getRead();
      }
      this.getZb()
    },
    //培训对象
    getZb() {
      cateChild(11)
        .then(rs => {
          this.zbData = rs || []
        })
        .catch(() => { });
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.xsgbId ? "put" : "post";
          this.loading = true;
          xsgbEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-xsgb", 1);
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
      xsgbRead(this.xsgbId)
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
      this.title = "添加学生干部信息";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-xsgb", false);
    }
  }
};
</script>
