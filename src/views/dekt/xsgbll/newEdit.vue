<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="700px" top="10vh" @close="handleClose" @open="openDialog">
      <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
        <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="115px" element-loading-text="数据载入中">
          <p class="text-danger" style="margin-left:75px">注：班级干部履历无需添加 </p>
          <el-form-item label="单位" prop="dw">
            <el-input v-model="form.dw" placeholder="请填写单位" clearable />
          </el-form-item>
          <el-form-item label="职务" prop="zw">
            <el-input v-model="form.zw" placeholder="请填写职务" clearable />
          </el-form-item>
          <el-form-item label="任职时间" prop="start_time">
            <el-date-picker v-model="form.start_time" class="filter-item" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="任职开始时间" />
            <el-date-picker v-model="form.end_time" class="filter-item" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="任职结束时间" />
          </el-form-item>
          <el-form-item label="证明人" prop="zmr">
            <el-input v-model="form.zmr" placeholder="请填写证明人" clearable />
          </el-form-item>
          <el-form-item label="特色亮点工作概况" prop="gzgk" class="form_item margin-top-30">
            <el-input v-model="form.gzgk" :autosize="{ minRows: 5, maxRows: 8 }" type="textarea" maxlength="400" placeholder="请填写特色亮点工作概况" />
            还可填写
            <span class="text-danger">{{ 400- (form.gzgk ? form.gzgk.length: 0) }}</span> 个字符
          </el-form-item>
          <el-form-item label="上传">
            <plupload v-show="!form.file.url" :filters="filters" button_size="small" button-id="file" plain button_text="证明材料" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
            <el-row v-show="form.file.url">
              <el-col>
                <ul class="el-upload-list el-upload-list--text">
                  <li class="el-upload-list__item is-success">
                    <a :href="form.file.url" class="el-upload-list__item-name blue" target="_blank">
                      <i class="el-icon-document" />
                      证明材料
                    </a>
                    <i class="el-icon-close" @click="file_close('file')" />
                    <label class="el-upload-list__item-status-label">
                      <i class="el-icon-upload-success el-icon-circle-check" />
                    </label>
                  </li>
                </ul>
              </el-col>
            </el-row>
            <el-progress v-if="percent>0" :text-inside="true" :stroke-width="15" :percentage="percent" class="margin-top-5" />
            <div class="el-upload__tip" style="line-height: 25px;">
              支持上传图片（.png/.jpg/.gif）、PDF、压缩包（.rar/.zip）格式文件，大小不超过20MB。
            </div>
          </el-form-item>
        </el-form>
        <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20 padding-left-40" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
        <el-button v-waves v-if="authCheck(61)" :loading="loading" type="success" @click="handleKeep(true)">
        <svg-icon icon-class="shield" class="margin-right-5" /> 保存并审核通过</el-button>
        <el-button v-waves v-if="gbllId && authCheck(61)" :loading="loading" type="danger" icon="el-icon-edit" @click="back()"> 退回修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import plupload from "@/components/plupload/index";
import LogDetail from "@/components/LogDetail";
import { xsgbllEdit, xsgbllRead, xsgbllSh } from "@/api/dekt/xsgbll";
import { publicMixin } from "@/api/mixins";

const form = {
  dw: "", //单位
  zw: "", //职务
  start_time: null, //任职时间
  end_time: null, //任职时间
  zmr: "", //证明人
  file: {
    name: "",
    path: "",
    url: ""
  },
  gzgk: "" //特色亮点工作概况
};
export default {
  directives: { elDragDialog, waves },
  components: { plupload, LogDetail },
  mixins: [publicMixin],
  props: ["dialogState", "gbllId", "type"],
  data() {
    return {
      title: "添加学生干部履历",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      percent: 0,
      //限制上传文件
      filters: {
        max_file_size: "20mb",
        mime_types: [
          { title: "Image files", extensions: "jpg,gif,png" },
          { title: "Zip files", extensions: "zip" },
          { title: "Rar files", extensions: "rar" },
          { title: "PDF", extensions: "pdf" }
        ]
      },
      rules: {
        dw: [
          {
            required: true,
            message: "请填写单位名称！",
            trigger: "blur"
          }
        ],
        zw: [
          {
            required: true,
            message: "请填写职务！",
            trigger: "blur"
          }
        ],
        start_time: [
          {
            required: true,
            message: "请选择任职时间！",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.8 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.type === "edit") {
        this.title = "编辑学生干部履历";
        this.getRead();
      } else if (this.type === "review") {
        this.title = "审核学生干部履历";
        this.getRead();
      }
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.gbllId ? "put" : "post";
          let data = JSON.parse(JSON.stringify(this.form));
          if (is_shenhe) {
            data.status = 2;
          }
          if (data.shenhelog) {
            delete data["shenhelog"];
          }
          xsgbllEdit(data, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-gbll", 1);
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
              xsgbllSh(
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
          this.$emit("CB-gbll", 1);
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(() => { });
    },
    getRead() {
      this.listloading = true;
      xsgbllRead(this.gbllId)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //上传进度
    CB_UploadProgress(file) {
      this.percent = file.percent;
    },
    //上传成功后的回调
    CB_GetFileInfo(res, id) {
      if (res && res.url) {
        this.form.file = res;
        this.percent = 0;
        this.$forceUpdate();
        this.$message({ message: "上传成功", type: "success" });
      } else {
        this.percent = 0;
        this.$message({ message: "上传失败", type: "error" });
      }
    },
    //刪除图片
    file_close(type) {
      this.form.file.url = "";
      this.form.file.name = "";
      this.form.file.path = "";
      this.$forceUpdate();
    },
    //清空数据
    clear() {
      this.title = "添加学生干部履历";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-gbll", false);
    }
  }
};
</script>
