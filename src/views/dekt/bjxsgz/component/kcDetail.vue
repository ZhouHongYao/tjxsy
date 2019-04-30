<template>
  <el-row>
    <el-form ref="kcInfo" :model="kcInfo" label-suffix="：" label-width="130px">
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="课程名称">
          {{ kcInfo.title }}
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="课程编号">
          {{ kcInfo.kcbh }}
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="所属课程类型">
          {{ kcInfo.type }}
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="学分">
          {{ kcInfo.xf }}
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="课程日期">
          {{ kcInfo.time }}
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="课程容量">
          {{ kcInfo.kcrl }}
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="课程地点">
          {{ kcInfo.address }}
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <el-form-item label="课程负责老师">
          {{ kcInfo.name }}
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>
<script>
import { tbkcRead } from "@/api/dekt/bjxsgz/tbkc";

const kcInfo = {
  title: "测试课程", //课程名称
  kcbh: "11111",	//课程编号
  type: "测试课程", //所属课程类型
  xf: 2, //学分
  kid: "",	//课程id
  time: "周五第二节", //课程日期
  kcrl: '20', // 课程容量
  uid: null,
  address: "测试", //课程地点
  name: "xxxx"	//课程负责老师
};
export default {
  props: ['kid'],
  data() {
    return {
      loading: false,
      kcInfo: kcInfo
    };
  },
  created() {
    console.log(1, this.kid)
    this.getRead();
  },
  methods: {
    //读取数据
    getRead() {
      this.loading = true;
      tbkcRead(this.kid)
        .then(rs => {
          this.kcInfo = rs || {};
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

