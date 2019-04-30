<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="700px" top="10vh" @close="handleClose" @open="openDialog">
    <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="form.title" placeholder="请填写活动名称" clearable />
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择活动类型">
            <el-option v-for="item in typeData" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="bmjz_time">
          <el-date-picker v-model="form.bmjz_time" class="filter-item" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="活动报名截止时间" align="right" />
        </el-form-item>
        <el-form-item label="活动日期" prop="times">
          <el-date-picker :unlink-panels="true" v-model="form.times" class="filter-item" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetimerange" start-placeholder="活动开始时间" end-placeholder="活动结束时间" align="right" />
        </el-form-item>
        <el-form-item label="活动人数" prop="num">
          <el-input v-model="form.num" placeholder="请填写活动人数" clearable />
        </el-form-item>
        <el-form-item label="活动地点" prop="address">
          <el-input v-model="form.address" placeholder="请填写活动地点" clearable />
        </el-form-item>
        <el-table :data="form.member" border style="width: 100%" class="margin-top-30">
          <el-table-column label="组织者名单">
            <template slot="header" slot-scope="scope">
              <span>组织者名单</span>
              <el-button v-loading="loading" v-waves type="success" size="mini" icon="el-icon-circle-plus-outline" class="pull-right" @click="addMember()"> 添加 </el-button>
            </template>
            <el-table-column align="center" type="index" width="45" />
            <el-table-column prop="name" label="姓名" width="100" show-overflow-tooltip />
            <el-table-column prop="account" label="学号" width="110" />
            <el-table-column prop="sex" label="性别">
              <template slot-scope="d">
                {{ d.row.sex ? d.row.sex ==1 ? '男' : '女' :'--' }}
              </template>
            </el-table-column>
            <el-table-column prop="szbj" label="所在班级" />
            <el-table-column align="right" label="操作" width="80" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="d">
                <el-button v-waves size="mini" type="danger" plain icon="el-icon-delete" @click="del(d.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
    </div>
    <el-dialog :visible="memberStatus" :close-on-click-modal="false" :close-on-press-escape="false" title="添加组织者" width="500px" top="30vh" append-to-body @close="close" @open="open">
      <el-form ref="form" :rules="rules" :model="form" label-width="130px" label-suffix="：" @submit.native.prevent>
        <el-form-item label="组织者姓名" prop="name">
          <el-input v-model="name" placeholder="请填写学生姓名(按回车键确认)" clearable @blur="check(name)" @keyup.enter.native="check(name)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="loading" :disabled="item ? false:'' " icon="el-icon-success" type="primary" @click="createData">提交</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { hdglEdit, hdglRead } from "@/api/dekt/txhdsj/hdgl";
import { checkTeacher, publicMixin } from "@/api/mixins";
import { read } from "@/api/index";

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
  directives: { elDragDialog, waves },
  mixins: [checkTeacher, publicMixin],
  props: ["dialogState", "hdId"],
  data() {
    return {
      title: "添加团学活动",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      typeData,
      //组织者Dialog
      memberStatus: false,
      name: "", //学生姓名
      item: null, //学生信息
      rules: {
        title: [
          {
            required: true,
            message: "请填写活动名称！",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择活动类型！",
            trigger: "change"
          }
        ],
        bmjz_time: [
          {
            required: true,
            message: "请选择报名截止时间！",
            trigger: "change"
          }
        ],
        times: [
          {
            required: true,
            message: "请选择活动时间！",
            trigger: "change"
          }
        ],
        num: [
          {
            required: true,
            message: "请填写活动人数！",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请填写活动地点！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.8 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.hdId) {
        this.title = "编辑团学活动";
        this.getRead();
      }
    },
    async changeStudent(name) {
      return new Promise((resolve, reject) => {
        let url = '/admin-api/s-check/' + name;
        read(url).then(rs => {
          var data = rs;
          if (rs.length == 1) {
            return resolve(rs[0])
          } else if (rs.length > 1) {
            let hrl = '<div class="padding-top-20">';
            rs.forEach(item => {
              hrl = hrl + '<label class="el-radio"><input type="radio" name="singleDoorCt" value="' + item.id + '" class="el-radio__input"/>' + item.name + '(' + item.account + ')' + '</label>'
            });
            hrl = hrl + '</div>';
            this.$alert(hrl, {
              dangerouslyUseHTMLString: true,
              title: "确认学生工号",
              confirmButtonText: '确定'
            }).then((rs) => {
              let flag = false;
              var radio = document.getElementsByName("singleDoorCt");
              radio.forEach(item => {
                if (item.checked) {
                  let value = item.value;
                  let arr = data.find(it => {
                    return it.id == value
                  })
                  flag = true
                  return resolve(arr)
                }
              });
              if (!flag) {
                this.$message({
                  message: "请选择学号！",
                  type: "error"
                });
              }
            }).catch(() => {
              return reject({
                'err': ''
              })
            });
          } else {
            return reject({
              'err': ''
            })
          }
        }).catch(() => {
          return reject({
            'err': ''
          })
        });
      })
    },
    check() {
      if (!this.name) return
      this.changeStudent(this.name).then(rs => {
        this.item = rs
      }).catch(() => {
        this.item = null;
      });
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.hdId ? "put" : "post";
          this.loading = true;
          hdglEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-hdgl", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    getRead() {
      this.listloading = true;
      hdglRead(this.hdId)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //设置组织者名单
    addMember() {
      this.memberStatus = true
    },
    close() {
      this.clearMember()
      this.memberStatus = false
    },
    open() { },
    //设置组织者Dialog 确认
    createData() {
      if (this.form.member.find(v => v.account == this.item.account)) {
        this.$message({
          message: "请勿重复添加！",
          type: "warning"
        });
        this.clearMember()
        return
      }
      this.form.member.push(JSON.parse(JSON.stringify(this.item)))
      this.clearMember()
      this.memberStatus = false
    },
    // 删除组织者
    del(index) {
      this.form.member.splice(index, 1);
    },
    //清除验证消息
    clearMember() {
      this.item = null
      this.name = ""
    },
    //清空数据
    clear() {
      this.title = "添加团学活动";
      this.clearMember()
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-hdgl", false);
    }
  }
};
</script>
