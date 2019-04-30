/**
 * @author zhy 2018-08-01
 * @description 实践能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function sjnlList(params) { //列表
    return read('/admin-api/sjnl', params)
}

export function sjnlDel(id) { //删除
    return del('/admin-api/sjnl', id)
}

export function sjnlRead(id) { //详情
    return read('/admin-api/sjnl/' + id)
}

export function sjnlEdit(data, method) { //添加、编辑
    return write('/admin-api/sjnl', data, method)
}
