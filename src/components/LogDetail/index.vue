<template>
  <div class="form-title margin-top-10">
    <div class="margin-bottom-10">
      <b style="font-size: 15px;">审核信息</b>
    </div>
    <div>
      <p class="margin-bottom-5">
        审核结果：
        <span :class="value.shenhe_status | logStatus| logColor">{{ value.shenhe_status | logStatus| logTitle }}</span>
        <slot />
      </p>
      <p v-if="value.shenhe_status==3" class="margin-bottom-5 margin-top-5">
        退回原因：
        <span class="text-muted">{{ value.shenhelog[0].beizhu }}</span>
      </p>
      <el-button type="text" style="font-size: 15px;" @click="innerVisible = true">审核日志
        <i class="el-icon-search" />
      </el-button>
    </div>
    <el-dialog v-el-drag-dialog :visible.sync="innerVisible" width="650px" top="30vh" title="审核日志" append-to-body>
      <el-table :data="value.shenhelog" fit stripe>
        <el-table-column min-width="100" prop="name" label="审核人" show-overflow-tooltip />
        <el-table-column min-width="100" prop="title" label="审核职务" show-overflow-tooltip />
        <el-table-column min-width="140" prop="add_time" label="审核时间" show-overflow-tooltip />
        <el-table-column min-width="100" prop="status" label="审核结果" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.status|logStatus|logColor">{{ scope.row.status | logStatus | logTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" prop="beizhu" label="退回原因/备注" show-overflow-tooltip />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽

export default {
  directives: { elDragDialog },
  props: ["value"],
  data() {
    return {
      innerVisible: false
    };
  }
};
</script>
<style scoped>
p {
  font-size: 15px;
}
</style>
