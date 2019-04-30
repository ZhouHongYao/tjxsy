/**
 * @author zhy 2019-02-25
 * @description 入党启蒙班培训课程排课-相关接口
 */
import { read, write, del } from '@/api/index'

export function pxpkList(params) { //列表
    return read('/admin-api/pxpk', params)
}

export function pxpkDel(id) { //删除
    return del('/admin-api/pxpk', id)
}

export function pxpkRead(id) { //详情
    return read('/admin-api/pxpk/' + id)
}

export function pxpkEdit(data, method) { //添加、编辑
    return write('/admin-api/pxpk', data, method)
}

export function kcgls() { //课程列表
	return read('/admin-api/pxkcs')
}

