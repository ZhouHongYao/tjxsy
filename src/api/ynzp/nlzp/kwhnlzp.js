/**
 * @author zhy 2019-01-28
 * @description 跨文化能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function kwhnlzpList(params) { //列表
    return read('/admin-api/kwhnlzp', params)
}

export function kwhnlzpDel(id) { //删除
    return del('/admin-api/kwhnlzp', id)
}

export function kwhnlzpRead(id) { //详情
    return read('/admin-api/kwhnlzp/' + id)
}

export function kwhnlzpEdit(data, method) { //添加、编辑
    return write('/admin-api/kwhnlzp', data, method)
}
