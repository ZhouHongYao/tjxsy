/**
 * @author zhy 2019-01-23
 * @description 自我成长-相关接口
 */
import { read, write, del } from '@/api/index'

export function zwczList(params) { //列表
    return read('/admin-api/zwcz', params)
}

export function zwczDel(id) { //删除
    return del('/admin-api/zwcz', id)
}

export function zwczRead(id) { //详情
    return read('/admin-api/zwcz/' + id)
}

export function zwczEdit(data, method) { //编辑
    return write('/admin-api/zwcz', data, method)
}

