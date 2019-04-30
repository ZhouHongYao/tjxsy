import Vue from 'vue'

// 加载树形菜单
import VTree from 'vue-tree-halower'
//图片查看器
import PicViewer from "./components/PicViewer";
//分页
import Page from './components/Page';
//数据导出
import Download from './components/Download';
//数据导入
import ImportData from './components/ImportData';
//时间范围检索
import Datepicker from './components/Datepicker';
//是否填写检索
import TxSelete from './components/txSelete';

Vue.nextTick(() => {
  Vue.use(Page);
  Vue.use(Download);
  Vue.use(PicViewer);
  Vue.use(VTree);
	Vue.use(Datepicker);
	Vue.use(ImportData);
	Vue.use(TxSelete);
});
