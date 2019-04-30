/**
 * @author zhy 2019-01-23
 * @description 接受资助-相关接口
 */
import { read, write, del } from '@/api/index'

export function jszzList(params) { //列表
    return read('/admin-api/jszz', params)
}

export function jszzDel(id) { //删除
    return del('/admin-api/jszz', id)
}

export function jszzRead(id) { //详情
    return read('/admin-api/jszz/' + id)
}

export function jszzEdit(data, method) { //编辑
    return write('/admin-api/jszz', data, method)
}

