/**
 * @author zhy 2019-01-07
 * @description 活动组织情况-相关接口
 */
import { read, write, del } from '@/api/index'

export function hdzzList(params) { //列表
    return read('/admin-api/hdzz', params)
}

export function hdzzDel(id) { //删除
    return del('/admin-api/hdzz', id)
}

export function hdzzRead(id) { //详情
    return read('/admin-api/hdzz/' + id)
}

export function hdzzEdit(data, method) { //添加、编辑
    return write('/admin-api/hdzz', data, method)
}

