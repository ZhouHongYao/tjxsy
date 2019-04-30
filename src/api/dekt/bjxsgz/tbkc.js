/**
 * @author zhy 2019-01-05
 * @description 填报课程-相关接口
 */
import { read, write, del } from '@/api/index'

export function tbkcList(params) { //列表
    return read('/admin-api/tbkc', params)
}

export function tbkcDel(id) { //删除
    return del('/admin-api/tbkc', id)
}

export function tbkcRead(id) { //详情
    return read('/admin-api/tbkc/' + id)
}

export function tbkcEdit(data, method) { //添加、编辑
    return write('/admin-api/tbkc', data, method)
}

export function kcgls() { //课程列表
	return read('/admin-api/kcgls')
}

