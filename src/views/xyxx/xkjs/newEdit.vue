<template>
  <el-dialog v-el-drag-dialog :title="laber_title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="10vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="竞赛名称" prop="title">
          <el-input v-model="form.title" placeholder="请填写学科竞赛名称" maxlength="200" size="medium" clearable />
        </el-form-item>
        <el-form-item label="竞赛等级" prop="jsdj">
          <el-input v-model="form.jsdj" placeholder="请填写学科竞赛名称" maxlength="200" size="medium" clearable />
        </el-form-item>
        <el-form-item label="获奖等级" prop="hjdj">
          <el-select v-model="form.hjdj" size="medium" clearable placeholder="请选择获奖等级" style="width:100%">
            <el-option v-for="item in hjdjData" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="竞赛介绍" prop="xmjs" class="form_item margin-top-30">
          <el-input v-model="form.xmjs" :autosize="{ minRows: 5, maxRows: 10 }" type="textarea" maxlength="400" placeholder="请填写竞赛介绍" />
          还可填写
          <span class="text-danger">{{ 400-form.xmjs.length }}</span> 个字符
        </el-form-item>
        <el-form-item label="获奖时间" prop="hj_time">
          <el-date-picker v-model="form.hj_time" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择年月" size="medium" />
        </el-form-item>
        <el-form-item label="上传">
          <Upload v-show="!form.sjbg_file.url" :button_size="button_size" :filters="filters" button_id="sjbg_file" style="width:100px;display:inline-block;vertical-align: top;" plain button_text="实践报告" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
          <div v-show="form.sjbg_file.url" style="width:125px;display: inline-block;">
            <ul class="el-upload-list el-upload-list--text">
              <li class="el-upload-list__item is-success">
                <a :href="form.sjbg_file.url" class="el-upload-list__item-name" target="_blank">
                  <i class="el-icon-document" />
                  实践报告
                </a>
                <i class="el-icon-close" @click="file_close('sjbg_file')" />
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check" />
                </label>
              </li>
            </ul>
          </div>
          <Upload v-show="!form.hjzs_file.url" :button_size="button_size" :filters="filters" button_id="hjzs_file" style="width:100px;display:inline-block;vertical-align: top;" plain button_text="获奖证书" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
          <div v-show="form.hjzs_file.url" style="width:125px;display: inline-block;">
            <ul class="el-upload-list el-upload-list--text">
              <li class="el-upload-list__item is-success">
                <a :href="form.hjzs_file.url" class="el-upload-list__item-name" target="_blank">
                  <i class="el-icon-document" />
                  获奖证书
                </a>
                <i class="el-icon-close" @click="file_close('获奖证书')" />
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check" />
                </label>
              </li>
            </ul>
          </div>
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
import { xkjsRead, xkjsEdit, xkjsSh } from "@/api/xyxx/xkjs";
import { publicMixin } from "@/api/mixins";

const form = {
  title: "", //竞赛名称
  jsdj: "", //竞赛等级
  hjdj: "", //获奖等级
  xmjs: "", //竞赛介绍
  hj_time: "",
  sjbg_file: {
    url: "",
    name: "",
    path: ""
  },
  hjzs_file: {
    url: "",
    name: "",
    path: ""
  }
}
export default {
  directives: { elDragDialog, waves },
  components: { Upload, LogDetail },
  mixins: [publicMixin],
  props: ["dialogState", "xmid", "type"],
  data() {
    return {
      loading: false,
      listloading: false,
      laber_title: "添加学科竞赛",
      innerVisible: false, //内层Dialog
      button_size: "small",
      percent: 0,
      status: "", //进度状态
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
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        title: [
          {
            required: true,
            message: "请填写学科竞赛名称",
            trigger: "blur"
          }
        ],
        jsdj: [
          {
            required: true,
            message: "请填写竞赛等级",
            trigger: "blur"
          }
        ],
        xmjs: [
          {
            required: true,
            message: "请填写竞赛介绍",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: mapState({
    hjdjData: state => state.hjdjData,
    xmjbData: state => state.xmjbData,
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.8 - 170
    })
  }),
  methods: {
    openDialog() {
      if (this.xmid) {
        this.getRead();
        this.laber_title = "编辑学科竞赛";
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
        if (id == 'sjbg_file') {
          this.form.sjbg_file = res
        } else {
          this.form.hjzs_file = res
        }
        this.percent = 0;
        this.$forceUpdate();
        this.$message({ message: "上传成功", type: "success" });
      } else {
        this.percent = 0;
        this.$message({ message: "上传失败", type: "error" });
      }
    },
    //刪除图片
    file_close(id) {
      if (id == 'sjbg_file') {
        this.form.sjbg_file.name = "";
        this.form.sjbg_file.url = "";
        this.form.sjbg_file.name = "";
      } else {
        this.form.hjzs_file.name = "";
        this.form.hjzs_file.url = "";
        this.form.hjzs_file.name = "";
      }
      this.$forceUpdate();
    },
    //保存数据
    handleKeep(is_shenhe) {
      let api_type = this.xmid ? "put" : "post";
      if (is_shenhe && is_shenhe == 'review') {
        this.form.status = 2
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          xkjsEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.clear()
              this.$emit("CB-dialogState", 1);
              this.loading = false;
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
              xkjsSh(
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
                  this.$emit("CB-dialogState", 1);
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
    //获取详情
    getRead() {
      this.listloading = true;
      xkjsRead(this.xmid)
        .then(rs => {
          this.form = rs;
          this.form.file.url =
            this.form.prefix + this.form.file.path;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    handleClose() {
      this.clear();
      this.$emit("CB-dialogState", false);
    },
    clear() {
      this.laber_title = "添加学科竞赛";
      this.loading = false;
      this.form = JSON.parse(JSON.stringify(form))
      this.$refs["form"].resetFields();
    }
  }
};
</script>
