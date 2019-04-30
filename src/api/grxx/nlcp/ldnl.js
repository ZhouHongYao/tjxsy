/**
 * @author zhy 2018-08-01
 * @description 领导能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function ldnlList(params) { //列表
    return read('/admin-api/ldnl', params)
}

export function ldnlDel(id) { //删除
    return del('/admin-api/ldnl', id)
}

export function ldnlRead(id) { //详情
    return read('/admin-api/ldnl/' + id)
}

export function ldnlEdit(data, method) { //添加、编辑
    return write('/admin-api/ldnl', data, method)
}
