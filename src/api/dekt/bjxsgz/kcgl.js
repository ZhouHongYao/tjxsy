/**
 * @author zhy 2019-01-05
 * @description 课程管理-相关接口
 */
import { read, write, del } from '@/api/index'

export function kcglList(params) { //列表
    return read('/admin-api/kcgl', params)
}

export function kcglDel(id) { //删除
    return del('/admin-api/kcgl', id)
}

export function kcglRead(id) { //详情
    return read('/admin-api/kcgl/' + id)
}

export function kcglEdit(data, method) { //添加、编辑
    return write('/admin-api/kcgl', data, method)
}

