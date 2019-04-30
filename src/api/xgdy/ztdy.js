/**
 * @author zhy 2019-01-29
 * @description 主题调研-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function ztdyList(params) { //列表
    return read('/admin-api/ztdy', params)
}

export function dybmList(params) { //我参与的调研列表
	return read('/admin-api/xsdy', params)
}

export function ztdyDel(id) { //删除
    return del('/admin-api/ztdy', id)
}

export function ztdyRead(id) { //详情
    return read('/admin-api/ztdy/' + id)
}

export function ztdyEdit(data, method) { //添加、编辑
    return write('/admin-api/ztdy', data, method)
}

export function dywj(data, method) { //填写、编辑问卷
	return write('/admin-api/xsdy', data, method)
}

export function xsdyRead(id) { //问卷详情
	return read('/admin-api/xsdy/' + id)
}

export function xsdySh(params) { //问卷审核
	return modify('/admin-api/xsdy-sh', params)
}
