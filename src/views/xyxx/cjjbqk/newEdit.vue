<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :close-on-click-modal="false" width="780px" top="15vh" @close="handleClose" @open="openDialog">
    <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="125px" element-loading-text="数据载入中">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="name" class="form_item">
              <el-input v-model="form.name" autosize placeholder="请填写学生姓名(按回车健确认)" clearable @blur="checkStu()" @keyup.enter.native="checkStu()" @change="clearStu()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总学分" prop="zxf" class="form_item">
              <el-input v-model.number="form.zxf" type="number" autosize placeholder="请填写总学分" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通识必修课" prop="tsbxk" class="form_item">
              <el-input v-model.number="form.tsbxk" type="number" autosize placeholder="请填写通识必修课学分" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通识选修课" prop="tsxxk" class="form_item">
              <el-input v-model.number="form.tsxxk" type="number" autosize placeholder="请填写通识选修课学分" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大类基础课程" prop="dljck" class="form_item">
              <el-input v-model.number="form.dljck" type="number" autosize placeholder="请填写大类基础课程学分" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业基础课" prop="zyjck" class="form_item">
              <el-input v-model.number="form.zyjck" type="number" autosize placeholder="请填写专业基础课学分" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平均绩点" prop="jd" class="form_item">
              <el-input v-model.number="form.jd" type="number" autosize placeholder="请填写平均绩点" clearable />
            </el-form-item>
          </el-col>
          <el-table :data="form.cjData" border style="width: 100%" class="margin-top-30">
            <el-table-column label="各科成绩">
              <template slot="header" slot-scope="scope">
                <span>各科成绩</span>
                <el-button v-loading="loading" v-waves type="success" size="mini" icon="el-icon-circle-plus-outline" class="pull-right" @click="addgkcj"> 添加 </el-button>
              </template>
              <el-table-column prop="km" label="科目" min-width="150" />
              <el-table-column prop="xf" label="学分" />
              <el-table-column prop="cj" label="成绩" />
              <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button v-waves size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row,scope.$index)">编辑</el-button>
                  <el-button v-waves size="mini" type="danger" plain icon="el-icon-delete" @click="deleteData(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
    </div>
    <!-- 各科成绩 添加、编辑 -->
    <Gkcj :gkcj-dialog="gkcjDialog" :gkcjitem="gkcjitem" :index="index" @CB-gkcj="CB_gkcj" />
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { cjjbqkEdit, cjjbqkRead } from "@/api/xyxx/cjjbqk";
import { checkTeacher, publicMixin } from "@/api/mixins";
import Gkcj from "./gkcj";

const form = {
  zxf: "", //总学分
  jd: "", //平均绩点
  tsbxk: "", //通识必修课
  tsxxk: "", //通识选修课
  dljck: "", //大类基础课程
  zyjck: "", //专业基础课,
  cjData: []
};
export default {
  directives: { elDragDialog, waves },
  components: { Gkcj },
  mixins: [checkTeacher, publicMixin],
  props: ["dialogState", "cjid"],
  data() {
    return {
      title: "添加成绩基本信息",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      //各科成绩Dialog
      gkcjDialog: false,
      gkcjitem: {},
      index: null,
      rules: {
        name: [
          {
            required: true,
            message: "请填写学生姓名！",
            trigger: "blur"
          }
        ],
        jd: [
          {
            required: true,
            message: "请填写平均绩点！",
            trigger: "blur"
          }
        ],
        tsbxk: [
          {
            required: true,
            message: "请填写通识必修课学分！",
            trigger: "blur"
          }
        ],
        dljck: [
          {
            required: true,
            message: "请填写大类基础课程学分！",
            trigger: "blur"
          }
        ],
        zyjck: [
          {
            required: true,
            message: "请填写专业基础课学分！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.cjid) {
        this.title = "编辑成绩基本信息";
        this.getRead();
      }
    },
    checkStu() {
      if (!this.form.name || this.form.sid) return
      this.changeStudent(this.form.name).then(rs => {
        this.form.sid = rs.sid
      }).catch(() => {
        this.form.sid = null;
      });
    },
    clearStu() {
      this.form.sid = null;
    },
    //获取数据
    getRead() {
      this.listloading = true;
      cjjbqkRead(this.cjid)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //添加各科成绩
    addgkcj() {
      this.gkcjDialog = true
      this.gkcjitem = null
      this.index = null
    },
    //编辑各科成绩
    handleEdit(row, index) {
      this.index = index
      this.gkcjDialog = true
      this.gkcjitem = row
    },
    //各科成绩弹窗回调
    CB_gkcj(val) {
      if (val && val.data) {
        if (val.index == null) {
          this.form.cjData = this.form.cjData ? this.form.cjData : []
          this.form.cjData.push(val.data)
        } else {
          this.$set(this.form.cjData, val.index, val.data)
        }
      }
      this.gkcjDialog = false
      this.gkcjitem = null
      this.index = null
    },
    //删除获奖
    deleteData(row) {
      this.$confirm("删除后不可恢复，确定删除该科目成绩吗?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          this.form.cjData.splice(this.form.cjData.findIndex(v => v == row), 1);
        })
        .catch(() => { });
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.cjid ? "put" : "post";
          this.loading = true;
          cjjbqkEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-cjjbqk", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    //清空数据
    clear() {
      this.title = "添加成绩基本信息";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-cjjbqk", false);
    }
  }
};
</script>
