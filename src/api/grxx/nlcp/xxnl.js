/**
 * @author zhy 2018-08-01
 * @description 学习能力-相关接口
 */
import { read, write, del } from '@/api/index'

export function xxnlList(params) { //列表
    return read('/admin-api/xxnl', params)
}

export function xxnlDel(id) { //删除
    return del('/admin-api/xxnl', id)
}

export function xxnlRead(id) { //详情
    return read('/admin-api/xxnl/' + id)
}

export function xxnlEdit(data, method) { //添加、编辑
    return write('/admin-api/xxnl', data, method)
}
