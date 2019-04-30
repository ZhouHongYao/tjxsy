<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :close-on-click-modal="false" :fullscreen="isphone()" width="780px" top="10vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="项目名称" prop="xmmc">
          <el-input v-model="form.xmmc" type="text" placeholder="请填写项目名称" />
        </el-form-item>
        <el-form-item label="学习时间" prop="times">
          <el-date-picker :unlink-panels="true" v-model="form.times" class="filter-item" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" align="right" />
        </el-form-item>
        <el-form-item label="国家" prop="gj">
          <el-input v-model="form.gj" type="text" placeholder="请填写国家" />
        </el-form-item>
        <el-form-item label="单位" prop="dw">
          <el-input v-model="form.dw" type="text" placeholder="请填写单位" />
        </el-form-item>
        <el-form-item label="项目介绍" prop="xmjs">
          <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.xmjs" type="textarea" maxlength="500" placeholder="请填写项目介绍" />
          还可填写
          <span class="text-danger">{{ 500-form.xmjs.length }}</span> 个字符
        </el-form-item>
        <el-form-item label="上传" required>
          <Upload v-show="!form.file.url" :filters="filters" button_size="small" button_id="file" style="width:100px;display:inline-block" plain button_text="上传交流报告" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
          <el-row v-show="form.file.url">
            <el-col>
              <ul class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-success">
                  <a :href="form.file.url" class="el-upload-list__item-name" target="_blank">
                    <i class="el-icon-document" />
                    交流报告
                  </a>
                  <i class="el-icon-close" @click="file_close" />
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-circle-check" />
                  </label>
                </li>
              </ul>
            </el-col>
          </el-row>
          <el-progress v-if="percent>0" :text-inside="true" :stroke-width="18" :percentage="percent" :status="status" />
          <div class="el-upload__tip" style="line-height: 25px;">
            支持上传图片（.png/.jpg/.gif）、文档（.pdf/.doc/.docx/.xls/.xlsx）、压缩包（.rar/.zip）格式文件，大小不超过20MB。
          </div>
        </el-form-item>
        <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20 margin-left-50" />

      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()">提交</el-button>
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
import Upload from "@/components/plupload/index";
import LogDetail from "@/components/LogDetail";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { gjjlxxEdit, gjjlxxRead, gjjlxxSh } from "@/api/xyxx/gjjlxx";
import { publicMixin } from "@/api/mixins";

const form = {
  xmmc: "", //项目名称
  xmjs: "", //项目介绍
  times: null, //学习时间
  gj: "", //国家
  dw: "", //单位
  file: {
    url: "",
    name: "",
    path: ""
  }
};
export default {
  components: { Upload, LogDetail },
  directives: { elDragDialog, waves },
  mixins: [publicMixin],
  props: ["dialogState", "gjjlxxId", "type"],
  data() {
    return {
      title: "添加国际交流学习",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      percent: 0,
      status: "success", //进度状态
      filters: {
        //限制上传文件
        max_file_size: "20mb",
        mime_types: [
          { title: "Image files", extensions: "jpg,gif,png" },
          { title: "Document files", extensions: "pdf,doc,txt" },
          { title: "Zip files", extensions: "zip" },
          { title: "Rar files", extensions: "rar" }
        ]
      },
      rules: {
        xmmc: [
          {
            required: true,
            message: "请填写项目名称",
            trigger: "blur"
          }
        ],
        xmjs: [
          {
            required: true,
            message: "请填写项目介绍",
            trigger: "blur"
          }
        ],
        gj: [
          {
            required: true,
            message: "请填写国家",
            trigger: "blur"
          }
        ],
        times: [
          {
            required: true,
            message: "请选择学习时间",
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
      if (this.gjjlxxId) {
        this.title = this.type == 'review' ? '审核国际交流学习' : '编辑国际交流学习';
        this.getRead();
      }
    },
    //上传进度
    CB_UploadProgress(file) {
      this.percent = file.percent;
      if (this.percent == 100) {
        this.status = "success";
      }
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
    file_close() {
      this.form.file.name = "";
      this.form.file.url = "";
      this.form.file.name = "";
      this.$forceUpdate();
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.gjjlxxId ? "put" : "post";
          if (this.type == 'review') {
            this.form.status = 2
          }
          this.loading = true;
          gjjlxxEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-gjjlxx", 1);
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
      gjjlxxRead(this.gjjlxxId)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
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
              gjjlxxSh(
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
                  this.$emit("CB-gjjlxx", 1);
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
          this.$emit("CB-dialogState", 1);
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(() => { });
    },
    //清空数据
    clear() {
      this.title = "添加国际交流学习";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-gjjlxx", false);
    }
  }
};
</script>
