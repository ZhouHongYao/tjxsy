/**
 * @author zhy 2019-01-28
 * @description 领导能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function ldnlzpList(params) { //列表
    return read('/admin-api/ldnlzp', params)
}

export function ldnlzpDel(id) { //删除
    return del('/admin-api/ldnlzp', id)
}

export function ldnlzpRead(id) { //详情
    return read('/admin-api/ldnlzp/' + id)
}

export function ldnlzpEdit(data, method) { //添加、编辑
    return write('/admin-api/ldnlzp', data, method)
}
