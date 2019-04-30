/**
 * @author zhy 2019-01-17
 * @description 活动管理-相关接口
 */
import { read, write, del } from '@/api/index'

export function hdglList(params) { //列表
	return read('/admin-api/hdgl', params)
}

export function hdglDel(id) { //删除
	return del('/admin-api/hdgl', id)
}

export function hdglRead(id) { //详情
	return read('/admin-api/hdgl/' + id)
}

export function hdglEdit(data, method) { //添加、编辑
	return write('/admin-api/hdgl', data, method)
}

