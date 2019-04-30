<template>
  <el-dialog v-el-drag-dialog :title="laber_title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="5vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="form.title" placeholder="请填写科创项目名称" maxlength="200" size="medium" clearable />
        </el-form-item>
        <el-form-item label="项目类别" prop="type">
          <el-select v-model="form.type" size="medium" clearable placeholder="请选择项目类别" style="width:100%">
            <el-option v-for="item in xmjbData" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="获奖等级" prop="hjdj">
          <el-select v-model="form.hjdj" size="medium" clearable placeholder="请选择获奖等级" style="width:100%">
            <el-option v-for="item in hjdjData" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目介绍" prop="xmjs" class="form_item margin-top-30">
          <el-input v-model="form.xmjs" :autosize="{ minRows: 5, maxRows: 10 }" type="textarea" maxlength="400" placeholder="请填写项目介绍" />
          还可填写
          <span class="text-danger">{{ 400-form.xmjs.length }}</span> 个字符
        </el-form-item>
        <p class="margin-left-40 text-warning">注：项目成员中包含自己时，请添加自己姓名</p>
        <el-form-item label="项目成员" required>
          <el-tag v-for="tag in form.member" :key="tag.account" :disable-transitions="false" closable @close="tagClose(tag)">
            {{ tag.name }}（{{ tag.account }}）
          </el-tag>
          <el-input v-if="inputVisible" ref="saveTagInput" v-model="inputValue" class="input-new-tag" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-else class="button-new-tag" style="margin-left:0px !important" size="small" @click="showInput">+添加学生姓名</el-button>
        </el-form-item>
        <el-form-item label="指导教师" prop="zdjs">
          <el-input v-model="form.zdjs" placeholder="请填写指导教师姓名" maxlength="200" size="medium" clearable />
        </el-form-item>
        <el-form-item label="立项年月" prop="lx_time">
          <el-date-picker v-model="form.lx_time" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择年月" size="medium" />
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
    <el-dialog :visible="innerVisible" width="400px" title="学生信息" top="30vh" append-to-body @open="openStuDialog" @close="stuClose">
      <template>
        <el-row>
          <el-col v-for="(vo,index) in checkData" :span="12" :key="index">
            <div v-if="checkData.length>0">
              <el-radio v-model="selectIndex" :label="vo.account">{{ inputValue }}（{{ vo.account }}）</el-radio>
            </div>
          </el-col>
        </el-row>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="checkKeep">确认</el-button>
      </div>
    </el-dialog>

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
import { kcxmRead, kcxmEdit, kcxmSh } from "@/api/xyxx/kcxm";
import { read } from "@/api/index";
import { publicMixin } from "@/api/mixins";

const form = {
  title: "", //项目名称
  type: "", //项目类别
  hjdj: "", //获奖等级
  xmjs: "", //项目介绍
  zdjs: "", //指导老师
  lx_time: "",
  sjbg_file: {
    url: "",
    name: "",
    path: ""
  },
  hjzs_file: {
    url: "",
    name: "",
    path: ""
  },
  member: []
}
export default {
  directives: { elDragDialog, waves },
  components: { Upload, LogDetail },
  mixins: [publicMixin],
  props: ["dialogState", "xmid", "type"],
  data() {
    return {
      listloading: false,
      loading: false,
      laber_title: "添加科创项目",
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
      inputValue: "",
      inputVisible: false,
      selectIndex: null,
      checkData: [],
      rules: {
        title: [
          {
            required: true,
            message: "请填写科创项目名称",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择项目类别",
            trigger: "change"
          }
        ],
        xmjs: [
          {
            required: true,
            message: "请填写项目介绍",
            trigger: "blur"
          }
        ],
        zdjs: [
          {
            required: true,
            message: "请填写指导老师",
            trigger: "blur"
          }
        ],
        lx_time: [
          {
            required: true,
            message: "选择立项年月",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: mapState({
    hjdjData: state => state.hjdjData,
    xmjbData: state => state.xmjbData,
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.9 - 170
    })
  }),
  methods: {
    openDialog() {
      if (this.xmid) {
        this.getRead();
        this.laber_title = "编辑科创项目";
      }
    },

    tagClose(tag) {
      this.form.member.splice(this.form.member.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //验证学生
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (!inputValue) {
        this.inputVisible = false;
        return;
      }
      read('/admin-api/s-check/' + inputValue)
        .then(rs => {
          if (rs.length === 1) {
            let item = this.form.member.find(v => {
              return rs[0].sid == v.sid;
            });
            if (item) {
              this.$message({ message: "您已添加该学生！", type: "warning" });
            } else {
              this.form.member.push(rs[0]);
              this.inputVisible = false;
              this.inputValue = "";
            }
          } else {
            this.checkData = rs;
            for (const it of this.form.member) {
              let item = rs.find(v => {
                return v.sid == it.sid;
              });
              if (item) {
                this.checkData.splice(this.checkData.indexOf(item), 1);
              }
            }
            if (this.checkData.length === 0) {
              this.$message({ message: "您已添加该学生！", type: "warning" });
            } else {
              this.innerVisible = true;
            }
          }
        })
        .catch(() => { });
    },

    openStuDialog() { },
    stuClose() {
      this.innerVisible = false;
    },
    // 确认学生
    checkKeep() {
      if (!this.selectIndex) {
        this.$message({ message: "请先选择学生！", type: "warning" });
      } else {
        let item = this.checkData.find(v => {
          return this.selectIndex == v.account;
        });
        this.form.member.push(item);
        this.inputVisible = false;
        this.inputValue = "";
        this.selectIndex = null;
        this.checkData = [];
        this.innerVisible = false;
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
          kcxmEdit(this.form, api_type)
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
              kcxmSh(
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
      kcxmRead(this.xmid)
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
      this.laber_title = "添加科创项目";
      this.loading = false;
      this.listloading = false;
      this.inputVisible = false;
      this.inputValue = "";
      this.form = JSON.parse(JSON.stringify(form))
      this.form.member = []
      this.$refs["form"].resetFields();
    }
  }
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
