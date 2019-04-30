/**
 * @author zhy 2019-01-19
 * @description 创新活动-相关接口
 */
import { read, update, modify, del } from '@/api/index'

export function cxhdList(name, params) { //列表
    return read('/admin-api/lxxnjz', params)
}

export function cxhdDel(name, id) { //删除
    return del('/admin-api/lxxnjz', id)
}

export function jzbmList(params) { //已报名列表
	return read('/admin-api/jzbm', params)
}

export function jzbm(params) { //报名
	return modify('/admin-api/jzbm', params)
}

export function jzbmDel(params) { //取消报名
	return del('/admin-api/jzbm', params)
}

export function hdRead(id) { //详情
	return read('/admin-api/jzbm/' + id)
}

export function hdEdit(data) { //编辑
	return update('/admin-api/jzbm', data)
}
