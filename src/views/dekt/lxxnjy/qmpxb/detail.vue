<template>
  <el-dialog v-el-drag-dialog :visible="dialogDetail" :fullscreen="isphone()" title="培训详情" width="780px" top="10vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <keep-alive>
        <kcList v-if="sid" :sid="sid"/>
      </keep-alive>
    </div>

  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import kcList from "./component/kc";
import { publicMixin } from "@/api/mixins";

export default {
  directives: { elDragDialog },
  components: { kcList },
  mixins: [publicMixin],
  props: ["dialogDetail", "sid"],
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.8 - 170
    })
  },
  methods: {
    openDialog() {

		},
    //关闭
    handleClose() {
      this.$emit("CB-detail", false);
    }
  }
};
</script>
