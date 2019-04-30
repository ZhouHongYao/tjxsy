<template>
  <el-dialog :visible="dialogDetail" :fullscreen="isphone()" title="问卷详情" width="780px" top="10vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-row v-loading="loading" element-loading-text="数据载入中">
        <h3 class="text-center">{{ form.title || '' }}</h3>
        <el-col v-if="form.note" class="margin-bottom-20">
          <div v-html="Trim(form.note)" />
        </el-col>
        <el-col>
          <el-form ref="form" :model="form" label-width="110px" label-position="top" class="padding-left-20 padding-right-10">
            <div v-for="(item,index) in form.list" :key="index">
              <el-form-item :label="(item.xh)+'.'+item.tm">
                <div class="padding-left-10">
                  <span v-if="item.lx==1">
                    <el-input v-model="item.result" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" placeholder="请填写" />
                  </span>
                  <span v-if="item.lx==2">
                    <el-radio-group v-model="item.result">
                      <el-radio v-for="(v,i) in item.options" :key="i" :label="v.id" class="no-margin margin-bottom-10 " style="width:100%">{{ v.note }}</el-radio>
                    </el-radio-group>
                  </span>
                  <span v-if="item.lx==3">
                    <el-checkbox-group v-model="item.result">
                      <el-checkbox v-for="v in item.options" :key="v.id" :label="v.id" class="no-margin margin-bottom-10" style="width:100%">{{ v.note }}</el-checkbox>
                    </el-checkbox-group>
                  </span>
                </div>
              </el-form-item>
            </div>
            <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" />
          </el-form>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import LogDetail from "@/components/LogDetail";
import { ztdyRead, xsdyRead } from "@/api/xgdy/ztdy";
import { publicMixin } from "@/api/mixins";

const form = {

};

export default {
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogDetail", "zid", "type", "data"],
  data() {
    return {
      loading: false,
      form: form
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.8 - 100
    })
  },
  methods: {
    //打开
    openDialog() {
      if (this.zid) {
        this.getRead();
      } else {
        this.form = JSON.parse(JSON.stringify(this.data));
        if (this.form.list) {
          this.form.list.sort(function(a, b) {
            return parseInt(a.xh) - parseInt(b.xh);
          });
          for (let i = 0; i < this.form.list.length; i++) {
            if (this.form.list[i].lx == 2) {
							this.form.list[i].result = false
						}
						if (this.form.list[i].lx == 3) {
							this.form.list[i].result = []
            }
          }
				}
      }
    },
    //读取数据
    getRead() {
      this.loading = true;
      if (this.type && this.type == 'edit') {
        xsdyRead(this.zid)
          .then(rs => {
            this.form = rs;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        ztdyRead(this.zid)
          .then(rs => {
            this.form = rs;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    //关闭
    handleClose() {
      this.form = form;
      this.$emit("CB-dialogDetail", false);
    }
  }
};
</script>
<style scoped>
.hr_balel {
  border: 0;
  background-color: #e4e4e4;
  height: 1px;
}
</style>

