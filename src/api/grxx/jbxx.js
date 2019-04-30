/**
 * @author zhy 2019-01-04
 * @description 基本信息-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function jbxxList(params) { //列表
    return read('/admin-api/jbxx', params)
}

export function jbxxDel(id) { //删除
    return del('/admin-api/jbxx', id)
}

export function jbxxRead(id) { //详情
    return read('/admin-api/jbxx/' + id)
}

export function jbxxEdit(data, method) { //添加、编辑
    return write('/admin-api/jbxx', data, method)
}

export function jbxxSh(data) { //审核
	return modify('/admin-api/jbxx-sh', data)
}

export function yxList() { //学生所在书院
	return read('/admin-api/yx')
}

export function hzxx(id) { //学生汇总信息
	return read('/admin-api/jbxx-hz/' + id)
}

export function hjqkList(params) { //获奖情况列表
	return read('/admin-api/hjqk', params)
}

export function hjqkDel(id) { //删除获奖情况
	return del('/admin-api/hjqk', id)
}

export function hjqkRead(id) { //获奖情况详情
	return read('/admin-api/hjqk/' + id)
}

export function hjqkEdit(data, method) { //添加、编辑获奖情况
	return write('/admin-api/hjqk', data, method)
}
