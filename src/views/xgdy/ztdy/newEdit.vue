<template>
  <div v-loading="listLoading" element-loading-text="数据载入中">
    <sticky :z-index="10" class-name="sub-navbar">
      <el-button v-loading="loading" v-waves v-if="$route.query.type!= 'review'" type="primary" icon="el-icon-success" @click="batchReview">
        提交
      </el-button>
      <el-button v-loading="loading" v-waves v-if="$route.query.type== 'review'" type="success" @click="save('review')">
        <svg-icon icon-class="shield" class="margin-right-10" />
        保存并审核通过
      </el-button>
      <el-button v-loading="loading" v-waves v-if="$route.query.type== 'review'" type="danger" icon="el-icon-edit" @click="back">
        退回修改
      </el-button>
      <goBack style="margin-left: 10px;" />
    </sticky>
    <div class="app-container">
      <el-row :gutter="20">
        <h3 class="text-center">{{ form.title || '' }}</h3>
        <el-col v-if="form.note" class="margin-bottom-20">
          <div v-html="Trim(form.note)" />
        </el-col>
        <el-col>
          <el-form ref="form" :model="form" label-width="110px" label-position="top" class="padding-left-20 padding-right-10">
            <div v-for="(item,index) in form.list" :key="index">
              <el-form-item :label="(item.xh)+'.'+item.tm">
                <div class="padding-left-10">
                  <span v-if="item.lx==1">
                    <el-input v-model="item.result" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" placeholder="请填写内容" />
                  </span>
                  <span v-if="item.lx==2">
                    <el-radio-group v-model="item.result">
                      <el-radio v-for="(v,i) in item.options" :key="i" :label="v.id" class="no-margin margin-bottom-20 " style="width:100%">{{ v.note }}</el-radio>
                    </el-radio-group>
                  </span>
                  <span v-if="item.lx==3">
                    <el-checkbox-group v-model="item.result">
                      <el-checkbox v-for="v in item.options" :key="v.id" :label="v.id" class="no-margin margin-bottom-10" style="width:100%">{{ v.note }}</el-checkbox>
                    </el-checkbox-group>
                  </span>
                </div>
              </el-form-item>
            </div>
            <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" />
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import goBack from "@/components/goBack";
import { publicMixin } from "@/api/mixins";
import Sticky from "@/components/Sticky"; // 粘性header组件
import LogDetail from "@/components/LogDetail";
import { xsdyRead, ztdyRead, xsdySh, dywj } from "@/api/xgdy/ztdy";

const form = {
  title: "", //主题调研标题
  list: []
}

export default {
  directives: { waves },
  components: { goBack, Sticky, LogDetail },
  mixins: [publicMixin],
  data() {
    return {
      listLoading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {}
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
    //保存
    batchReview(is_shenhe) {
      if (this.$store.state.user.userinfo.group == 3) {
        this.$confirm("提交后不能修改，确定要提交吗?", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success"
        })
          .then(() => {
            this.save(is_shenhe)
          })
          .catch(() => { });
      } else {
        this.save(is_shenhe)
      }
    },
    //保存
    save(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.$route.query.type && (this.$route.query.type == 'edit' || this.$route.query.type == 'review') ? "put" : "post";
          let data = JSON.parse(JSON.stringify(this.form))
          if (this.$route.query.type == 'add') {
            data.dyid = data.id
            delete data.id
          }
          delete data.title
          delete data.note
          delete data.times
          if (data.list) {
            for (let i = 0; i < data.list.length; i++) {
              delete data.list[i].options
              delete data.list[i].tm
              delete data.list[i].xh
            }
          }
          if (is_shenhe && is_shenhe == 'review') {
            data.status = 2
          }
          dywj(data, api_type)
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
              xsdySh(
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
                  this.backout()
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
          this.$emit("CB-ggpyxx", 1);
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(() => { });
    },
    //获取数据
    getRead() {
      this.listloading = true;
      if (this.$route.query.type && (this.$route.query.type == 'edit' || this.$route.query.type == 'review')) {
        xsdyRead(this.$route.query.id)
          .then(rs => {
            this.form = rs;
            this.change()
            this.listloading = false;
          })
          .catch(() => {
            this.listloading = false;
          });
      } else {
        ztdyRead(this.$route.query.id)
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
}
</script>
