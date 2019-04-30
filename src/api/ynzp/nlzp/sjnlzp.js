/**
 * @author zhy 2019-01-28
 * @description 实践能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function sjnlzpList(params) { //列表
    return read('/admin-api/sjnlzp', params)
}

export function sjnlzpDel(id) { //删除
    return del('/admin-api/sjnlzp', id)
}

export function sjnlzpRead(id) { //详情
    return read('/admin-api/sjnlzp/' + id)
}

export function sjnlzpEdit(data, method) { //添加、编辑
    return write('/admin-api/sjnlzp', data, method)
}
