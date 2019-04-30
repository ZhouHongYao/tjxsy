/**
 * @author zhy 2018-08-01
 * @description 创新能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function cxnlList(params) { //列表
    return read('/admin-api/cxnl', params)
}

export function cxnlDel(id) { //删除
    return del('/admin-api/cxnl', id)
}

export function cxnlRead(id) { //详情
    return read('/admin-api/cxnl/' + id)
}

export function cxnlEdit(data, method) { //添加、编辑
    return write('/admin-api/cxnl', data, method)
}
