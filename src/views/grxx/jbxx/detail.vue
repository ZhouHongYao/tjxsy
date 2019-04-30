<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据载入中">
    <div class="filter-container">
      <h3>{{ $route.meta.title }} <span v-if="form.shenhe_status && form.shenhe_status != 1" :class="form.shenhe_status | logStatus| logColor" class="shenhe_span">{{ form.shenhe_status | logStatus| logTitle }}</span>
        <div v-if="currentRole()" class="pull-right margin-bottom-10">
          <span v-if="form.can_time && form.can_time.is_can">
            <el-button v-waves type="primary" icon="el-icon-edit" @click="edit()">编辑</el-button>
          </span>
          <span v-if="!form.can_time || (!form.can_time.is_can && !form.can_time.time)" class="text-danger font-90">尚未开放填写</span>
          <span v-if="form.can_time && !form.can_time.is_can && form.can_time.time" class="text-danger font-90">填写时间: {{ form.can_time.time }}</span>
        </div>
        <goBack v-if="!currentRole()" style="margin-left: 10px;" class="pull-right" />
      </h3>
      <el-form label-suffix="：" label-width="120px" class="margin-left-20 margin-top-30">
        <el-row class="margin-bottom-20">
          <div class="avatar-wrapper" @click="dialogVisible=true">
            <img :src="form.url+form.head" :onerror="defaultImg" class="user-avatar">
          </div>
          <div class="avatar-info">
            <div>姓名：{{ form.name }}</div>
            <div class="padding-top-20">学号：{{ form.account }}</div>
          </div>
        </el-row>
        <hr class="hr_balel">
        <el-row class="margin-top-10">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="性别">{{ form.sex ? form.sex==1 ? '男' : '女' : '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="身份证">{{ form.sfz || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="手机号">{{ form.phone || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="所在班级">{{ form.szbj || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="导师">{{ form.dsxm || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="所在书院">{{ form.xueyuan_title || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="政治面貌">{{ form.zzmm || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="生源地">{{ form.jiguan || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="民族">{{ form.nation || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="高中毕业学校">{{ form.gzbyxx || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="是否申请入党">{{ form.is_sqrd ? form.is_sqrd ==2 ? '是' : '否' : '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label-width="170px" label="是否列为入党积极分子">{{ form.is_rdjjfz ? form.is_rdjjfz ==2 ? '是' : '否' : '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="寝室地址">{{ form.qsdz || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="家庭地址">{{ form.jtdz || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="邮编">{{ form.yb || '--' }}</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="户口所在地">{{ form.hkszd || '--' }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="form.jtcy" border style="width: 100%">
        <el-table-column label="家庭成员信息">
          <el-table-column prop="gx" label="关系" width="50" />
          <el-table-column prop="name" label="姓名" width="110" />
          <el-table-column prop="jkzk" label="健康状况" />
          <el-table-column prop="gzdw" label="工作单位" />
          <el-table-column prop="lxfs" label="联系方式" />
        </el-table-column>
      </el-table>
      <el-table v-loading="hjqkLoading" :data="hjqkData" border style="width: 100%" class="margin-top-30" element-loading-text="数据载入中">
        <el-table-column label="获奖情况（大学期间）">
          <el-table-column prop="title" label="奖项名称" />
          <el-table-column prop="time" label="获奖时间" width="110" />
          <el-table-column prop="level_title" label="获奖级别" />
          <el-table-column prop="bjdw" label="颁奖单位" />
        </el-table-column>
      </el-table>
    </div>
    <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import goBack from "@/components/goBack";
import LogDetail from "@/components/LogDetail";
import { jbxxRead, hjqkList } from "@/api/grxx/jbxx";
import { publicMixin } from "@/api/mixins";

const form = {
  head: "",
  account: "", //学号
  name: "", //姓名
  sex: null, //性别
  phone: "", //手机号
  szbj: "", //所在班级
  dsxm: "", //导师
  xueyuan: null, //所在书院
  xueyuan_title: "",
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
  hjqk: [], //获奖情况（大学期间）
  can_time: { //学生开放填写时间

  }
};
export default {
  name: "jbxx",
  directives: {
    waves
  },
  components: { goBack, LogDetail },
  mixins: [publicMixin],
  data() {
    return {
      defaultImg: 'this.src="' + require("@/assets/images/photos/1.png") + '"',
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      hjqkLoading: false,
      hjqkData: [],
      //限制上传文件
      filters: {
        max_file_size: "10mb",
        mime_types: [
          { title: "Image files", extensions: "jpg,jpeg,png" }
        ]
      }
    };
  },
  activated() {
    this.getRead()
    this.getHjqk()
  },
  methods: {
    //编辑
    edit() {
      this.$router.push({
        name: "jbxxEdit"
      });
    },
    //获取数据
    getRead() {
      this.loading = true;
      let id = this.$route.query.id || 's'
      jbxxRead(id)
        .then(rs => {
          this.form = rs;
          this.form.jtcy = this.form.jtcy.filter(item => item.name);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.shenhe_span {
  font-size: 15px;
  padding-left: 10px;
}
.hr_balel {
  border: 0;
  background-color: #e4e4e4;
  height: 1px;
}
.avatar-wrapper {
  float: left;
  // cursor: pointer;
  .user-avatar {
    background: #e5e5e5;
    padding: 4px;
    width: 115px;
    height: 140px;
  }
}
.avatar-info {
  margin-left: 40px;
  float: left;
  padding-top: 25px;
  font-size: 15px;
}
</style>
