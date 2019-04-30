<template>
  <div v-loading="listloading" class="createPost-container" element-loading-text="数据载入中">
    <el-form ref="form" :model="form" :rules="rules" label-suffix="：" label-width="100px">
      <sticky :z-index="10" class-name="sub-navbar">
        <el-button-group>
          <el-button v-loading="loading" v-waves type="primary" icon="el-icon-success" @click="submitForm('save')">
            提交
          </el-button>
          <el-button v-loading="loading" v-waves v-if="$route.query.type=='review'" type="success" @click="submitForm('review')">
            <svg-icon icon-class="shield" class="margin-right-10" />保存并审核通过
          </el-button>
          <el-button v-loading="loading" v-waves v-if="$route.query.type=='review'" type="danger" icon="el-icon-edit" @click="back()">
            退回修改
          </el-button>
        </el-button-group>
        <goBack style="margin-left: 10px;" />
      </sticky>
      <div class="createPost-main-container">
        <!-- <Plupload :image-url="form.head ? form.url+form.head :''" :filters="filters" :image_percent="percent" type="photo" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
        <p>上传照片{{ form.url }}{{ form.head }}</p>
        <div class="el-upload__tip" style="line-height: 25px;">
          只能上传jpg/png/jpeg格式图片，且大小不超过10MB。
        </div>
        <hr class="hr_balel"> -->

        <el-row :gutter="30" class="margin-top-30">
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="姓名" prop="name" class="form_item">
              <el-input v-model="form.name" :disabled="currentRole()" maxlength="20" autosize placeholder="请填写姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="学号" prop="account" class="form_item">
              <el-input v-model="form.account" :disabled="currentRole()" maxlength="20" autosize placeholder="请填写学号" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="性别" prop="sex" class="form_item">
              <el-radio-group v-model="form.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="身份证" prop="sfz" class="form_item">
              <el-input v-model="form.sfz" maxlength="18" autosize placeholder="请填写身份证号码" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="手机号" prop="phone" class="form_item">
              <el-input v-model="form.phone" maxlength="11" autosize placeholder="请填写手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="所在班级" prop="szbj" class="form_item">
              <el-input v-model="form.szbj" autosize placeholder="请填写所在班级" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="导师" prop="dsxm" class="form_item">
              <el-input v-model="form.dsxm" autosize placeholder="请填写导师姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="所在书院" prop="xueyuan" class="form_item">
              <el-input v-model="form.xueyuan" autosize placeholder="请填写所在书院" clearable />
              <!-- <el-select v-model="form.xueyuan" placeholder="请选择所在书院" style="width: 100%;" class="filter-item" filterable clearable>
                <el-option v-for="item in xueyuanData" :key="item.yxdm" :label="item.yxmc" :value="item.yxdm" />
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="政治面貌" class="form_item" prop="zzmm">
              <el-select v-model="form.zzmm" placeholder="请选择政治面貌" style="width: 100%;" class="filter-item" clearable>
                <el-option v-for="item in zzmmData" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="生源地" prop="jiguan" class="form_item">
              <el-input v-model="form.jiguan" autosize placeholder="请填写生源地" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="民族" class="form_item" prop="nation">
              <el-select v-model="form.nation" placeholder="请选择民族" style="width: 100%;" class="filter-item" clearable>
                <el-option v-for="item in nations" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="高中毕业学校" label-width="115px" prop="gzbyxx" class="form_item">
              <el-input v-model="form.gzbyxx" autosize placeholder="请填写高中毕业学校" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="寝室地址" label-width="115px" prop="qsdz" class="form_item">
              <el-input v-model="form.qsdz" autosize placeholder="请填写寝室地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="家庭地址" label-width="125px" prop="jtdz" class="form_item">
              <el-input v-model="form.jtdz" autosize placeholder="请填写家庭地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="邮编" prop="yb" class="form_item">
              <el-input v-model="form.yb" autosize placeholder="请填写邮编" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="户口所在地" label-width="115px" prop="hkszd" class="form_item">
              <el-input v-model="form.hkszd" autosize placeholder="请填写户口所在地" clearable />
            </el-form-item>
          </el-col>

          <el-table :data="form.jtcy" border style="width: 100%">
            <el-table-column label="家庭成员信息">
              <el-table-column prop="gx" label="关系" width="120">
                <template slot-scope="d">
                  <el-select v-model="d.row.gx" placeholder="请选择" style="width: 100%;" size="mini">
                    <el-option v-for="item in gxData" :key="item" :label="item" :value="item" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="150">
                <template slot-scope="d">
                  <el-input v-model="d.row.name" placeholder="姓名" size="mini" clearable />
                </template>
              </el-table-column>
              <el-table-column prop="jkzk" label="健康状况">
                <template slot-scope="d">
                  <el-input v-model="d.row.jkzk" placeholder="健康状况" size="mini" clearable />
                </template>
              </el-table-column>
              <el-table-column prop="gzdw" label="工作单位">
                <template slot-scope="d">
                  <el-input v-model="d.row.gzdw" placeholder="工作单位" size="mini" clearable />
                </template>
              </el-table-column>
              <el-table-column prop="lxfs" label="联系方式">
                <template slot-scope="d">
                  <el-input v-model="d.row.lxfs" placeholder="联系方式" size="mini" clearable />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>

          <el-table v-loading="hjqkLoading" v-if="$route.query.id || currentRole()" :data="hjqkData" border style="width: 100%" class="margin-top-30 margin-bottom-30" element-loading-text="数据载入中">
            <el-table-column label="获奖情况（大学期间）">
              <template slot="header" slot-scope="scope">
                <span>获奖情况（大学期间）</span>
                <el-button v-loading="loading" v-waves type="success" size="mini" icon="el-icon-circle-plus-outline" class="pull-right" @click="addHjqk()"> 添加 </el-button>
              </template>
              <el-table-column prop="title" label="奖项名称" width="150" />
              <el-table-column prop="time" label="获奖时间" width="100" />
              <el-table-column prop="level_title" label="级别" />
              <el-table-column prop="bjdw" label="颁奖单位" />
              <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button v-waves size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row.id)">编辑</el-button>
                  <el-button v-waves size="mini" type="danger" plain icon="el-icon-delete" @click="deleteData(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" />
        </el-row>
      </div>
    </el-form>

    <!-- 获奖情况 添加、编辑 -->
    <Hjqk :hjqk-dialog="hjqkDialog" :hjqkid="hjqkid" :sid="$route.query.id" @CB-hjqk="CB_hjqk" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import waves from "@/directive/waves"; // 水波纹指令
import { publicMixin } from "@/api/mixins";
import { jbxxRead, jbxxEdit, jbxxSh, hjqkList, hjqkDel } from "@/api/grxx/jbxx";
import Plupload from "@/components/plupload/index";
import LogDetail from "@/components/LogDetail";
import goBack from "@/components/goBack";
import Hjqk from "./hjqk";

const form = {
  account: "", //学号
  name: "", //姓名
  sex: null, //性别
  sfz: "", //身份证
  phone: "", //手机号
  szbj: "", //所在班级
  dsxm: "", //导师
  xueyuan: null, //所在书院
  zzmm: null, //政治面貌
  jiguan: "", //籍贯
  nation: "", //民族
  gzbyxx: "", //高中毕业学校
  is_sqrd: null, //是否申请入党
  is_rdjjfz: null, //是否列为入党积极分子
  qsdz: "", //寝室地址
  jtdz: "", //家庭地址
  yb: "", //邮编
  hkszd: "", //户口所在地
  jtcy: [],
  hjqk: []//获奖情况（大学期间）
};

const gxData = ["父亲", "母亲", "其他"]
export default {
  directives: { waves },
  components: { MDinput, Sticky, Plupload, goBack, Hjqk, LogDetail },
  mixins: [publicMixin],
  data() {
    return {
      listloading: false,
      loading: false,
      jtcy: [{
        gx: "", name: '', jkzk: '', gzdw: '', lxfs: ''
      },
      {
        gx: "", name: '', jkzk: '', gzdw: '', lxfs: ''
      }],
      gxData,
      form: JSON.parse(JSON.stringify(form)),
      hjqkData: [],
      hjqkLoading: false,
      //获奖情况
      hjqkDialog: false,
      hjqkid: null,
      percent: 0,
      filters: {
        //限制上传文件
        max_file_size: "10MB",
        mime_types: [
          { title: "Image files", extensions: "jpg,gif,png" }]
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        account: [
          {
            required: true,
            message: "请输入学号",
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change"
          }
        ],
        phone: [
          {
            pattern: /^1[2-9]\d{9}$/,
            message: "请填写正确的11位手机号码！",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "请填写正确的邮箱！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: mapState({
    nations: state => state.nations,
    xueyuanData: state => state.xueyuanData,
    zzmmData: state => state.zzmmData
  }),
  activated() {
    if (this.$route.query.id || currentRole()) {
      this.getInfo();
      this.getHjqk();
    }
  },
  deactivated() {
    this.form = form;
    this.$refs["form"].resetFields();
  },
  methods: {
    // 获取详情
    getInfo() {
      this.listloading = true;
      let id = this.$route.query.id || 's'
      jbxxRead(id)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //获取获奖情况数据
    getHjqk() {
      this.hjqkLoading = true;
      hjqkList({ sid: this.$route.query.id || '' })
        .then(rs => {
          this.hjqkLoading = false;
          this.hjqkData = rs || [];
        })
        .catch(() => {
          this.hjqkLoading = false;
        });
    },
    //添加获奖情况
    addHjqk() {
      this.hjqkDialog = true
      this.hjqkid = null
    },
    //编辑获奖情况
    handleEdit(id) {
      this.hjqkid = id
      this.hjqkDialog = true
    },
    //获奖情况弹窗回调
    CB_hjqk(val) {
      if (val) {
        this.getHjqk()
      }
      this.hjqkDialog = false
      this.hjqkid = null
    },
    //删除获奖
    deleteData(id) {
      this.$confirm("删除后不可恢复，确定删除该获奖情况吗?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          this.hjqkLoading = true;
          hjqkDel({ id: id })
            .then(rs => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getHjqk();
            })
            .catch(() => {
              this.hjqkLoading = false;
            });
        })
        .catch(() => { });
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
        this.form.head = res.url;
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
      this.form.head = "";
      this.$forceUpdate();
    },
    // 保存 & 审核
    submitForm(type) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let method = this.form.id ? "put" : "post";
          if (type && type == 'review') {
            this.form.status = 2
          }
          jbxxEdit(this.form, method)
            .then(rs => {
              this.$message({
                message: "操作成功！",
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
              jbxxSh(
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
          this.backout()
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(() => { });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .hr_balel {
      border: 0;
      background-color: #e4e4e4;
      height: 1px;
    }
    .form_item {
      margin-bottom: 40px !important;
      height: 36px;
    }
    .label_height {
      height: 36px !important;
    }
    .time {
      width: 100%;
    }
  }
}
</style>

