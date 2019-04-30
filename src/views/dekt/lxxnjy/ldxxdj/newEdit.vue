<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="5vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-row>
        <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
          <el-col :sm="12">
            <el-form-item label="学生姓名" prop="name" class="form_item">
              <el-input v-model="form.name" autosize placeholder="请填写学生姓名(按回车健确认)" clearable @blur="checkStu()" @keyup.enter.native="checkStu()" @change="clearStu()" />
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="提交入党申请书时间" prop="tjrd_time" class="form_item" label-width="190px">
              <el-date-picker v-model="form.tjrd_time" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="推优时间" prop="ty_time" class="form_item">
              <el-date-picker v-model="form.ty_time" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="确定为入党积极分子时间" prop="rdjj_time" class="form_item" label-width="220px">
              <el-date-picker v-model="form.rdjj_time" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="提交思想汇报时间1" prop="tjsx_time1" class="form_item" label-width="190px">
              <el-date-picker v-model="form.tjsx_time1" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="提交思想汇报时间2" prop="tjsx_time2" class="form_item" label-width="190px">
              <el-date-picker v-model="form.tjsx_time2" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="提交思想汇报时间3" prop="tjsx_time3" class="form_item" label-width="190px">
              <el-date-picker v-model="form.tjsx_time3" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="提交思想汇报时间4" prop="tjsx_time4" class="form_item" label-width="190px">
              <el-date-picker v-model="form.tjsx_time4" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="beizhu" class="form_item">
              <el-input v-model="form.beizhu" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" maxlength="400" placeholder="请填写备注" />
              还可填写
              <span class="text-danger">{{ 400-form.beizhu.length }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20 margin-left-50" />
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      <el-button v-loading="loading" v-waves v-if="type=='review'" type="success" @click="handleKeep('review')">
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
import LogDetail from "@/components/LogDetail";
import { read } from "@/api/index";
import { ldxxdjEdit, ldxxdjRead, ldxxdjSh } from "@/api/dekt/lxxnjy/ldxxdj";
import { publicMixin } from "@/api/mixins";

const form = {
  sid: "",
  name: "",
  tjrd_time: null, //提交入党申请书时间
  cjpx_time: null, //参加入党启蒙培训时间
  ty_time: null, //推优时间
  rdjj_time: null, //确定为入党积极分子时间
  tjsx_time1: null, //提交思想汇报时间1
  tjsx_time2: null, //提交思想汇报时间2
  tjsx_time3: null, //提交思想汇报时间3
  tjsx_time4: null, //提交思想汇报时间4
  beizhu: ""
};

export default {
  directives: { elDragDialog, waves },
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogState", "sqid", "type"],
  data() {
    return {
      title: "添加入党申请人信息",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        name: [
          {
            required: true,
            message: "请填写学生姓名！",
            trigger: "blur"
          }
        ]
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
      if (this.sqid) {
        this.title = this.type == 'review' ? '审核入党申请人信息' : '编辑入党申请人信息'
        this.getRead();
      }
    },
    async changeStudent(name) {
      return new Promise((resolve, reject) => {
        let url = '/admin-api/s-check/' + name;
        read(url).then(rs => {
          var data = rs;
          if (rs.length == 1) {
            return resolve(rs[0])
          } else if (rs.length > 1) {
            let hrl = '<div class="padding-top-20">';
            rs.forEach(item => {
              hrl = hrl + '<label class="el-radio"><input type="radio" name="singleDoorCt" value="' + item.id + '" class="el-radio__input"/>' + item.name + '(' + item.account + ')' + '</label>'
            });
            hrl = hrl + '</div>';
            this.$alert(hrl, {
              dangerouslyUseHTMLString: true,
              title: "确认学生工号",
              confirmButtonText: '确定'
            }).then((rs) => {
              let flag = false;
              var radio = document.getElementsByName("singleDoorCt");
              radio.forEach(item => {
                if (item.checked) {
                  let value = item.value;
                  let arr = data.find(it => {
                    return it.id == value
                  })
                  flag = true
                  return resolve(arr)
                }
              });
              if (!flag) {
                this.$message({
                  message: "请选择学号！",
                  type: "error"
                });
              }
            }).catch(() => {
              return reject({
                'err': ''
              })
            });
          } else {
            return reject({
              'err': ''
            })
          }
        }).catch(() => {
          return reject({
            'err': ''
          })
        });
      })
    },
    checkStu() {
      if (!this.form.name || this.form.sid) return
      this.changeStudent(this.form.name).then(rs => {
        this.form.sid = rs.sid
      }).catch(() => {
        this.form.sid = null;
      });
    },
    clearStu() {
      this.form.sid = null;
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.sqid ? "put" : "post";
          if (is_shenhe && is_shenhe == 'review') {
            this.form.status = 2
          }
          ldxxdjEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-ldxxdj", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 退回
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
              ldxxdjSh(
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
                  this.$emit("CB-ldxxdj", 1);
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
          this.$emit("CB-ldxxdj", 1);
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
      ldxxdjRead(this.sqid)
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
      this.title = "添加入党申请人信息";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-ldxxdj", false);
    }
  }
};
</script>
