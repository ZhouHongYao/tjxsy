/**
 * @author zhy 2019-01-21
 * @description 入党培训课程管理-相关接口
 */
import { read, write, del } from '@/api/index'

export function pxkcList(params) { //列表
	return read('/admin-api/pxkc', params)
}

export function pxkcDel(id) { //删除
	return del('/admin-api/pxkc', id)
}

export function pxkcRead(id) { //详情
	return read('/admin-api/pxkc/' + id)
}

export function pxkcEdit(data, method) { //添加、编辑
	return write('/admin-api/pxkc', data, method)
}

