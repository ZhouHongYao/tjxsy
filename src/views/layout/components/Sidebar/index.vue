<template>
  <div>
    <div :style="{'width': sidebar.opened? '235px':'36px' }" class="naver-container">
      <div class="margin-right-10">
        <img src="../../../../assets/images/defalut.png" alt="">
      </div>
      <div :style="{'display': sidebar.opened? 'block':'none' }"> 综合素质评价系统</div>
    </div>
    <scroll-bar style="overflow-y: auto">
      <el-menu :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" :unique-opened="true" class="margin-top-50" mode="vertical" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
        <sidebar-item :routes="routers"/>
      </el-menu>
    </scroll-bar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["sidebar"]),
    ...mapState({
      routers: state => state.routers
    }),
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>

<style lang="scss" scoped>
.naver-container {
  position: fixed;
  background-color: #1e2e42;
  z-index: 1002;
  height: 50px;
  line-height: 50px;
  top: 0;
  left: 0px;
  font-size: 17px;
  color: aliceblue;
  padding-left: 5px;
  transition-duration: 0.28s;
  div {
    float: left;
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-top: 10px;
  }
}
</style>
