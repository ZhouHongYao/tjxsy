<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :close-on-click-modal="false" :fullscreen="isphone()" width="780px" top="15vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <p class="margin-left-40 font-110 text-danger">注：请提前七天申请</p>
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="教室名称" prop="title" class="form_item">
          <el-input v-model="form.title" maxlength="20" autosize placeholder="请填写教室名称" clearable />
        </el-form-item>
        <el-form-item label="教室地点" prop="address" class="form_item">
          <el-input v-model="form.address" maxlength="20" autosize placeholder="请填写教室地点" clearable />
        </el-form-item>
        <el-form-item label="借用时间" prop="time" class="form_item">
          <el-date-picker v-model="form.time" :picker-options="options" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择日期" />
          <el-time-picker v-if="form.time" v-model="form.times" value-format="HH:mm" format="HH:mm" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
        </el-form-item>
        <el-form-item label="用途" prop="yt" class="form_item">
          <el-input :autosize="{ minRows: 8, maxRows: 14}" v-model="form.yt" type="textarea" maxlength="500" placeholder="请填写用途" />
          还可填写
          <span class="text-danger">{{ 500-form.yt.length }}</span> 个字符
        </el-form-item>
        <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20 padding-left-40"><span v-if="form.shenhe_status==2"> {{ form.beizhu }}</span></LogDetail>

      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      <el-button v-loading="loading" v-waves v-if="type=='review'" type="success" @click="handleKeep(true)">
        <svg-icon icon-class="shield" class="margin-right-10" />保存并审核通过
      </el-button>
      <el-button v-loading="loading" v-waves v-if="type=='review'" type="danger" icon="el-icon-edit" @click="back()">
        退回修改
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { jssqEdit, jssqRead, jssqSh } from "@/api/rcgl/jssq";
import { publicMixin } from "@/api/mixins";
import LogDetail from "@/components/LogDetail";

const form = {
  title: '', //教室名称
  address: '', //教室地点
  time: "", //借用日期
  times: null, //借用时间段
  yt: "" //用途
};
export default {
  directives: { elDragDialog, waves },
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogState", "jid", "type"],
  data() {
    return {
      title: "添加教室借用申请",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      options: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 7 * 24 * 3600 * 1000;
        }
      },
      //组织者Dialog
      memberStatus: false,
      rules: {
        title: [
          {
            required: true,
            message: "请填写教室名称！",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请填写教室地点！",
            trigger: "blur"
          }
        ],
        time: [
          {
            required: true,
            message: "请选择借用日期！",
            trigger: "change"
          }
        ],
        times: [
          {
            required: true,
            message: "请选择借用时间段！",
            trigger: "change"
          }
        ],
        yt: [
          {
            required: true,
            message: "请填写借用用途！",
            trigger: "blur"
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
      if (this.jid) {
        this.title = "编辑教室借用申请";
        this.getRead();
			}
			console.log(new Date('2019-2-29').getTime(), Date.now())
    },
    jyjg() {
      this.$prompt("请填写借用审核结果", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            let beizhu = instance.inputValue;
            if (!beizhu) {
              instance.confirmButtonLoading = false;
              this.$message.error("请填写借用审核结果！");
              return;
            } else {
              this.loading = true;
              let api_type = this.jid ? "put" : "post";
              this.form.beizhu = beizhu
              this.form.status = 2
              jssqEdit(this.form, api_type)
                .then(rs => {
                  this.$message({
                    message: "提交成功！",
                    type: "success"
                  });
                  this.loading = false;
                  instance.confirmButtonLoading = false;
                  done();
                  this.clear();
                  this.$emit("CB-jssq", 1);
                })
                .catch(() => {
                  instance.confirmButtonLoading = false;
                  this.loading = false;
                });
            }
          } else {
            done();
          }
        }
      })
        .then(() => {
          this.clear();
          this.$emit("CB-jssq", 1);
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(() => { });
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (is_shenhe) {
            this.jyjg()
          } else {
            this.loading = true;
            let api_type = this.jid ? "put" : "post";
            jssqEdit(this.form, api_type)
              .then(rs => {
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
                this.loading = false;
                this.clear();
                this.$emit("CB-jssq", 1);
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    //退回
    back() {
      this.$prompt("请填写退回原因：", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            let beizhu = instance.inputValue;
            if (!beizhu) {
              instance.confirmButtonLoading = false;
              this.$message.error("请填写退回原因！");
              return;
            } else {
              jssqSh(
                {
                  id: this.form.id,
                  status: 3,
                  beizhu: beizhu
                },
                "put"
              )
                .then(rs => {
                  instance.confirmButtonLoading = false;
                  done();
                  this.$emit("CB-jssq", 1);
                })
                .catch(() => {
                  instance.confirmButtonLoading = false;
                });
            }
          } else {
            done();
          }
        }
      })
        .then(() => {
          this.clear();
          this.$emit("CB-jssq", 1);
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(() => { });
    },
    //获取详情
    getRead() {
      this.listloading = true;
      jssqRead(this.jid)
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
      this.title = "添加教室借用申请";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },

    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-jssq", false);
    }
  }
};
</script>
