/**
 * @author zhy 2019-01-23
 * @description 服务家乡-相关接口
 */
import { read, write, del } from '@/api/index'

export function fwjxList(params) { //列表
    return read('/admin-api/fwjx', params)
}

export function fwjxDel(id) { //删除
    return del('/admin-api/fwjx', id)
}

export function fwjxRead(id) { //详情
    return read('/admin-api/fwjx/' + id)
}

export function fwjxEdit(data, method) { //编辑
    return write('/admin-api/fwjx', data, method)
}

