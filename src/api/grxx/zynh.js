/**
 * @author zhy 2019-01-5
 * @description 致一年后的自己-相关接口
 */
import { read, write, del } from '@/api/index'

export function zynhList(params) { //列表
    return read('/admin-api/zynh', params)
}

export function zynhDel(id) { //删除
    return del('/admin-api/zynh', id)
}

export function zynhRead(id) { //详情
    return read('/admin-api/zynh/' + id)
}

export function zynhEdit(data, method) { //添加、编辑
    return write('/admin-api/zynh', data, method)
}
