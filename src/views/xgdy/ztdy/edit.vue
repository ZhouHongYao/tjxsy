<template>
  <div v-loading="listLoading" element-loading-text="数据载入中">
    <sticky :z-index="10" class-name="sub-navbar">
      <el-button v-loading="loading" v-waves v-if="form.title" type="success" icon="el-icon-search" @click="yl">
        预览
      </el-button>
      <el-button v-loading="loading" v-waves type="primary" icon="el-icon-success" @click="save">
        提交
      </el-button>
      <goBack v-if="!currentRole()" style="margin-left: 10px;" />
    </sticky>
    <div class="app-container">
      <el-row :gutter="20" style="margin-top:50px;">
        <el-col :span="18">
          <el-row>
            <el-col :span="24">
              <el-form ref="form" :model="form" :rules="rules" label-suffix="：" label-width="130px">
                <el-form-item label="调研开放时间" prop="times">
                  <el-date-picker v-model="form.times" type="datetimerange" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
                </el-form-item>
                <el-form-item label="主题调研标题" prop="title">
                  <el-input v-model="form.title" type="text" placeholder="请输入主题调研标题" />
                </el-form-item>
                <el-form-item label="调研简介" prop="note">
                  <el-input v-model="form.note" :autosize="{ minRows: 4, maxRows: 8}" maxlength="400" type="textarea" placeholder="请输入描述内容" />
                  还可填写
                  <span class="text-danger">{{ 400-(form.note ? form.note.length : 0) }}</span> 个字符
                </el-form-item>
                <div v-for="(d, index) in form.list" :key="index">
                  <el-form-item label="调研问题" required>
                    <el-input v-model="d.xh" type="number" placeholder="序号" min="1" style="width:75px" />
                    <el-input v-model="d.tm" placeholder="请输入主题调研问题" type="text" class="tm_label" />
                    <i class="el-icon-circle-close-outline margin-left-10 font-140 pointer text-danger" @click.prevent="remove(index)" />
                    <div v-if="d.lx==2" class="margin-top-20">
                      <el-radio-group>
                        <div v-for="(v, i) in d.options" :key="i" class="margin-bottom-10">
                          <el-radio :label="i">
                            <el-input v-model="v.note" name="radio" type="text" placeholder="请输入调研选项内容" style="width:300px" />
                            <i v-show="i===0" class="el-icon-circle-plus-outline margin-left-10 font-140 pointer text-success" @click="addOption(index)" />
                            <i v-show="i>0" class="el-icon-circle-close-outline margin-left-10 font-140 pointer text-danger" @click.prevent="removeOption(index,i)" />
                          </el-radio>
                        </div>
                      </el-radio-group>
                    </div>
                    <div v-if="d.lx==3" class="margin-top-20">
                      <div v-for="(v, i) in d.options" :key="i" class="margin-bottom-10">
                        <el-checkbox>
                          <el-input v-model="v.note" name="checkbox" type="text" placeholder="请输入调研选项内容" style="width:300px" />
                        </el-checkbox>
                        <i v-show="i===0" class="el-icon-circle-plus-outline margin-left-10 font-140 pointer text-success" @click="addOption(index)" />
                        <i v-show="i>0" class="el-icon-circle-close-outline margin-left-10 font-140 pointer text-danger" @click.prevent="removeOption(index,i)" />
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>设置题目（选择题型）</span>
            </div>
            <div class="component-item">
              <el-button v-for="item in options" :key="item.id" class="form_item" plain type="primary" @click="add(item.id)">{{ item.title }}</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <Blink :dialog-blink="dialogBlink" :data="data" @CB-blink="CB_blink" />
      <Detail :dialog-detail="dialogDetail" :data="form" @CB-dialogDetail="CB_dialogDetail" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import goBack from "@/components/goBack";
import Blink from "./blink";
import Detail from "./detail";
import { publicMixin } from "@/api/mixins";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { ztdyRead, ztdyEdit } from "@/api/xgdy/ztdy";

const form = {
  title: "", //主题调研标题
  list: []
}
const options = [{ id: 1, title: '文本' }, { id: 2, title: '单选' }, { id: 3, title: '多选' }]

export default {
  directives: { waves },
  components: { goBack, Sticky, Blink, Detail },
  mixins: [publicMixin],
  data() {
    return {
      listLoading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      options,
      //问题预览
      dialogBlink: false,
      data: {},
      //预览详情
      dialogDetail: false,
      rules: {
        title: [
          {
            required: true,
            message: "请填写主题调研标题！",
            trigger: "blur"
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      clientHeight: state => state.clientHeight
    })
  },
  activated() {
    if (this.$route.query.id) {
      this.getRead()
    }
  },
  deactivated() {
    this.form = JSON.parse(JSON.stringify(form))
  },
  methods: {
    //添加问题
    add(lx) {
      let i = this.form.list.length ? this.form.list.length + 1 : 1
      if (lx == 1) {
        this.form.list.push({
          xh: i,
          lx: lx,
          tm: ""
        });
      } else {
        this.form.list.push({
          xh: i,
          tm: "",
          lx: lx,
          options: [{ note: "" }]
        });
      }
    },
    //移除问题
    remove(index) {
      this.form.list.splice(index, 1);
    },
    //添加问题
    addOption(index) {
      this.form.list[index].options.push({
        note: ""
      });
    },
    //移除问题
    removeOption(index, i) {
      this.form.list[index].options.splice(i, 1);
    },
    //预览
    blink(data) {
      this.data = data
      this.dialogBlink = true
    },
    //回调
    CB_blink() {
      this.data = {}
      this.dialogBlink = false
    },
    //预览全部
    yl() {
      this.dialogDetail = true
    },
    CB_dialogDetail() {
      this.dialogDetail = false
    },
    //保存
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          ztdyEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              if (this.currentRole()) {
                this.getRead()
              } else {
                this.backout()
              }
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
      ztdyRead(id)
        .then(rs => {
          this.form = rs;
          this.change()
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.form_item {
  margin-left: 0px !important;
  margin-bottom: 20px;
  margin-right: 10px;
}
.tm_label {
  width: calc(100% - 140px);
}
</style>
