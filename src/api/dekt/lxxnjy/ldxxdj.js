/**
 * @author zhy 2019-01-22
 * @description 入党申请人信息登记-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function ldxxdjList(params) { //列表
	return read('/admin-api/ldxxdj', params)
}

export function ldxxdjEdit(data, method) { //添加、编辑
	return write('/admin-api/ldxxdj', data, method)
}

export function ldxxdjRead(id) { //详情
	return read('/admin-api/ldxxdj/' + id)
}

export function ldxxdjDel(id) { //删除
	return del('/admin-api/ldxxdj', id)
}

export function ldxxdjSh(params) { //审核
	return modify('/admin-api/ldxxdj-sh', params)
}
