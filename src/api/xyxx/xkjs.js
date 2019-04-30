/**
 * @author zhy 2019-01-25
 * @description 学科竞赛-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function xkjsList(params) { //列表
    return read('/admin-api/xkjs', params)
}

export function xkjsDel(id) { //删除
    return del('/admin-api/xkjs', id)
}

export function xkjsRead(id) { //详情
    return read('/admin-api/xkjs/' + id)
}

export function xkjsEdit(data, method) { //添加、编辑
    return write('/admin-api/xkjs', data, method)
}

export function xkjsSh(data) { //审核
	return modify('/admin-api/xkjs-sh', data)
}
