<template>
  <div v-loading="listLoading" class="app-container" element-loading-text="数据载入中">
    <stuInfo v-if="$route.query.sid" :sid="$route.query.sid" />
    <div class="filter-container">
      <h3>{{ $route.meta.title }} <span v-if="form.shenhe_status && form.shenhe_status != 1" :class="form.shenhe_status | logStatus| logColor" class="shenhe_span">{{ form.shenhe_status | logStatus| logTitle }}</span></h3>
      <span />
    </div>
    <el-form label-suffix="：" label-width="180px" class="padding-top-20">
      <el-row :gutter="30">
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="提交入党申请书时间" class="form_item">
            {{ form.tjrd_time || '--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="参加入党启蒙培训时间" class="form_item">
            <span v-if="form.cjpx_time && form.cjpx_time[0]">{{ form.cjpx_time[0] }} ~ {{ form.cjpx_time[1] }}</span>
            <span v-else>--</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="推优时间" class="form_item">
            {{ form.ty_time || '--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="确定为入党积极分子时间" class="form_item">
            {{ form.rdjj_time || '--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="提交思想汇报时间1" class="form_item">
            {{ form.tjsx_time1 || '--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="提交思想汇报时间2" class="form_item">
            {{ form.tjsx_time2 || '--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="提交思想汇报时间3" class="form_item">
            {{ form.tjsx_time3 || '--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="提交思想汇报时间4" class="form_item">
            {{ form.tjsx_time4 || '--' }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="beizhu" class="form_item">
            <div v-html="Trim(form.beizhu)" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" style="margin-left:90px" />
        </el-col>

      </el-row>
    </el-form>
    <div v-if="$route.query.sid && !currentRole()">
      <hr class="hr_balel">
      <div class="filter-container">
        <h3>培训信息 </h3>
        <span />
      </div>
      <kcList :sid="$route.query.sid" type="ldxxdj" />
    </div>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import LogDetail from "@/components/LogDetail";
import kcList from "@/views/dekt/lxxnjy/qmpxb/component/kc";
import goBack from "@/components/goBack";
import { ldxxdjRead } from "@/api/dekt/lxxnjy/ldxxdj";
import { publicMixin } from "@/api/mixins";

const form = {
  tjrd_time: null, //提交入党申请书时间
  cjpx_time: null, //参加入党启蒙培训时间
  ty_time: null, //推优时间
  rdjj_time: null, //确定为入党积极分子时间
  tjsx_time1: null, //提交思想汇报时间1
  tjsx_time2: null, //提交思想汇报时间2
  tjsx_time3: null, //提交思想汇报时间3
  tjsx_time4: null, //提交思想汇报时间4
  beizhu: ""
};
export default {
  name: "ldxxdjDetail",
  directives: {
    waves
  },
  components: { stuInfo, LogDetail, kcList, goBack },
  mixins: [publicMixin],
  data() {
    return {
      listLoading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form))
    };
  },
  activated() {
    this.getRead()
  },
  methods: {
    //编辑
    edit() {
      this.$router.push({
        name: "ldxxdjEdit"
      });
    },
    //获取数据
    getRead() {
      this.listloading = true;
      let id = this.$route.query.id || 's'
      ldxxdjRead(id)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.p_bel {
  color: #3e4548 !important;
  font-size: 15px;
  font-weight: 600;
}
.hr_balel {
  border: 0;
  background-color: #e4e4e4;
  height: 1px;
}
</style>
