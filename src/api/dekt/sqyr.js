/**
 * @author zhy 2019-01-05
 * @description 社区育人-相关接口
 */
import { read, write, del } from '@/api/index'

export function sqyrList(params) { //列表
    return read('/admin-api/sqyr', params)
}

export function sqyrDel(id) { //删除
    return del('/admin-api/sqyr', id)
}

export function sqyrRead(id) { //详情
    return read('/admin-api/sqyr/' + id)
}

export function sqyrEdit(data, method) { //添加、编辑
    return write('/admin-api/sqyr', data, method)
}
