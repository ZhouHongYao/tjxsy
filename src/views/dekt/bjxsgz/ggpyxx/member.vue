<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogMember" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="15vh" @close="handleClose" @open="openDialog">
    <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-table :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe>
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column min-width="110" prop="s_name" label="学生姓名" show-overflow-tooltip />
        <el-table-column min-width="110" prop="s_account" label="学号" />
        <el-table-column min-width="110" prop="phone" label="联系电话" />
        <el-table-column min-width="110" prop="szbj" label="所在班级" show-overflow-tooltip />
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { getMember } from "@/api/dekt/bjxsgz/ggpyxx";
import { publicMixin } from "@/api/mixins";

export default {
  directives: { elDragDialog, waves },
  mixins: [publicMixin],
  props: ["dialogMember", "szzb", "tbid"],
  data() {
    return {
      title: "所在小组成员",
      listloading: false,
      dataList: []
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
  },
  methods: {
    openDialog() {
      this.getRead();
    },
    //获取详情
    getRead() {
      this.listloading = true;
      getMember(this.szzb, this.tbid)
        .then(rs => {
          this.dataList = rs || [];
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //关闭
    handleClose() {
      this.dataList = []
      this.$emit("CB-member", false);
    }
  }
};
</script>
