/**
 * @author zhy 2019-01-14
 * @description 学年设置-相关接口
 */
import { read, write, del } from '@/api/index'

export function yearsList(params) { //列表
    return read('/admin-api/years', params)
}

export function yearsDel(id) { //删除
    return del('/admin-api/years', id)
}

export function yearsRead(id) { //详情
    return read('/admin-api/years/' + id)
}

export function yearsEdit(data, method) { //添加、编辑
    return write('/admin-api/years', data, method)
}
