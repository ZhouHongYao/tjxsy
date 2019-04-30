/**
 * @author zhy 2019-01-28
 * @description 学习能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function xxnlzpList(params) { //列表
    return read('/admin-api/xxnlzp', params)
}

export function xxnlzpDel(id) { //删除
    return del('/admin-api/xxnlzp', id)
}

export function xxnlzpRead(id) { //详情
    return read('/admin-api/xxnlzp/' + id)
}

export function xxnlzpEdit(data, method) { //添加、编辑
    return write('/admin-api/xxnlzp', data, method)
}
