<template>
  <el-dialog :visible="dialogStatus" :fullscreen="isphone()" title="团学活动详情" top="0" width="480px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
    <div :style="{ 'height': isphone() ? 'auto' :clientHeight +'px'}">
      <el-row>
        <el-form v-loading="loading" label-suffix="：" label-width="130px" element-loading-text="数据载入中">
          <el-col :span="24">
            <el-form-item label="活动名称">
              {{ form.title || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动类型">
              {{ form.type | typeTitle }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报名截止时间">
              {{ form.bmjz_time || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动日期">
              <span v-if="form.times && form.times[0]"> {{ form.times[0] }} ~ {{ form.times[1] }}</span>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动人数">
              {{ form.num || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动地点">
              {{ form.address || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table :data="form.member" border style="width: 100%" class="margin-top-10">
              <el-table-column label="组织者名单">
                <template slot="header" slot-scope="scope">
                  <span>组织者名单</span>
                </template>
                <el-table-column prop="name" label="姓名" width="100" show-overflow-tooltip />
                <el-table-column prop="account" label="学号" width="110" />
                <el-table-column prop="sex" label="性别">
                  <template slot-scope="d">
                    {{ d.row.sex ? d.row.sex ==1 ? '男' : '女' :'--' }}
                  </template>
                </el-table-column>
                <el-table-column prop="szbj" label="所在班级" />
              </el-table-column>
            </el-table>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { publicMixin } from "@/api/mixins";
import { hdglRead } from "@/api/dekt/txhdsj/hdgl";

const form = {
  title: null, //活动名称
  type: null, //活动类型
  times: null, //活动日期,
  num: null, //活动人数
  address: "", //活动地点
  member: []
};
const typeData = [{ id: 1, title: '创新活动' }, { id: 2, title: '校园文化' }, { id: 3, title: '社会实践' }, { id: 4, title: '志愿服务' }]

export default {
  filters: {
    typeTitle: function(value) {
      if (!value) return '--'
      let item = typeData.find(v => v.id == value)
      return item ? item.title : '--'
    }
  },
  mixins: [publicMixin],
  props: ["dialogStatus", "hdId"],
  data() {
    return {
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      typeData
    }
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight + 105;
    }
  },
  methods: {
    //打开
    openDialog() {
      this.getRead()
    },
    //关闭
    handleClose() {
      this.$emit("CB-detail", false);
    },
    //读取数据
    getRead() {
      this.loading = true;
      hdglRead(this.hdId)
        .then(rs => {
          this.form = rs;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

