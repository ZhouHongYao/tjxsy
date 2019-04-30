<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="tbkcDialog" :fullscreen="isphone()" :close-on-click-modal="false" width="700px" top="15vh" @close="handleClose" @open="openDialog">
      <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
        <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-10" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
          <el-form-item label="课程名称" prop="kcbh">
            <el-select v-model="form.kcbh" filterable placeholder="请选择课程" clearable style="width:100%" @change="change">
              <el-option v-for="item in tbkcData" :key="item.kcbh" :label="item.title" :value="item.kcbh" />
            </el-select>
          </el-form-item>
          <el-row v-if="form.kid" style="padding: 5px 0px 35px 30px">
            <el-card shadow="always">
              <div slot="header">
                <span>课程详情</span>
              </div>
              <el-col :span="24">
                <el-form-item label="课程编号">
                  {{ info.kcbh || '--' }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属课程类型">
                  {{ info.type || '--' }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="学分">
                  {{ info.xf || '--' }}
                </el-form-item>
              </el-col>
            </el-card>
          </el-row>
          <el-form-item label="课程时间" prop="times">
            <el-date-picker v-model="form.times" :unlink-panels="true" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
          </el-form-item>
          <el-form-item label="课程地点" prop="address">
            <el-input v-model="form.address" placeholder="请填写课程地点" clearable />
          </el-form-item>
          <el-form-item label="课程容量" prop="kcrl">
            <el-input v-model.number="form.kcrl" type="number" placeholder="请填写课程容量" clearable />
          </el-form-item>
          <el-form-item label="负责教师姓名" prop="fz_name">
            <el-input v-model="form.fz_name" placeholder="请填写教师姓名" clearable />
          </el-form-item>
          <el-form-item label="培训对象" prop="pxdx">
            <el-select v-model="form.pxdx" multiple placeholder="请选择培训对象" style="width:100%">
              <el-option v-for="item in zbData" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息" prop="beizhu">
            <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.beizhu" type="textarea" maxlength="300" placeholder="备注信息，非必填项" />
            还可填写
            <span class="text-danger">{{ 300 - (form.beizhu ? form.beizhu.length : 0) }}</span> 个字符
          </el-form-item>
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
import { tbkcEdit, tbkcRead, kcgls } from "@/api/dekt/bjxsgz/tbkc";
import { kcglRead } from "@/api/dekt/bjxsgz/kcgl";
import { checkTeacher, publicMixin } from "@/api/mixins";
import { cateChild } from "@/api/system/category";

const form = {
  kid: "",	//课程id
  kcbh: "",
  times: null, //课程日期
  kcrl: null, // 课程容量
  uid: null,
  address: "", //课程地点
  fz_name: "",	//课程负责老师
  pxdx: [], //培训对象
  beizhu: ""
};
export default {
  directives: { elDragDialog, waves },
  mixins: [checkTeacher, publicMixin],
  props: ["tbkcDialog", "kcId"],
  data() {
    return {
      title: "添加排课信息",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      zbData: [],
      tbkcData: [],
      pxdx: [],
      info: {},
      rules: {
        kcbh: [
          {
            required: true,
            message: "请选择课程！",
            trigger: "change"
          }
        ],
        times: [
          {
            required: true,
            message: "请选择课程时间！",
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            message: "请填写课程地点！",
            trigger: "blur"
          }
        ],
        kcrl: [
          {
            required: true,
            message: "请填写课程容量！",
            trigger: "blur"
          }
        ],
        fz_name: [{
          required: true,
          message: "请填写负责教师姓名",
          trigger: "blur"
        }],
        pxdx: [
          {
            required: true,
            message: "请选择培训对象！",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.kcId) {
        this.title = "编辑排课信息";
        this.getRead();
      }
      this.getKc()
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
          let api_type = this.kcId ? "put" : "post";
          this.loading = true;
          let item = this.tbkcData.find(item => {
            return item.kcbh == this.form.kcbh;
          });
          if (item) {
            this.form.kid = item.id
          }
          tbkcEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-kc", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    //获取课程列表
    getKc() {
      kcgls()
        .then(rs => {
          this.tbkcData = rs || [];
        })
        .catch(() => { });
    },
    //切换课程
    change(val) {
      this.listloading = true;
      let item = this.tbkcData.find(item => {
        return item.kcbh == val;
      });
      if (item) {
        this.getKcDeatail(item.id)
      }
    },
    //获取课程详情
    getKcDeatail(id) {
      kcglRead(id)
        .then(rs => {
          this.info = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //获取详情
    getRead() {
      this.listloading = true;
      tbkcRead(this.kcId)
        .then(rs => {
          this.form = rs;
          this.getKcDeatail(this.form.kid)
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //清空数据
    clear() {
      this.title = "添加排课信息";
      this.form = JSON.parse(JSON.stringify(form))
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-kc", false);
    }
  }
};
</script>
