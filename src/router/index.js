import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/**
* hidden: true                   如果`hidden：true`将不会显示在侧边栏中（默认为false）
* alwaysShow: true               如果设置为true，将始终显示根菜单，无论其子路由长度如何
*                                如果没有设置alwaysShow，只有多个路径下的孩子
*                                它将成为嵌套模式，否则不显示根菜单
* redirect: noredirect           如果`redirect：noredirect`不会在面包屑中重定向
* meta : {
    roles: ['1','2']             将控制页面角色是否拥有该权限
    title: 'title'               子菜单和面包屑中的名称显示
    icon: 'svg-name'             侧边栏中的图标显示,
    noCache: true                如果为true，则不会缓存页面（默认为false）
  }
**/
export const constantRouterMap = [{
		path: '/login',
		component: () =>
			import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/404',
		component: () =>
			import('@/views/errorPage/404'),
		hidden: true
	},
	{
		path: '/403',
		component: () =>
			import('@/views/errorPage/403'),
		hidden: true
	},
	{
		path: '/500',
		component: () =>
			import('@/views/errorPage/500'),
		hidden: true,
		name: "500"
	},
	{
		path: '',
		component: Layout,
		redirect: 'dashboard',
		children: [{
			path: 'dashboard',
			component: () =>
				import('@/views/dashboard/index'),
			name: 'dashboard',
			meta: {
				title: '面板',
				icon: 'dashboard',
				noCache: true
			}
		}]
	}
]

const AppPath = process.env.APP_PATH
export default new Router({
	mode: 'history', // require service support
	base: AppPath,
	//当开启history模式时，此项有效，实现返回上一个页面时默认将滚动条定位到原位置
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	},
	routes: constantRouterMap
})

export const asyncRouterMap = [{
		path: '/yearlist',
		name: 'yearlist',
		redirect: { name: 'year' },
		component: Layout,
		meta: { title: '学年及进度管理', icon: 'time' },
		children: [{
				path: 'year',
				name: 'year',
				component: () => import('@/views/year/index'),
				meta: { title: '学年及进度管理' }
			}]
	}, {
		path: '/grxx',
		name: 'grxx',
		redirect: { 'name': 'jbxx' },
		component: Layout,
		meta: { title: '个人信息', icon: 'user' },
		children: [{
			path: 'jbxx',
			name: 'jbxx',
			component: () => import('@/views/grxx/jbxx/public'),
			meta: { title: '基本信息' }
		}, {
			path: 'jbxxDetail',
			name: 'jbxxDetail',
			component: () => import('@/views/grxx/jbxx/detail'),
			meta: { title: '基本信息详情' },
			props: (route) => ({ query: route.query.q }),
			hidden: true
		}, {
			path: 'pool',
			name: 'pool',
			component: () => import('@/views/grxx/jbxx/pool'),
			meta: { title: '学生汇总信息详情' },
			props: (route) => ({ query: route.query.q }),
			hidden: true
		}, {
			path: 'jbxxEdit',
			name: 'jbxxEdit',
			component: () => import('@/views/grxx/jbxx/edit'),
			meta: { title: '编辑基本信息' },
			props: (route) => ({ query: route.query.q }),
			hidden: true
		}, {
			path: 'jbxxAdd',
			name: 'jbxxAdd',
			component: () => import('@/views/grxx/jbxx/edit'),
			meta: { title: '添加学生' },
			hidden: true
		}, {
			path: 'jbxxSh',
			name: 'jbxxSh',
			component: () => import('@/views/grxx/jbxx/edit'),
			meta: { title: '审核基本信息' },
			props: (route) => ({ query: route.query.q }),
			hidden: true
		}, {
			path: '/nlcp',
			name: 'nlcp',
			redirect: { 'name': 'xxnl' },
			component: () => import('@/views/grxx/transfer_page'),
			meta: { title: '能力初评' },
			children: [{
				path: 'xxnl',
				name: 'xxnl',
				component: () => import('@/views/grxx/nlcp/xxnl/public'),
				meta: { title: '学习能力' }
			}, {
				path: 'xxnlEdit',
				name: 'xxnlEdit',
				component: () => import('@/views/grxx/nlcp/xxnl/edit'),
				meta: { title: '编辑学习能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'xxnlDetail',
				name: 'xxnlDetail',
				component: () => import('@/views/grxx/nlcp/xxnl/detail'),
				meta: { title: '学习能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'sjnl',
				name: 'sjnl',
				component: () => import('@/views/grxx/nlcp/sjnl/public'),
				meta: { title: '实践能力' }
			}, {
				path: 'sjnlDetail',
				name: 'sjnlDetail',
				component: () => import('@/views/grxx/nlcp/sjnl/detail'),
				meta: { title: '实践能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'sjnlEdit',
				name: 'sjnlEdit',
				component: () => import('@/views/grxx/nlcp/sjnl/edit'),
				meta: { title: '编辑实践能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'cxnl',
				name: 'cxnl',
				component: () => import('@/views/grxx/nlcp/cxnl/public'),
				meta: { title: '创新能力' }
			}, {
				path: 'cxnlDetail',
				name: 'cxnlDetail',
				component: () => import('@/views/grxx/nlcp/cxnl/detail'),
				meta: { title: '创新能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'cxnlEdit',
				name: 'cxnlEdit',
				component: () => import('@/views/grxx/nlcp/cxnl/edit'),
				meta: { title: '编辑创新能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'ldnl',
				name: 'ldnl',
				component: () => import('@/views/grxx/nlcp/ldnl/public'),
				meta: { title: '领导能力' }
			}, {
				path: 'ldnlDetail',
				name: 'ldnlDetail',
				component: () => import('@/views/grxx/nlcp/ldnl/detail'),
				meta: { title: '领导能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'ldnlEdit',
				name: 'ldnlEdit',
				component: () => import('@/views/grxx/nlcp/ldnl/edit'),
				meta: { title: '编辑领导能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'kwhnl',
				name: 'kwhnl',
				component: () => import('@/views/grxx/nlcp/kwhnl/public'),
				meta: { title: '跨文化能力' }
			}, {
				path: 'kwhnlDetail',
				name: 'kwhnlDetail',
				component: () => import('@/views/grxx/nlcp/kwhnl/detail'),
				meta: { title: '跨文化能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'kwhnlEdit',
				name: 'kwhnlEdit',
				component: () => import('@/views/grxx/nlcp/kwhnl/edit'),
				meta: { title: '跨文化能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}]
		}, {
			path: 'zynh',
			name: 'zynh',
			component: () => import('@/views/grxx/zynh/public'),
			meta: { title: '致一年后的自己' }
		}, {
			path: 'zynhDetail',
			name: 'zynhDetail',
			component: () => import('@/views/grxx/zynh/detail'),
			meta: { title: '致一年后的自己详情' },
			props: (route) => ({ query: route.query.q }),
			hidden: true
		}, {
			path: 'zynhEdit',
			name: 'zynhEdit',
			component: () => import('@/views/grxx/zynh/edit'),
			meta: { title: '编辑致一年后的自己' },
			props: (route) => ({ query: route.query.q }),
			hidden: true
		}]
	},
	{
		path: '/dekt',
		name: 'dekt',
		redirect: { 'name': 'xsgbll' },
		component: Layout,
		meta: { title: '第二课堂', icon: 'research' },
		children: [{
			path: 'xsgbll',
			name: 'xsgbll',
			component: () => import('@/views/dekt/xsgbll/index'),
			meta: { title: '学生干部履历' }
		}, {
			path: '/bjxsgz',
			name: 'bjxsgz',
			redirect: { 'name': 'ggpyxx' },
			component: () => import('@/views/dekt/transfer_page'),
			meta: { title: '班级学生工作' },
			children: [{
				path: 'kcgl',
				name: 'kcgl',
				component: () => import('@/views/dekt/bjxsgz/kcgl/index'),
				meta: { title: '课程管理' }
			}, {
				path: 'kclist',
				name: 'kclist',
				component: () => import('@/views/dekt/bjxsgz/kcgl/kclist'),
				meta: { title: '课程信息' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'tbkc',
				name: 'tbkc',
				component: () => import('@/views/dekt/bjxsgz/kcgl/kclist'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '排课' }
			}, {
				path: 'kcDetail',
				name: 'kcDetail',
				component: () => import('@/views/dekt/bjxsgz/kcgl/detail'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '课程详情' },
				hidden: true
			}, {
				path: 'xsgb',
				name: 'xsgb',
				component: () => import('@/views/dekt/bjxsgz/xsgb/index'),
				meta: { title: '学生干部信息' }
			}, {
				path: 'ggpyxx',
				name: 'ggpyxx',
				component: () => import('@/views/dekt/bjxsgz/ggpyxx/public'),
				meta: { title: '骨干培养学校' }
			}, {
				path: 'gzzj',
				name: 'gzzj',
				component: () => import('@/views/dekt/bjxsgz/gzzj/index'),
				meta: { title: '工作总结' }
			}, {
				path: 'hdzz',
				name: 'hdzz',
				component: () => import('@/views/dekt/bjxsgz/hdzz/index'),
				meta: { title: '活动组织情况' }
			}]
		}, {
			path: '/txhdsj',
			name: 'txhdsj',
			redirect: { 'name': 'cxhd' },
			component: () => import('@/views/dekt/transfer_page'),
			meta: { title: '团学活动实践' },
			children: [{
					path: 'hdgl',
					name: 'hdgl',
					component: () => import('@/views/dekt/txhdsj/hdgl/index'),
					meta: { title: '团学活动管理' }
				}, {
				path: 'cxhd',
				name: 'cxhd',
				component: () => import('@/views/dekt/txhdsj/cxhd/public'),
				meta: { 	title: '创新活动', type: 1 }
			}, {
				path: 'stuhdList',
				name: 'stuhdList',
				component: () => import('@/views/dekt/txhdsj/cxhd/stuhdList'),
				props: (route) => ({ query: route.query.q }),
				meta: { 	title: '报名信息' },
				hidden: true
			}, {
				path: 'xywh',
				name: 'xywh',
				component: () => import('@/views/dekt/txhdsj/cxhd/public'),
				meta: { 	title: '校园文化', type: 2 }
			}, {
				path: 'shsj',
				name: 'shsj',
				component: () => import('@/views/dekt/txhdsj/cxhd/public'),
				meta: { 	title: '社会实践', type: 3 }
			}, {
				path: 'zyfw',
				name: 'zyfw',
				component: () => import('@/views/dekt/txhdsj/cxhd/public'),
				meta: { 	title: '志愿服务', type: 4 }
			}]
		}, {
			path: '/lxxnjy',
			name: 'lxxnjy',
			redirect: { 'name': 'ldxxdj' },
			component: () => import('@/views/dekt/transfer_page'),
			meta: { title: '理想信念教育' },
			children: [{
				path: 'pxkc',
				name: 'pxkc',
				component: () => import('@/views/dekt/lxxnjy/pxkc/index'),
				meta: { title: '入党启蒙班培训课程管理' }
			}, {
				path: 'ldxxdj',
				name: 'ldxxdj',
				component: () => import('@/views/dekt/lxxnjy/ldxxdj/public'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '入党申请人信息管理' }
			}, {
				path: 'ldxx',
				name: 'ldxx',
				component: () => import('@/views/dekt/lxxnjy/ldxxdj/public'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '入党申请信息' }
			}, {
				path: 'ldxxdjDetail',
				name: 'ldxxdjDetail',
				component: () => import('@/views/dekt/lxxnjy/ldxxdj/detail'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '入党申请人信息' },
				hidden: true
			}, {
				path: 'qmpxb',
				name: 'qmpxb',
				component: () => import('@/views/dekt/lxxnjy/qmpxb/public'),
				meta: { title: '入党启蒙培训班' }
			}, {
				path: 'pxbkc',
				name: 'pxbkc',
				component: () => import('@/views/dekt/lxxnjy/qmpxb/pxbkc'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '培训课程' },
				hidden: true
			}, {
				path: 'jzgl',
				name: 'jzgl',
				component: () => import('@/views/dekt/lxxnjy/jzgl/index'),
				meta: { title: '理想信念讲座管理', type: 5, mc: '讲座' }
			}, {
				path: 'lxxnjz',
				name: 'lxxnjz',
				component: () => import('@/views/dekt/lxxnjy/lxxnjz/public'),
				meta: { title: '理想信念讲座', type: 5, mc: '讲座' }
			}]
		}, {
			path: '/zzyrgz',
			name: 'zzyrgz',
			redirect: { 'name': 'xyzp' },
			component: () => import('@/views/dekt/transfer_page'),
			meta: { 	title: '资助育人工作' },
			children: [{
				path: 'xyzp',
				name: 'xyzp',
				component: () => import('@/views/dekt/zzyrgz/xyzp/public'),
				meta: { title: '学业自评' }
			}, {
				path: 'xyzpEdit',
				name: 'xyzpEdit',
				component: () => import('@/views/dekt/zzyrgz/xyzp/edit'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '编辑学业自评' },
				hidden: true
			}, {
				path: 'xyzpDetail',
				name: 'xyzpDetail',
				component: () => import('@/views/dekt/zzyrgz/xyzp/detail'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '学业自评信息' },
				hidden: true
			}, {
				path: 'jszz',
				name: 'jszz',
				component: () => import('@/views/dekt/zzyrgz/jszz/index'),
				meta: { title: '接受资助' }
			}, {
				path: 'zwcz',
				name: 'zwcz',
				component: () => import('@/views/dekt/zzyrgz/zwcz/public'),
				meta: { title: '自我成长' }
			}, {
				path: 'zwczEdit',
				name: 'zwczEdit',
				component: () => import('@/views/dekt/zzyrgz/zwcz/edit'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '编辑自我成长信息' },
				hidden: true
			}, {
				path: 'zwczDetail',
				name: 'zwczDetail',
				component: () => import('@/views/dekt/zzyrgz/zwcz/detail'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '自我成长信息' },
				hidden: true
			}, {
				path: 'fwjt',
				name: 'fwjt',
				component: () => import('@/views/dekt/zzyrgz/fwjt/public'),
				meta: { title: '服务集体' }
			}, {
				path: 'fwjtEdit',
				name: 'fwjtEdit',
				component: () => import('@/views/dekt/zzyrgz/fwjt/edit'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '编辑服务集体信息' },
				hidden: true
			}, {
				path: 'fwjtDetail',
				name: 'fwjtDetail',
				component: () => import('@/views/dekt/zzyrgz/fwjt/detail'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '服务集体信息' },
				hidden: true
			}, {
				path: 'fwjx',
				name: 'fwjx',
				component: () => import('@/views/dekt/zzyrgz/fwjx/public'),
				meta: { title: '服务家乡' }
			}, {
				path: 'fwjxEdit',
				name: 'fwjxEdit',
				component: () => import('@/views/dekt/zzyrgz/fwjx/edit'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '编辑服务家乡信息' },
				hidden: true
			}, {
				path: 'fwjxDetail',
				name: 'fwjxDetail',
				component: () => import('@/views/dekt/zzyrgz/fwjx/detail'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '服务家乡信息' },
				hidden: true
			}, {
				path: 'gegj',
				name: 'gegj',
				component: () => import('@/views/dekt/zzyrgz/gegj/public'),
				meta: { title: '感恩国家' }
			}, {
				path: 'gegjDetail',
				name: 'gegjDetail',
				component: () => import('@/views/dekt/zzyrgz/gegj/detail'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '感恩国家信息' },
				hidden: true
			}, {
				path: 'gegjEdit',
				name: 'gegjEdit',
				component: () => import('@/views/dekt/zzyrgz/gegj/edit'),
				props: (route) => ({ query: route.query.q }),
				meta: { title: '编辑感恩国家信息' },
				hidden: true
			}]
		}, {
			path: 'sqyr',
			name: 'sqyr',
			component: () => import('@/views/dekt/sqyr/index'),
			meta: { title: '社区育人' }
		}]
	},
	{
		path: '/xyxx',
		name: 'xyxx',
		redirect: { 'name': 'jbxx' },
		component: Layout,
		meta: { title: '学业信息', icon: 'message' },
		children: [{
			path: 'cjjbqk',
			name: 'cjjbqk',
			component: () => import('@/views/xyxx/cjjbqk/public'),
			meta: { 	title: '成绩基本情况' }
		}, {
			path: 'cjjbqkDetail',
			name: 'cjjbqkDetail',
			component: () => import('@/views/xyxx/cjjbqk/detail'),
			props: (route) => ({ query: route.query.q }),
			meta: { 	title: '成绩基本情况详情' },
			hidden: true
		}, {
			path: 'xycjfx',
			name: 'xycjfx',
			component: () => import('@/views/xyxx/xycjfx/index'),
			meta: { title: '学业成绩分析' }
		}, {
			path: 'kcxm',
			name: 'kcxm',
			component: () => import('@/views/xyxx/kcxm/index'),
			meta: { title: '科创项目' }
		}, {
			path: 'xkjs',
			name: 'xkjs',
			component: () => import('@/views/xyxx/xkjs/index'),
			meta: { title: '学科竞赛' }
		}, {
			path: 'xsjzgl',
			name: 'xsjzgl',
			component: () => import('@/views/dekt/lxxnjy/jzgl/index'),
			meta: { title: '学术论坛讲座管理', type: 6, mc: '讲座' }
		}, {
			path: 'ltjzxx',
			name: 'ltjzxx',
			component: () => import('@/views/dekt/lxxnjy/lxxnjz/public'),
			meta: { title: '学术论坛讲座学习', type: 6, mc: '讲座' }
		}, {
			path: 'byjtgl',
			name: 'byjtgl',
			component: () => import('@/views/dekt/lxxnjy/jzgl/index'),
			meta: { title: '博雅课堂管理', type: 7, mc: '课堂' }
		}, {
			path: 'bykt',
			name: 'bykt',
			component: () => import('@/views/dekt/lxxnjy/lxxnjz/public'),
			meta: { title: '博雅课堂', type: 7, mc: '课堂' }
		}, {
			path: 'gjjlxx',
			name: 'gjjlxx',
			component: () => import('@/views/xyxx/gjjlxx/index'),
			meta: { title: '国际交流学习' }
		}]
	},
	{
		path: '/ynzp',
		name: 'ynzp',
		redirect: { 'name': 'jbxx' },
		component: Layout,
		meta: { title: '一年总评', icon: 'pj' },
		children: [{
			path: '/nlzp',
			name: 'nlzp',
			component: () => import('@/views/ynzp/transfer_page'),
			meta: { 	title: '能力自评' },
			children: [{
				path: 'xxnlzp',
				name: 'xxnlzp',
				component: () => import('@/views/ynzp/nlzp/xxnl/index'),
				meta: { title: '学习能力' }
			}, {
				path: 'xxnlzpAdd',
				name: 'xxnlzpAdd',
				component: () => import('@/views/ynzp/nlzp/xxnl/edit'),
				meta: { title: '添加学习能力' },
				hidden: true
			}, {
				path: 'xxnlzpEdit',
				name: 'xxnlzpEdit',
				component: () => import('@/views/ynzp/nlzp/xxnl/edit'),
				meta: { title: '编辑学习能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'xxnlzpDetail',
				name: 'xxnlzpDetail',
				component: () => import('@/views/ynzp/nlzp/xxnl/detail'),
				meta: { title: '学习能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'sjnlzp',
				name: 'sjnlzp',
				component: () => import('@/views/ynzp/nlzp/sjnl/index'),
				meta: { title: '实践能力' }
			}, {
				path: 'sjnlzpDetail',
				name: 'sjnlzpDetail',
				component: () => import('@/views/ynzp/nlzp/sjnl/detail'),
				meta: { title: '实践能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'sjnlzpAdd',
				name: 'sjnlzpAdd',
				component: () => import('@/views/ynzp/nlzp/sjnl/edit'),
				meta: { title: '添加实践能力' },
				hidden: true
			}, {
				path: 'sjnlzpEdit',
				name: 'sjnlzpEdit',
				component: () => import('@/views/ynzp/nlzp/sjnl/edit'),
				meta: { title: '编辑实践能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'cxnlzp',
				name: 'cxnlzp',
				component: () => import('@/views/ynzp/nlzp/cxnl/index'),
				meta: { title: '创新能力' }
			}, {
				path: 'cxnlzpDetail',
				name: 'cxnlzpDetail',
				component: () => import('@/views/ynzp/nlzp/cxnl/detail'),
				meta: { title: '创新能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'cxnlzpAdd',
				name: 'cxnlzpAdd',
				component: () => import('@/views/ynzp/nlzp/cxnl/edit'),
				meta: { title: '添加创新能力' },
				hidden: true
			}, {
				path: 'cxnlzpEdit',
				name: 'cxnlzpEdit',
				component: () => import('@/views/ynzp/nlzp/cxnl/edit'),
				meta: { title: '编辑创新能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'ldnlzp',
				name: 'ldnlzp',
				component: () => import('@/views/ynzp/nlzp/ldnl/index'),
				meta: { title: '领导能力' }
			}, {
				path: 'ldnlzpDetail',
				name: 'ldnlzpDetail',
				component: () => import('@/views/ynzp/nlzp/ldnl/detail'),
				meta: { title: '领导能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'ldnlzpAdd',
				name: 'ldnlzpAdd',
				component: () => import('@/views/ynzp/nlzp/ldnl/edit'),
				meta: { title: '添加领导能力' },
				hidden: true
			}, {
				path: 'ldnlzpEdit',
				name: 'ldnlzpEdit',
				component: () => import('@/views/ynzp/nlzp/ldnl/edit'),
				meta: { title: '编辑领导能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'kwhnlzp',
				name: 'kwhnlzp',
				component: () => import('@/views/ynzp/nlzp/kwhnl/index'),
				meta: { title: '跨文化能力' }
			}, {
				path: 'kwhnlzpDetail',
				name: 'kwhnlzpDetail',
				component: () => import('@/views/ynzp/nlzp/kwhnl/detail'),
				meta: { title: '跨文化能力详情' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'kwhnlzpAdd',
				name: 'kwhnlzpAdd',
				component: () => import('@/views/ynzp/nlzp/kwhnl/edit'),
				meta: { title: '添加跨文化能力' },
				hidden: true
			}, {
				path: 'kwhnlzpEdit',
				name: 'kwhnlzpEdit',
				component: () => import('@/views/ynzp/nlzp/kwhnl/edit'),
				meta: { title: '编辑跨文化能力' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}]
		}]
	},
	{
		path: '/rcgl',
		name: 'rcgl',
		redirect: { name: 'jssq' },
		component: Layout,
		meta: { title: '日常管理', icon: 'home' },
		children: [{
				path: 'jssq',
				name: 'jssq',
				component: () => import('@/views/rcgl/jssq/index'),
				meta: { title: '教室借用申请' }
			}]
	},
	{
		path: '/xgdy',
		name: 'xgdy',
		redirect: { name: 'ztdy' },
		component: Layout,
		meta: { title: '相关调研', icon: 'ztdy' },
		children: [{
				path: 'ztdy',
				name: 'ztdy',
				component: () => import('@/views/xgdy/ztdy/public'),
				meta: { title: '主题调研' }
			}, {
				path: 'ztdyAdd',
				name: 'ztdyAdd',
				component: () => import('@/views/xgdy/ztdy/edit'),
				meta: { title: '添加主题调研' },
				hidden: true
			}, {
				path: 'ztdyEdit',
				name: 'ztdyEdit',
				component: () => import('@/views/xgdy/ztdy/edit'),
				meta: { title: '编辑主题调研' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'ztdyList',
				name: 'ztdyList',
				component: () => import('@/views/xgdy/ztdy/list'),
				meta: { title: '主题调研列表' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'ztdySh',
				name: 'ztdySh',
				component: () => import('@/views/xgdy/ztdy/edit'),
				meta: { title: '审核主题调研' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'dywj',
				name: 'dywj',
				component: () => import('@/views/xgdy/ztdy/newEdit'),
				meta: { title: '填写调研问卷' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'dywjEdit',
				name: 'dywjEdit',
				component: () => import('@/views/xgdy/ztdy/newEdit'),
				meta: { title: '编辑调研问卷' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}, {
				path: 'xsdySh',
				name: 'xsdySh',
				component: () => import('@/views/xgdy/ztdy/newEdit'),
				meta: { title: '审核调研问卷' },
				props: (route) => ({ query: route.query.q }),
				hidden: true
			}]
	},
	{
		path: '/system',
		name: 'system',
		redirect: '/system/node',
		component: Layout,
		meta: {
			title: '系统信息设置',
			icon: 'set'
		},
		children: [{
				path: 'node',
				name: 'node',
				component: () =>
					import('@/views/system/node'),
				meta: {
					title: '导航菜单管理'
				}
			},
			{
				path: 'group',
				name: 'group',
				component: () =>
					import('@/views/users/usersGroup'),
				meta: {
					title: '用户组管理'
				}
			},
			{
				path: 'list/:group',
				name: 'list',
				component: () =>
					import('@/views/users/usersList'),
				meta: {
					title: '管理员管理'
				},
				hidden: true
			},
			{
				path: 'category',
				name: 'category',
				component: () =>
					import('@/views/system/category'),
				meta: {
					title: '字典表管理'
				}
			},
			{
				path: 'log',
				name: 'log',
				component: () =>
					import('@/views/system/log'),
				meta: {
					title: '系统日志管理'
				}
			}
		]
	},
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]
