/**
 * @author zhy 2019-01-07
 * @description 工作总结-相关接口
 */
import { read, write, del } from '@/api/index'

export function gzzjList(params) { //列表
    return read('/admin-api/gzzj', params)
}

export function gzzjDel(id) { //删除
    return del('/admin-api/gzzj', id)
}

export function gzzjRead(id) { //详情
    return read('/admin-api/gzzj/' + id)
}

export function gzzjEdit(data, method) { //添加、编辑
    return write('/admin-api/gzzj', data, method)
}

