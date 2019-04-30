<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="15vh" @close="handleClose" @open="openDialog">
      <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
        <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="170px" element-loading-text="数据载入中">
          <el-row>
            <el-col :span="24">
              <el-form-item label="学年名称" prop="title" class="form_item">
                <el-input v-model="form.title" maxlength="20" autosize placeholder="请填写学年名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否为当前默认年份" prop="is_mr" class="form_item">
                <el-radio-group v-model="form.is_mr">
                  <el-radio :label="2">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="基本信息" prop="jbxx_time" class="form_item">
                <el-date-picker v-model="form.jbxx_time" type="datetimerange" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="致一年后的自己" prop="zynh_time" class="form_item">
                <el-date-picker v-model="form.zynh_time" type="datetimerange" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="学业自评" prop="xyzp_time" class="form_item">
                <el-date-picker v-model="form.xyzp_time" type="datetimerange" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="服务家乡" prop="fwjx_time" class="form_item">
                <el-date-picker v-model="form.fwjx_time" type="datetimerange" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="感恩国家" prop="gegj_time" class="form_item">
                <el-date-picker v-model="form.gegj_time" type="datetimerange" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="能力自评" prop="nlzp_time" class="form_item">
                <el-date-picker v-model="form.nlzp_time" type="datetimerange" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
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
import { publicMixin } from "@/api/mixins";
import { yearsEdit, yearsRead } from "@/api/years";

const form = {
  title: '', //学年名称
  is_mr: 1, //是否为当前默认年份
  jbxx_time: null, //基本信息时间
  zynh_time: null, //致一年后的自己
  xyzp_time: null, //学业自评
  fwjx_time: null, //服务家乡
  gegj_time: null, //感恩国家
  nlzp_time: null //能力自评
};
export default {
  directives: { elDragDialog, waves },
  mixins: [publicMixin],
  props: ["dialogState", "yid"],
  data() {
    return {
      title: "添加学年及进度",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        title: [
          {
            required: true,
            message: "请填写学年名称！",
            trigger: "blur"
          }
        ],
        is_mr: [
          {
            required: true,
            message: "请选择是否当前年份！",
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
      if (this.yid) {
        this.title = "编辑学年及进度";
        this.getRead();
      }
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.yid ? "put" : "post";
          this.loading = true;
          yearsEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-years", 1);
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
      yearsRead(this.yid)
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
      this.title = "添加学年及进度";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },

    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-years", false);
    }
  }
};
</script>
