<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="5vh" @close="handleClose" @open="openDialog">
    <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="150px" element-loading-text="数据载入中">
        <el-row>
          <el-col :span="24">
            <el-form-item label="活动名称" prop="title" class="form_item">
              <el-input v-model="form.title" autosize placeholder="请填写活动名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="个人承担主要任务" prop="cdrw">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="form.cdrw" type="textarea" maxlength="500" placeholder="请填写个人承担主要任务" />
              还可填写
              <span class="text-danger">{{ 500-form.cdrw.length }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动覆盖面" prop="hdfgm">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="form.hdfgm" type="textarea" maxlength="500" placeholder="请填写活动覆盖面" />
              还可填写
              <span class="text-danger">{{ 500-form.hdfgm.length }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动成效" prop="hdcx">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="form.hdcx" type="textarea" maxlength="500" placeholder="请填写活动成效" />
              还可填写
              <span class="text-danger">{{ 500-form.hdcx.length }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传" required>
              <plupload v-show="!form.file.url" :filters="filters" button_size="small" plain button_text="活动照片" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
              <el-row v-show="form.file.url">
                <el-col>
                  <ul class="el-upload-list el-upload-list--text">
                    <li class="el-upload-list__item is-success">
                      <a :href="form.file.url" class="el-upload-list__item-name blue" target="_blank">
                        <i class="el-icon-document" />
                        活动照片
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
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import plupload from "@/components/plupload/index";
import { hdzzEdit, hdzzRead } from "@/api/dekt/bjxsgz/hdzz";
import { publicMixin } from "@/api/mixins";

const form = {
  title: "", //活动名称
  cdrw: "", //个人承担主要任务
  hdfgm: "", //活动覆盖面
  hdcx: "", //活动成效
  file: {
    url: "",
    path: "",
    name: ""
  }
};
export default {
  directives: { elDragDialog, waves },
  components: { plupload },
  mixins: [publicMixin],
  props: ["dialogState", "hdzzId"],
  data() {
    return {
      title: "添加活动组织情况（作为第一负责人）",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      percent: 0,
      //限制上传文件
      filters: {
        max_file_size: "100mb",
        mime_types: [
          { title: "Image files", extensions: "jpg,gif,png" },
          { title: "Zip files", extensions: "zip" },
          { title: "Rar files", extensions: "rar" },
          { title: "PDF", extensions: "pdf" }
        ]
      },
      rules: {
        title: [{
          required: true,
          message: "请填写活动名称！",
          trigger: "blur"
        }],
        cdrw: [{
          required: true,
          message: "请填写个人承担主要任务！",
          trigger: "blur"
        }],
        hdfgm: [{
          required: true,
          message: "请填写活动覆盖面！",
          trigger: "blur"
        }],
        hdcx: [{
          required: true,
          message: "请填写活动成效！",
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
      if (this.hdzzId) {
        this.title = "编辑活动组织情况（作为第一负责人）";
        this.getRead();
      }
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
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.hdzzId ? "put" : "post";
          this.loading = true;
          hdzzEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-hdzz", 1);
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
      hdzzRead(this.hdzzId)
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
      this.title = "添加活动组织情况（作为第一负责人）";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-hdzz", false);
    }
  }
};
</script>
