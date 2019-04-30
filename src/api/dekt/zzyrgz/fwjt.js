/**
 * @author zhy 2019-01-23
 * @description 服务集体-相关接口
 */
import { read, write, del } from '@/api/index'

export function fwjtList(params) { //列表
    return read('/admin-api/fwjt', params)
}

export function fwjtDel(id) { //删除
    return del('/admin-api/fwjt', id)
}

export function fwjtRead(id) { //详情
    return read('/admin-api/fwjt/' + id)
}

export function fwjtEdit(data, method) { //编辑
    return write('/admin-api/fwjt', data, method)
}

