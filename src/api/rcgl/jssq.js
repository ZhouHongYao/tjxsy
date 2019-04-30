/**
 * @author zhy 2019-01-28
 * @description 教室借用申请-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function jssqList(params) { //列表
    return read('/admin-api/jssq', params)
}

export function jssqDel(id) { //删除
    return del('/admin-api/jssq', id)
}

export function jssqRead(id) { //详情
    return read('/admin-api/jssq/' + id)
}

export function jssqEdit(data, method) { //添加、编辑
    return write('/admin-api/jssq', data, method)
}

export function jssqSh(data) { //审核
	return modify('/admin-api/jssq-sh', data)
}
