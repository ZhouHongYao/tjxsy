/**
 * @author zhy 2019-01-23
 * @description 讲座管理-相关接口
 */
import { read, write, del } from '@/api/index'

export function jzglList(params) { //列表
	return read('/admin-api/jzgl', params)
}

export function jzglDel(id) { //删除
	return del('/admin-api/jzgl', id)
}

export function jzglRead(id) { //详情
	return read('/admin-api/jzgl/' + id)
}

export function jzglEdit(data, method) { //添加、编辑
	return write('/admin-api/jzgl', data, method)
}

