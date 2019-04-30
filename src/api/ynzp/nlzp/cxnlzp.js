/**
 * @author zhy 2019-01-28
 * @description 创新能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function cxnlzpList(params) { //列表
    return read('/admin-api/cxnlzp', params)
}

export function cxnlzpDel(id) { //删除
    return del('/admin-api/cxnlzp', id)
}

export function cxnlzpRead(id) { //详情
    return read('/admin-api/cxnlzp/' + id)
}

export function cxnlzpEdit(data, method) { //添加、编辑
    return write('/admin-api/cxnlzp', data, method)
}
