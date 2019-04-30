/**
 * @author zhy 2019-01-19
 * @description 创新活动-相关接口
 */
import { read, update, modify, del } from '@/api/index'

export function cxhdList(name, params) { //列表
    return read('/admin-api/' + name, params)
}

export function cxhdDel(name, id) { //删除
    return del('/admin-api/' + name, id)
}

export function hdbmList(params) { //已报名列表
	return read('/admin-api/hdbm', params)
}

export function hdbm(params) { //报名
	return modify('/admin-api/hdbm', params)
}

export function hdbmDel(params) { //取消报名
	return del('/admin-api/hdbm', params)
}

export function hdRead(id) { //详情
	return read('/admin-api/hdbm/' + id)
}

export function hdEdit(data) { //编辑
	return update('/admin-api/hdbm', data)
}
