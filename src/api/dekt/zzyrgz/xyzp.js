/**
 * @author zhy 2019-01-05
 * @description 学业自评-相关接口
 */
import { read, write, del } from '@/api/index'

export function xyzpList(params) { //列表
    return read('/admin-api/xyzp', params)
}

export function xyzpDel(id) { //删除
    return del('/admin-api/xyzp', id)
}

export function xyzpRead(id) { //详情
    return read('/admin-api/xyzp/' + id)
}

export function xyzpEdit(data, method) { //编辑
    return write('/admin-api/xyzp', data, method)
}

