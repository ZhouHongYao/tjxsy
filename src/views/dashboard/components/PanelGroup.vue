<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/grxx/jbxx')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">学生基本信息</div>
          <count-to :start-val="0" :end-val="data.jbxx" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/dekt/xsgbll')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="gbll" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">学生干部履历</div>
          <count-to :start-val="0" :end-val="data.xsgbll" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/bjxsgz/ggpyxx')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="ggpy" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">骨干培养学校</div>
          <count-to :start-val="0" :end-val="data.ggpyxx" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/lxxnjy/ldxxdj')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="rdsq" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">入党申请</div>
          <count-to :start-val="0" :end-val="data.rdsq" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/xyxx/kcxm')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="kcxm" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">科创项目</div>
          <count-to :start-val="0" :end-val="data.kcxm" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/xyxx/xkjs')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="xkjs" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">学科竞赛</div>
          <count-to :start-val="0" :end-val="data.xkjs" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/xyxx/gjjlxx')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="gjjl" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">国际交流学习</div>
          <count-to :start-val="0" :end-val="data.gjjlxx" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="goto('/rcgl/jssq')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="home" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">教室借用申请</div>
          <count-to :start-val="0" :end-val="data.jsjysq" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { top } from "@/api/dashboard";

export default {
  components: {
    CountTo
  },
  data() {
    return {
      data: {
        ggpyxx: 0,
        gjjlxx: 0,
        jbxx: 0,
        jsjysq: 0,
        kcxm: 0,
        rdsq: 0,
        xkjs: 0,
        xsgbll: 0,
        ztdy: 0
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.loading = true
      top()
        .then(rs => {
          this.data = rs
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        });
    },
    goto(name) {
      this.$router.push({
        path: name
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      text-align: right;
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
