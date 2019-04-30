/**
 * @author zhy 2018-08-01
 * @description 跨文化能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function kwhnlList(params) { //列表
    return read('/admin-api/kwhnl', params)
}

export function kwhnlDel(id) { //删除
    return del('/admin-api/kwhnl', id)
}

export function kwhnlRead(id) { //详情
    return read('/admin-api/kwhnl/' + id)
}

export function kwhnlEdit(data, method) { //添加、编辑
    return write('/admin-api/kwhnl', data, method)
}
