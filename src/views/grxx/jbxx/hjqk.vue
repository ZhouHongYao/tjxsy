<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="hjqkDialog" :close-on-click-modal="false" width="580px" top="20vh" @close="handleClose" @open="openDialog">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="获奖名称" prop="title">
          <el-input v-model="form.title" placeholder="获奖名称" clearable />
        </el-form-item>
        <el-form-item label="获奖时间" prop="time">
          <el-date-picker v-model="form.time" value-format="yyyy-MM" type="month" placeholder="请选择获奖时间" style="width:240px" />
        </el-form-item>
        <el-form-item label="获奖级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择获奖级别" style="width: 100%;" class="filter-item" filterable clearable>
            <el-option v-for="item in levelData" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="颁奖单位" prop="bjdw">
          <el-input v-model="form.bjdw" placeholder="颁奖单位" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { cateChild } from "@/api/system/category";
import { hjqkEdit, hjqkRead } from "@/api/grxx/jbxx";

const form = {
  title: "", //获奖名称
  time: null, //获奖时间
  level: null, //获奖级别
  bjdw: "" //颁奖单位
};
export default {
  directives: { elDragDialog, waves },
  props: ["hjqkDialog", "hjqkid", "sid"],
  data() {
    return {
      title: "添加获奖情况（大学期间）",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      levelData: [],
      rules: {
        title: [
          {
            required: true,
            message: "请填写获奖名称！",
            trigger: "blur"
          }
        ],
        time: [
          {
            required: true,
            message: "请选择评获奖时间！",
            trigger: "change"
          }
        ],
        level: [
          {
            required: true,
            message: "请选择获奖级别！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    openDialog() {
      if (this.hjqkid) {
        this.title = "编辑获奖情况（大学期间）"
        this.getInfo()
      }
      this.getLevel()
    },
    // 获取详情
    getInfo() {
      this.listloading = true;
      hjqkRead(this.hjqkid)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    // 提交
    handleKeep() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let method = this.form.id ? "put" : "post";
          this.form.sid = this.sid
          hjqkEdit(this.form, method)
            .then(rs => {
              this.$message({
                message: "操作成功！",
                type: "success"
              });
              this.loading = false;
              this.$emit("CB-hjqk", true)
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    //获奖等级
    getLevel() {
      cateChild(1)
        .then(rs => {
          this.levelData = rs
        })
        .catch(() => { });
    },
    //清空数据
    clear() {
      this.title = "添加获奖情况（大学期间）";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-hjqk", false);
    }
  }
};
</script>
