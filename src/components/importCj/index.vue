<template>
  <span>
    <el-button v-waves class="filter-item margin-right-10" icon="el-icon-upload" type="primary" @click="importDialog = true">
      {{ import_text ? import_text : '导入' }}
    </el-button>
    <el-dialog :visible="importDialog" :title="import_text ? import_text : '数据导入'" width="780px" top="15vh" @close="handleClose" @open="openDialog">
      <span class="text-danger pull-left" style="line-height: 40px;font-size:16px"> 注：请先导入总成绩，然后导入各科成绩</span>
      <div class="pull-right">
        <a :href="url" :download="import_name" class="el-button bzl filter-item" type="primary" plain target="_blank">
          <i class="el-icon-download" /> 样表下载
        </a>
      </div>
      <hr class=" hr_label" style="clear:both">
      <el-form ref="form" :model="form" :rules="rules" class="margin-top-30" label-suffix="：" label-width="120px">
        <el-form-item label="上传数据" required>
          <Upload v-show="!form.file.url&&importDialog" :filters="filters" button_id="gkcj" button_size="small" plain button_text="导入表格" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
          <el-row v-show="form.file.url">
            <el-col>
              <ul class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-success">
                  <a :href="form.file.url" class="el-upload-list__item-name blue" target="_blank">
                    <i class="el-icon-document" />
                    导入数据
                  </a>
                  <i class="el-icon-close" @click="file_close()" />
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-circle-check" />
                  </label>
                </li>
              </ul>
            </el-col>
          </el-row>
          <el-progress v-if="percent>0" :text-inside="true" :stroke-width="15" :percentage="percent" :status="status" class="margin-top-5" />
          <div class="el-upload__tip" style="line-height: 25px;">
            请上传（.xls/.xlsx）格式Excel文件，大小不超过1MB。
          </div>
        </el-form-item>
        <el-form-item label="日志备注" prop="beizhu">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="form.beizhu" type="textarea" maxlength="300" placeholder="该备注为导入数据日志的备注信息，非必填项" />
          还可填写
          <span class="text-danger">{{ 300-form.beizhu.length }}</span> 个字符
        </el-form-item>
      </el-form>
      <div v-if="dataList&&dataList.length>0">
        <div class="text-right">
          <div class="form-title text-danger">
            <i class="el-icon-document padding-right-5" />日志
          </div>
        </div>
        <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" fit stripe>
          <el-table-column min-width="110" prop="name" label="教师姓名" show-overflow-tooltip />
          <el-table-column min-width="110" prop="account" label="教师工号" show-overflow-tooltip />
          <el-table-column min-width="150" prop="add_time" label="导入时间" show-overflow-tooltip />
          <el-table-column min-width="110" prop="num" label="导入数量" show-overflow-tooltip />
          <el-table-column min-width="150" prop="beizhu" label="备注" show-overflow-tooltip />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import { inlet, impLog, imdel } from "@/api/downloadImport";
import Upload from "@/components/plupload/index";
import waves from "@/directive/waves"; // 水波纹指令
import { publicMixin } from "@/api/mixins";

const form = {
  beizhu: "",
  file: {
    url: "",
    name: "",
    path: ""
  }
};

export default {
  name: "ImportData",
  components: { Upload },
  directives: { waves },
  mixins: [publicMixin],
  props: ["import_text"],
  data() {
    return {
      importDialog: false,
      innerVisible: false,
      listLoading: false,
      loading: false,
      dataList: [],
      url: "",
      form: JSON.parse(JSON.stringify(form)),
      import_id: "9",
      import_url: "/admin-api/addcjinfo",
      import_name: "各科成绩样表.xlsx",
      percent: 0,
      status: "success",
      //限制上传文件
      filters: {
        max_file_size: "1mb",
        mime_types: [{ title: "Excel file", extensions: "xls,xlsx" }]
      },
      rules: {}
    };
  },
  methods: {
    //上传进度
    CB_UploadProgress(file) {
      this.percent = file.percent;
    },
    //上传成功后的回调
    CB_GetFileInfo(res) {
      if (res && res.url) {
        this.form.file = res;
        this.percent = 0;
        this.status = "success";
        this.$forceUpdate();
        this.$message({ message: "上传成功", type: "success" });
      } else {
        this.form.file.name = "";
        this.form.file.url = "";
        this.form.file.path = "";
        this.percent = 0;
        this.status = "exception";
        this.$message({ message: "上传失败", type: "error" });
      }
    },
    //刪除
    file_close() {
      this.form.file.name = "";
      this.form.file.url = "";
      this.form.file.path = "";
    },
    handleKeep() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.hid) {
            this.$set(this.form, 'hid', this.hid)
          }
          inlet(this.import_url, this.form)
            .then(rs => {
              this.loading = false;
              this.$parent.getData();
              this.log();
              this.form.file.name = "";
              this.form.file.url = "";
              this.form.file.path = "";
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    log() {
      this.listloading = true;
      impLog(this.import_id)
        .then(rs => {
          this.dataList = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    del(id) {
      this.$confirm(
        "删除后不可恢复，确定要删除导入数据吗？",
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          imdel({ id: id })
            .then(res => {
              this.$message.success("删除成功");
              this.$parent.getData();
              this.log();
            })
            .catch(() => { });
        })
        .catch(() => { });
    },
    //打开
    openDialog() {
      this.url =
        (this.API_ROOT || "http://a.gsdzone.net/tjxsy/api") +
        '/public/static/cjjbqkinfo.xlsx'
      this.log()
    },
    //关闭
    handleClose() {
      this.form = JSON.parse(JSON.stringify(form))
      this.$refs["form"].resetFields()
      this.importDialog = false
    }
  }
};
</script>
<style scoped>
.hr_label {
  height: 1px;
  padding: 0;
  margin: 0;
  border: 0;
  background-color: #e2e2e2;
}
.form-title {
  display: block;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
  font-size: 15px;
  font-weight: 300;
  margin-bottom: 15px;
}
.bzl {
  color: #0e94f8;
  background: #e7f4fe;
  background-image: initial;
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: rgb(231, 244, 254);
  border-color: #9fd4fc;
  height: 36px;
}
</style>

