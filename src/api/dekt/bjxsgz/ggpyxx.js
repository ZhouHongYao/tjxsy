/**
 * @author zhy 2019-01-05
 * @description 骨干培养学校-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function ggpyxxList(params) { //列表
    return read('/admin-api/ggpyxx', params)
}

export function ggpyxxSh(params) { //审核
	return modify('/admin-api/ggpyxx-sh', params)
}

export function ggpyxxRead(id) { //详情
    return read('/admin-api/ggpyxx/' + id)
}

export function getMember(szzb, tbid) { //获取小组成员
	return read('/admin-api/ggcy/' + szzb + '/' + tbid)
}

export function ggpyxxDel(id) { //删除
	return del('/admin-api/ggpyxx', id)
}

export function ggpyxxEdit(data, method) { //添加、编辑
    return write('/admin-api/ggpyxx', data, method)
}

export function kcbm(data) { //报名
	return modify('/admin-api/ggpyxx', data)
}

export function tbkcinfo(data) { //课程列表
	return read('/admin-api/tbkcinfo', data)
}
