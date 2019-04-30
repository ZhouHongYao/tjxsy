<template>
  <div v-loading="loading" :style="{'min-height':clientHeight +'px', 'overflow-y': 'hidden'}" element-loading-text="数据载入中" class="container">
    <div class="header-container">
      <h4>学生汇总信息
        <goBack class="pull-right" />
      </h4>
      <el-form label-suffix="：" label-width="100px">
        <el-row :gutter="30">
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="姓名" class="form_item">
              {{ form.jbxx.name ||'--' }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="学号" class="form_item">
              {{ form.jbxx.account ||'--' }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="性别" class="form_item">
              {{ form.jbxx.sex ? form.jbxx.sex == 1 ? '男' : '女' : '--' }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="所在班级" class="form_item">
              {{ form.jbxx.szbj ||'--' }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item label="联系电话" class="form_item">
              {{ form.jbxx.phone ||'--' }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :class="activeIndex=='1'?'text-primary':''" index="1">个人信息</el-menu-item>
        <el-menu-item :class="activeIndex=='2'?'text-primary':''" index="2">第二课堂 </el-menu-item>
        <el-menu-item :class="activeIndex=='3'?'text-primary':''" index="3">学业信息 </el-menu-item>
        <el-menu-item :class="activeIndex=='4'?'text-primary':''" index="4">一年总评 </el-menu-item>
        <el-menu-item :class="activeIndex=='5'?'text-primary':''" index="5">其他 </el-menu-item>
      </el-menu>
    </div>
    <el-collapse-transition>
      <div v-show="activeIndex=='1'">
        <el-card class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span>能力初评</span>
          </div>
          <div>
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('xxnl')">学习能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">学习兴趣：</span>{{ form.xxnl.xxxq || '--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">自学能力：</span>{{ form.xxnl.zxnl || '--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">终身学习：</span>{{ form.xxnl.zsxx || '--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('sjnl')">实践能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">执行能力：</span>{{ form.sjnl.zxnl || '--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">资源运用能力：</span>{{ form.sjnl.zyyynl || '--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">工程实践能力：</span>{{ form.sjnl.gcsjnl || '--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">工匠精神：</span>{{ form.sjnl.gjjs || '--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('cxnl')">创新能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">逻辑思维能力：</span>{{ form.cxnl.ljsw || '--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">辩证思维能力：</span>{{ form.cxnl.bzsw || '--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">创新意识：</span>{{ form.cxnl.cxys || '--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">顽强的意志品质：</span>{{ form.cxnl.yzpz || '--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('ldnl')">领导能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">表达能力：</span>{{ form.ldnl.bdnl || '--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">协作能力：</span>{{ form.ldnl.xznl || '--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">领袖意识：</span>{{ form.ldnl.lxys || '--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('ldnl')">跨文化能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">包容能力：</span>{{ form.kwhnl.brnl || '--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">语言能力：</span>{{ form.kwhnl.yynl || '--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">跨文化实施能力：</span>{{ form.kwhnl.kwhssnl || '--' }} 分</span>
            </div>
          </div>
        </el-card>
        <el-card v-if="form.zynh" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('zynh')">致一年后的自己</span>
          </div>
          <div>
            <p class="no-margin margin-bottom-10"><span class="left_laber">主题：</span> <span style="font-size:15px">{{ form.zynh.title }}</span></p>
            <p class="span_laber no-margin margin-bottom-10"><span class="left_laber">关键词：</span><span v-if="form.zynh.gjc" style="font-size:15px;padding-left: 4px;">{{ form.zynh.gjc.join(" ，") }}</span> <span v-else>--</span></p>
            <div class="span_laber no-margin margin-bottom-10">
              <div class="left_laber">正文：</div>
              <div class="content" v-html="Trim(form.zynh.content)" />
            </div>
          </div>
        </el-card>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="activeIndex=='2'">
        <el-card v-if="form.xsgbll&&form.xsgbll.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('xsgbll')">学生干部履历</span>
          </div>
          <el-table :data="form.xsgbll" highlight-current-row fit stripe>
            <el-table-column type="index" align="center" width="45" fixed="left" />
            <el-table-column min-width="110" prop="status" label="审核状态" sortable fixed="left">
              <template slot-scope="d">
                <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
                </span>
                <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
                  <i class="el-icon-question text-primary pointer" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="dw" label="单位" show-overflow-tooltip sortable />
            <el-table-column min-width="200" prop="zw" label="职务" show-overflow-tooltip />
            <el-table-column min-width="200" prop="start_time" label="任职时间" show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.start_time || '' }} ~ {{ d.row.end_time || '' }}
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="zmr" label="证明人" show-overflow-tooltip />
            <el-table-column min-width="300" prop="gzgk" label="特色亮点工作概况" show-overflow-tooltip />
            <el-table-column min-width="120" prop="file" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.ggpyxx&&form.ggpyxx.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('ggpyxx')">骨干培养学校</span>
          </div>
          <el-table :data="form.ggpyxx" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="status" label="审核状态" sortable fixed="left">
              <template slot-scope="d">
                <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
                </span>
                <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
                  <i class="el-icon-question text-primary pointer" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable />
            <el-table-column min-width="110" prop="kcbh" label="课程编号" sortable />
            <el-table-column min-width="130" prop="type" label="所属课程类型" show-overflow-tooltip sortable />
            <el-table-column min-width="80" prop="xf" label="学分" show-overflow-tooltip sortable />
            <el-table-column min-width="270" prop="times" label="课程时间" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="fz_name" label="负责老师" show-overflow-tooltip sortable />
            <el-table-column min-width="140" prop="pxdx_title" label="培训对象" show-overflow-tooltip />
            <el-table-column min-width="140" prop="zysc" label="作业上传方式" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.zysc ? d.row.zysc == 2 ? '组长' : '个人' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="is_zz" label="组长">
              <template slot-scope="d">
                {{ d.row.is_zz ? '是': '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="250" prop="kcfk" label="课程反馈" show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.kcfk || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="120" prop="file" label="课程作业" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  课程作业
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.gzzj&&form.gzzj.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('gzzj')">工作总结</span>
          </div>
          <el-table :data="form.gzzj" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="xq" label="学期" sortable>
              <template slot-scope="d">
                {{ d.row.xq ? d.row.xq == 1 ? '第一学期' : '第二学期' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="bjzw" label="班级职务" show-overflow-tooltip />
            <el-table-column min-width="200" prop="gzzj" label="工作总结" show-overflow-tooltip />
            <el-table-column min-width="200" prop="bzrpy" label="班主任评语" show-overflow-tooltip />
          </el-table>
        </el-card>
        <el-card v-if="form.hdzz&&form.hdzz.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('hdzz')">活动组织情况</span>
          </div>
          <el-table :data="form.hdzz" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="200" prop="title" label="活动名称" show-overflow-tooltip sortable />
            <el-table-column min-width="250" prop="cdrw" label="个人承担主要任务" show-overflow-tooltip sortable />
            <el-table-column min-width="250" prop="hdfgm" label="活动覆盖面" show-overflow-tooltip />
            <el-table-column min-width="250" prop="hdcx" label="活动成效" show-overflow-tooltip />
            <el-table-column min-width="120" prop="file" label="活动照片" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  活动照片
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.cxhd&&form.cxhd.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('cxhd')">创新活动</span>
          </div>
          <el-table :data="form.cxhd" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="活动名称" show-overflow-tooltip sortable />
            <el-table-column min-width="270" prop="times" label="活动时间" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column min-width="140" prop="num" label="活动人数" sortable>
              <template slot-scope="d">
                {{ d.row.bmrs || 0 }} / {{ d.row.num || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="150" prop="address" label="活动地点" show-overflow-tooltip sortable />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="qd_time" label="签到状态" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span :class=" d.row.qd_time? 'text-success' : 'text-muted'">
                  {{ d.row.qd_time ? '已签到' : '未签到' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column min-width="200" prop="hdfk" label="活动反馈" show-overflow-tooltip />
            <el-table-column min-width="200" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.xywh&&form.xywh.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('xywh')">校园文化</span>
          </div>
          <el-table :data="form.xywh" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="活动名称" show-overflow-tooltip sortable />
            <el-table-column min-width="270" prop="times" label="活动时间" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column min-width="140" prop="num" label="活动人数" sortable>
              <template slot-scope="d">
                {{ d.row.bmrs || 0 }} / {{ d.row.num || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="150" prop="address" label="活动地点" show-overflow-tooltip sortable />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="qd_time" label="签到状态" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span :class=" d.row.qd_time? 'text-success' : 'text-muted'">
                  {{ d.row.qd_time ? '已签到' : '未签到' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column min-width="200" prop="hdfk" label="活动反馈" show-overflow-tooltip />
            <el-table-column min-width="200" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.shsj&&form.shsj.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('shsj')">社会实践</span>
          </div>
          <el-table :data="form.shsj" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="活动名称" show-overflow-tooltip sortable />
            <el-table-column min-width="270" prop="times" label="活动时间" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column min-width="140" prop="num" label="活动人数" sortable>
              <template slot-scope="d">
                {{ d.row.bmrs || 0 }} / {{ d.row.num || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="150" prop="address" label="活动地点" show-overflow-tooltip sortable />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="qd_time" label="签到状态" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span :class=" d.row.qd_time? 'text-success' : 'text-muted'">
                  {{ d.row.qd_time ? '已签到' : '未签到' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column min-width="200" prop="hdfk" label="活动反馈" show-overflow-tooltip />
            <el-table-column min-width="200" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.zyfw&&form.zyfw.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('zyfw')">志愿服务</span>
          </div>
          <el-table :data="form.zyfw" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="活动名称" show-overflow-tooltip sortable />
            <el-table-column min-width="270" prop="times" label="活动时间" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column min-width="140" prop="num" label="活动人数" sortable>
              <template slot-scope="d">
                {{ d.row.bmrs || 0 }} / {{ d.row.num || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="150" prop="address" label="活动地点" show-overflow-tooltip sortable />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="qd_time" label="签到状态" show-overflow-tooltip sortable>
              <template slot-scope="d">
                <span :class=" d.row.qd_time? 'text-success' : 'text-muted'">
                  {{ d.row.qd_time ? '已签到' : '未签到' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column min-width="200" prop="hdfk" label="活动反馈" show-overflow-tooltip />
            <el-table-column min-width="200" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.ldxxdj" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('ldxxdj')">入党申请信息</span>
            <span :class="form.ldxxdj.status|logStatus|logColor" class="margin-left-20">{{ form.ldxxdj.status|logStatus|logTitle }}
            </span>
            <el-tooltip v-if="form.ldxxdj.status==3 && form.ldxxdj.shenhe" :content="form.ldxxdj.shenhe" placement="right" effect="light">
              <i class="el-icon-question text-primary pointer" />
            </el-tooltip>
          </div>
          <el-form label-suffix="：" label-width="180px">
            <el-row :gutter="30">
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="提交入党申请书时间" class="form_item">
                  {{ form.ldxxdj.tjrd_time || '--' }}
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="参加入党启蒙培训时间" class="form_item">
                  <span v-if="form.ldxxdj.cjpx_time && form.ldxxdj.cjpx_time[0]">{{ form.ldxxdj.cjpx_time[0] }} ~ {{ form.ldxxdj.cjpx_time[1] }}</span>
                  <span v-else>--</span>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="推优时间" class="form_item">
                  {{ form.ldxxdj.ty_time || '--' }}
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="确定为入党积极分子时间" class="form_item">
                  {{ form.ldxxdj.rdjj_time || '--' }}
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="提交思想汇报时间1" class="form_item">
                  {{ form.ldxxdj.tjsx_time1 || '--' }}
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="提交思想汇报时间2" class="form_item">
                  {{ form.ldxxdj.tjsx_time2 || '--' }}
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="提交思想汇报时间3" class="form_item">
                  {{ form.ldxxdj.tjsx_time3 || '--' }}
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="提交思想汇报时间4" class="form_item">
                  {{ form.ldxxdj.tjsx_time4 || '--' }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="beizhu" class="form_item">
                  <div v-html="Trim(form.ldxxdj.beizhu)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card v-if="form.qmpxb" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('qmpxb')">入党启蒙培训班</span>
          </div>
          <div>
            <p>
              <span>结业考核成绩：{{ form.qmpxb.info ? form.qmpxb.info.jykhcj||'--' : '--' }} </span>
              <span class="margin-left-30">现实表现成绩：{{ form.qmpxb.info ? form.qmpxb.info.xsbxcj||'--' : '--' }} </span>
              <span class="margin-left-30">考核结果：
                <span :class="form.qmpxb.info&&form.qmpxb.info.khjg ? form.qmpxb.info.khjg==2 ? 'text-success' :'text-danger' :'' ">{{ form.qmpxb.info&&form.qmpxb.info.khjg ? form.qmpxb.info.khjg==2 ? '通过' : '不通过' : '--' }} </span>
              </span>
            </p>
            <el-table :data="form.qmpxb.data" highlight-current-row fit stripe>
              <el-table-column align="center" type="index" width="45" />
              <el-table-column label="培训组号">
                <template slot="header" slot-scope="scope">
                  <span>培训组号： {{ form.qmpxb.info && form.qmpxb.info.group_id ? form.qmpxb.info.group_id : '' }} {{ form.qmpxb.info && form.qmpxb.info.is_zz == 2 ? '（组长）' : '' }}</span>
                </template>
                <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable />
                <el-table-column min-width="220" prop="times" label="课程时间" show-overflow-tooltip>
                  <template slot-scope="d">
                    <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="80" prop="xs" label="学时" show-overflow-tooltip />
                <el-table-column min-width="110" prop="kcbh" label="课程编号" show-overflow-tooltip sortable />
                <el-table-column min-width="180" prop="address" label="课程地点" show-overflow-tooltip />
                <el-table-column min-width="220" prop="info.xd" label="心得/内容" show-overflow-tooltip />
                <el-table-column min-width="130" prop="info.file.path" label="照片/材料" show-overflow-tooltip>
                  <template slot-scope="d">
                    <a v-if="d.row.info && d.row.info.file && d.row.info.file.url" :href="d.row.info.file.url" class="text-primary" target="_blank">
                      <i class="el-icon-document" />
                      照片/材料
                    </a>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card v-if="form.lxxnjz&&form.lxxnjz.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('lxxnjz')">理想信念讲座</span>
          </div>
          <el-table :data="form.lxxnjz" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" />
            <el-table-column label="讲座名称" min-width="160" prop="title" show-overflow-tooltip sortable />
            <el-table-column label="讲座时间" min-width="270" prop="times" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column label="讲座地点" min-width="150" prop="address" show-overflow-tooltip />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column label="反馈" min-width="200" prop="hdfk" show-overflow-tooltip />
            <el-table-column min-width="110" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-collapse v-if="form.xyzp" v-model="xyzpNames" class="body-container padding-left-20">
          <div class="padding-top-20 padding-bottom-10">
            <span class="text-primary pointer" @click="goto('xyzp')">学业自评</span>
          </div>
          <el-collapse-item title="学习方法和习惯发生哪些改变？" name="1">
            <div v-html="Trim( form.xyzp.ffxg )" />
          </el-collapse-item>
          <el-collapse-item title="学习困难出现在哪里？" name="2">
            <div v-html="Trim( form.xyzp.xxkn )" />
          </el-collapse-item>
          <el-collapse-item title="擅长哪些科目？感兴趣的科目？非常不擅长的科目？" name="3">
            <div v-html="Trim( form.xyzp.sckm )" />
          </el-collapse-item>
          <el-collapse-item title="大一学年学业成绩自我满意度评分" name="4">
            {{ form.xyzp.zwpf || '--' }} <span v-if="form.xyzp.zwpf">分</span>
          </el-collapse-item>
        </el-collapse>
        <el-card v-if="form.jszz&&form.jszz.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('jszz')">接受资助</span>
          </div>
          <el-table :data="form.jszz" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="zzmc" label="资助名称" sortable />
            <el-table-column min-width="200" prop="zzdw" label="资助单位" show-overflow-tooltip />
            <el-table-column min-width="120" prop="zzje" label="资助金额（元）" show-overflow-tooltip />
            <el-table-column min-width="130" prop="type" label="校内/校外" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.type ? d.row.type==2 ? '校内' : '校外' :'--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="150" prop="beizhu" label="备注" show-overflow-tooltip />
          </el-table>
        </el-card>
        <el-card v-if="form.zwcz&&form.zwcz.zwcz" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('zwcz')">自我成长</span>
          </div>
          <div>
            <el-table :data="drzwData" border style="width: 100%" class="margin-bottom-30">
              <el-table-column align="center" type="index" width="45" fixed="left" />
              <el-table-column label="担任班级或学生会干部">
                <template slot="header" slot-scope="scope">
                  <span>担任班级或学生会干部</span>
                </template>
                <el-table-column prop="zw" label="职务" min-width="80" show-overflow-tooltip />
                <el-table-column prop="start_time" label="任职时间" min-width="200" show-overflow-tooltip>
                  <template slot-scope="d">
                    <span v-if="d.row.start_time">{{ d.row.start_time }} ~ {{ d.row.end_time }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="dw" label="单位" min-width="150" show-overflow-tooltip />
                <el-table-column prop="zmr" label="证明人" />
              </el-table-column>
            </el-table>
            <el-form label-position="top">
              <el-form-item label="大一学年在哪些方面获得了较大的能力提升？">
                <div v-html="Trim( form.zwcz.zwcz )" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card v-if="form.fwjt" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('fwjt')">服务集体</span>
          </div>
          <el-form>
            <el-form-item>
              <div v-html="Trim( form.fwjt )" />
            </el-form-item>
          </el-form>
        </el-card>
        <el-collapse v-if="form.fwjx" v-model="fwjxNames" class="body-container padding-left-20">
          <div class="padding-top-20 padding-bottom-10">
            <span class="text-primary pointer" @click="goto('fwjx')">服务家乡</span>
          </div>
          <el-collapse-item title="在承担家庭责任方面做了哪些努力？" name="1">
            <div v-html="Trim( form.fwjx.jtzr )" />
          </el-collapse-item>
          <el-collapse-item title="对家乡的发展有哪些关注？" name="2">
            <div v-html="Trim( form.fwjx.jxgz )" />
          </el-collapse-item>
          <el-collapse-item title="在服务家乡发展方面做了哪些工作？" name="3">
            <div v-html="Trim( form.fwjx.fwjx )" />
          </el-collapse-item>
        </el-collapse>
        <el-card v-if="form.gegj" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('gegj')">感恩国家</span>
          </div>
          <el-form label-position="top">
            <el-form-item label="接受资助后的感想（对老师、学校、社会、国家层面的）">
              <div v-html="Trim( form.gegj )" />
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="form.sqyr&&form.sqyr.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('sqyr')">社区育人</span>
          </div>
          <el-table :data="form.sqyr" highlight-current-row fit stripe>
            <el-table-column type="index" align="center" width="45" fixed="left" />
            <el-table-column min-width="110" prop="ym" label="年月" sortable />
            <el-table-column min-width="120" prop="szqsl" label="所在寝室楼" show-overflow-tooltip />
            <el-table-column min-width="110" prop="qsh" label="寝室号" />
            <el-table-column min-width="180" prop="ypf" label="月寝室卫生检查评分" sortable />
            <el-table-column min-width="200" prop="mfqs_time" label="评选为模范寝室的时间">
              <template slot-scope="d">
                {{ d.row.mfqs_time || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="130" prop="wzyd" label="违章用电时间" show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.wzyd || '--' }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="activeIndex=='3'">
        <el-collapse v-if="form.cjjbqk" v-model="cjjbqkNames" class="body-container padding-left-20">
          <div class="padding-top-20 padding-bottom-10">
            <span class="text-primary pointer" @click="goto('cjjbqk')">成绩基本情况</span> / <span class="text-primary pointer" @click="goto('xycjfx')">成绩分析</span>
          </div>
          <el-collapse-item title="已修得学分" name="1">
            <el-form label-suffix="：">
              <el-row>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="总学分" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.zxf || '--':'--' }}</el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="平均绩点" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.jd || '--':'--' }}</el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="通识必修课" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.tsbxk || '--':'--' }}</el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="通识选修课" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.tsxxk || '--':'--' }}</el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="大类基础课程" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.dljck || '--':'--' }}</el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="专业基础课" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.zyjck || '--':'--' }}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="各科成绩" name="2">
            <el-table :data="form.cjjbqk.cjData" border style="width: 100%">
              <el-table-column prop="km" label="科目" />
              <el-table-column prop="xf" label="学分" />
              <el-table-column prop="cj" label="成绩" />
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="学业成绩分析" name="3">
            <el-form label-suffix="：">
              <el-row>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="班级名次" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.bjmc || '--':'--' }}</el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-form-item label="年级名次" class="form_item">{{ form.cjjbqk.cjjbqk ? form.cjjbqk.cjjbqk.njmc || '--':'--' }}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <el-card v-if="form.kcxm&&form.kcxm.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('kcxm')">科创项目</span>
          </div>
          <el-table :data="form.kcxm" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="status" label="审核状态" sortable fixed="left">
              <template slot-scope="d">
                <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
                </span>
                <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
                  <i class="el-icon-question text-primary pointer" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="项目名称" min-width="150" sortable show-overflow-tooltip />
            <el-table-column prop="type" label="项目类别" min-width="120" sortable show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.type_title || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="hjdj" label="获奖等级" min-width="120" sortable show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.hjdj_title || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="xmjs" label="项目介绍" min-width="200" show-overflow-tooltip />
            <el-table-column prop="zdjs" label="指导老师" min-width="120" show-overflow-tooltip />
            <el-table-column prop="member" label="项目成员" min-width="220" show-overflow-tooltip />
            <el-table-column prop="lx_time" label="立项年月" width="120" sortable />
            <el-table-column prop="sjbg_file" label="实践报告" width="120">
              <template slot-scope="d">
                <a v-if="d.row.sjbg_file && d.row.sjbg_file.url" :href="d.row.sjbg_file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  实践报告
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="hjzs_file" label="获奖证书" width="120">
              <template slot-scope="d">
                <a v-if="d.row.hjzs_file && d.row.hjzs_file.url" :href="d.row.hjzs_file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  获奖证书
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.xkjs&&form.xkjs.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('xkjs')">学科竞赛</span>
          </div>
          <el-table :data="form.xkjs" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="status" label="审核状态" sortable fixed="left">
              <template slot-scope="d">
                <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
                </span>
                <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
                  <i class="el-icon-question text-primary pointer" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="竞赛名称" min-width="150" sortable show-overflow-tooltip />
            <el-table-column prop="jsdj" label="竞赛等级" min-width="120" sortable show-overflow-tooltip />
            <el-table-column prop="hjdj" label="获奖等级" min-width="120" sortable show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.hjdj_title || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="xmjs" label="竞赛介绍" min-width="200" show-overflow-tooltip />
            <el-table-column prop="hj_time" label="获奖时间" width="120" sortable />
            <el-table-column prop="sjbg_file" label="实践报告" width="120">
              <template slot-scope="d">
                <a v-if="d.row.sjbg_file && d.row.sjbg_file.url" :href="d.row.sjbg_file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  实践报告
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="hjzs_file" label="获奖证书" width="120">
              <template slot-scope="d">
                <a v-if="d.row.hjzs_file && d.row.hjzs_file.url" :href="d.row.hjzs_file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  获奖证书
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.ltjzxx&&form.ltjzxx.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('ltjzxx')">学术论坛讲座学习</span>
          </div>
          <el-table :data="form.ltjzxx" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" />
            <el-table-column label="讲座名称" min-width="160" prop="title" show-overflow-tooltip sortable />
            <el-table-column label="讲座时间" min-width="270" prop="times" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column label="讲座地点" min-width="150" prop="address" show-overflow-tooltip />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column label="反馈" min-width="200" prop="hdfk" show-overflow-tooltip />
            <el-table-column min-width="110" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.bykt&&form.bykt.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('bykt')">博雅课堂</span>
          </div>
          <el-table :data="form.bykt" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" />
            <el-table-column label="讲座名称" min-width="160" prop="title" show-overflow-tooltip sortable />
            <el-table-column label="讲座时间" min-width="270" prop="times" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column label="讲座地点" min-width="150" prop="address" show-overflow-tooltip />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column label="反馈" min-width="200" prop="hdfk" show-overflow-tooltip />
            <el-table-column min-width="110" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-if="form.gjjlxx&&form.gjjlxx.length>0" class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('gjjlxx')">国际交流学习</span>
          </div>
          <el-table :data="form.gjjlxx" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="status" label="审核状态" sortable="custom" fixed="left">
              <template slot-scope="d">
                <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
                </span>
                <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
                  <i class="el-icon-question text-primary pointer" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column min-width="150" prop="xmmc" label="项目名称" sortable="custom" show-overflow-tooltip />
            <el-table-column min-width="270" prop="times" label="学习时间" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="150" prop="gj" label="国家" show-overflow-tooltip />
            <el-table-column min-width="150" prop="dw" label="单位" show-overflow-tooltip />
            <el-table-column min-width="200" prop="xmjs" label="项目介绍" show-overflow-tooltip />
            <el-table-column prop="file" label="交流报告" width="120">
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  交流报告
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="activeIndex=='4'">
        <el-card class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span>一年总评/能力自评（第一学期）</span>
          </div>
          <div>
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('xxnlzp')">学习能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">学习兴趣：</span>{{ form.xxnlzp[0] ? form.xxnlzp[0].xxxq || '--':'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">自学能力：</span>{{ form.xxnlzp[0] ? form.xxnlzp[0].zxnl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">终身学习：</span>{{ form.xxnlzp[0] ? form.xxnlzp[0].zsxx || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('sjnlzp')">实践能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">执行能力：</span>{{ form.sjnlzp[0] ? form.sjnlzp[0].zxnl || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">资源运用能力：</span>{{ form.sjnlzp[0] ? form.sjnlzp[0].zyyynl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">工程实践能力：</span>{{ form.sjnlzp[0] ? form.sjnlzp[0].gcsjnl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">工匠精神：</span>{{ form.sjnlzp[0] ? form.sjnlzp[0].gjjs || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('cxnlzp')">创新能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">逻辑思维能力：</span>{{ form.cxnlzp[0] ? form.cxnlzp[0].ljsw || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">辩证思维能力：</span>{{ form.cxnlzp[0] ? form.cxnlzp[0].bzsw || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">创新意识：</span>{{ form.cxnlzp[0] ? form.cxnlzp[0].cxys || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">顽强的意志品质：</span>{{ form.cxnlzp[0] ? form.cxnlzp[0].yzpz || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('ldnlzp')">领导能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">表达能力：</span>{{ form.ldnlzp[0] ? form.ldnlzp[0].bdnl || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">协作能力：</span>{{ form.ldnlzp[0] ? form.ldnlzp[0].xznl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">领袖意识：</span>{{ form.ldnlzp[0] ? form.ldnlzp[0].lxys || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('kwhnlzp')">跨文化能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">包容能力：</span>{{ form.kwhnlzp[0] ? form.kwhnlzp[0].brnl || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">语言能力：</span>{{ form.kwhnlzp[0] ? form.kwhnlzp[0].yynl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">跨文化实施能力：</span>{{ form.kwhnlzp[0] ? form.kwhnlzp[0].kwhssnl || '--' :'--' }} 分</span>
            </div>
          </div>
        </el-card>
        <el-card class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span>一年总评/能力自评（第二学期）</span>
          </div>
          <div>
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('xxnlzp')">学习能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">学习兴趣：</span>{{ form.xxnlzp[1] ? form.xxnlzp[1].xxxq || '--':'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">自学能力：</span>{{ form.xxnlzp[1] ? form.xxnlzp[1].zxnl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">终身学习：</span>{{ form.xxnlzp[1] ? form.xxnlzp[1].zsxx || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('sjnlzp')">实践能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">执行能力：</span>{{ form.sjnlzp[1] ? form.sjnlzp[1].zxnl || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">资源运用能力：</span>{{ form.sjnlzp[1] ? form.sjnlzp[1].zyyynl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">工程实践能力：</span>{{ form.sjnlzp[1] ? form.sjnlzp[1].gcsjnl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">工匠精神：</span>{{ form.sjnlzp[1] ? form.sjnlzp[1].gjjs || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('cxnlzp')">创新能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">逻辑思维能力：</span>{{ form.cxnlzp[1] ? form.cxnlzp[1].ljsw || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">辩证思维能力：</span>{{ form.cxnlzp[1] ? form.cxnlzp[1].bzsw || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">创新意识：</span>{{ form.cxnlzp[1] ? form.cxnlzp[1].cxys || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">顽强的意志品质：</span>{{ form.cxnlzp[1] ? form.cxnlzp[1].yzpz || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('ldnlzp')">领导能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">表达能力：</span>{{ form.ldnlzp[1] ? form.ldnlzp[1].bdnl || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">协作能力：</span>{{ form.ldnlzp[1] ? form.ldnlzp[1].xznl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">领袖意识：</span>{{ form.ldnlzp[1] ? form.ldnlzp[1].lxys || '--' :'--' }} 分</span>
            </div>
            <hr class="margin-bottom-20">
            <p class="no-margin margin-bottom-20 t-laber text-primary" @click="goto('kwhnlzp')">跨文化能力</p>
            <div class="span_laber margin-bottom-20"><span style="color: rgb(143, 147, 153)">包容能力：</span>{{ form.kwhnlzp[1] ? form.kwhnlzp[1].brnl || '--' :'--' }} 分
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">语言能力：</span>{{ form.kwhnlzp[1] ? form.kwhnlzp[1].yynl || '--' :'--' }} 分</span>
              <span class="span_laber padding-left-10"><span style="color: rgb(143, 147, 153)">跨文化实施能力：</span>{{ form.kwhnlzp[1] ? form.kwhnlzp[1].kwhssnl || '--' :'--' }} 分</span>
            </div>
          </div>
        </el-card>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="activeIndex=='5'">
        <el-card class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('jssq')">教室借用申请</span>
          </div>
          <el-table :data="form.jssq" element-loading-text="数据载入中" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="status" label="审核状态" sortable fixed="left">
              <template slot-scope="d">
                <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
                </span>
                <el-tooltip v-if="d.row.status!=1 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
                  <i class="el-icon-question text-primary pointer" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column min-width="160" prop="title" label="教室名称" show-overflow-tooltip sortable />
            <el-table-column min-width="140" prop="address" label="教室地点" show-overflow-tooltip sortable />
            <el-table-column min-width="200" prop="times" label="申请时段" show-overflow-tooltip sortable>
              <template slot-scope="d">
                {{ d.row.time }} {{ d.row.times[0] }} ~ {{ d.row.times[1] }}
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="yt" label="用途" show-overflow-tooltip sortable />
          </el-table>
        </el-card>
        <el-card class="box-card body-container" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="text-primary pointer" @click="goto('ztdy')">主题调研</span>
          </div>
          <el-table :data="form.ztdy" element-loading-text="数据载入中" highlight-current-row fit stripe>
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="调研名称" show-overflow-tooltip sortable />
          </el-table>
        </el-card>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import goBack from "@/components/goBack";
import { hzxx } from "@/api/grxx/jbxx";
import { publicMixin } from "@/api/mixins";

const form = {
  jbxx: {},
  cxnl: {},
  kwhnl: {},
  ldnl: {},
  sjnl: {},
  xxnl: {},
  zynh: {},
  cxnlzp: {},
  kwhnlzp: {},
  ldnlzp: {},
  sjnlzp: {},
  xxnlzp: {},
  zynhzp: {},
  qmpxb: {
    info: {},
    data: []
  },
  lxxnjz: [],
  xyzp: {},
  fwjx: {}
};
const drzwData = []
export default {
  name: "jbxx",
  directives: {
    waves
  },
  components: { goBack },
  mixins: [publicMixin],
  data() {
    return {
      defaultImg: 'this.src="' + require("@/assets/images/photos/1.png") + '"',
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      drzwData: JSON.parse(JSON.stringify(drzwData)),
      activeIndex: '1',
      activeNames: ['1', '2', '3', '4', '5'],
      fwjxNames: ['1', '2', '3'],
      xyzpNames: ['1', '2', '3', '4'],
      cjjbqkNames: ['1', '2', '3'],
      //限制上传文件
      filters: {
        max_file_size: "10mb",
        mime_types: [
          { title: "Image files", extensions: "jpg,jpeg,png" }
        ]
      }
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight + 135
    }
  },
  activated() {
    this.activeIndex = '1'
    this.getRead()
  },
  destroyed() {
    this.form = JSON.parse(JSON.stringify(form))
    this.drzwData = JSON.parse(JSON.stringify(drzwData))
  },
  methods: {
    //编辑
    edit() {
      this.$router.push({
        name: "jbxxEdit"
      });
    },
    // 切换
    handleSelect(key, keyPath) {
      this.activeIndex = key
    },
    //跳转
    goto(name) {
      this.$router.push({
        name: name,
        query: { account: this.form.jbxx.account }
      })
    },
    //获取数据
    getRead() {
      this.loading = true;
      let id = this.$route.query.id || 's'
      hzxx(id)
        .then(rs => {
          this.form = rs;
          let data = rs.xsgbll || []
          this.drzwData = data.concat(rs.xsgbs || [])
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss">
.container {
  background-color: rgb(240, 242, 245);
  .header-container {
    background: #fff;
    padding: 20px 20px 0px 20px;
  }
  .form_item {
    margin-bottom: 10px !important;
  }
  hr {
    background-color: #ebeef5;
    height: 1px;
    border: none;
  }
  .body-container {
    background: #fff;
    margin: 20px;
    border-radius: 5px;
  }
  .span_laber {
    font-size: 14px;
  }
  .t-laber {
    font-size: 14px;
    cursor: pointer;
  }
  .left_laber {
    width: 60px;
    display: inline-block;
    vertical-align: top;
    color: rgb(143, 147, 153);
  }
  .content {
    display: inline-block;
		font-size: 15px;
    width: calc(100%-60px);
  }
  .el-collapse-item__header {
    color: rgb(143, 147, 153) !important;
  }
}
</style>
