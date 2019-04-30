/**
 * @author zhy 2019-01-24
 * @description 成绩基本情况-相关接口
 */
import { read, write, del } from '@/api/index'

export function cjjbqkList(params) { //列表
    return read('/admin-api/cjjbqk', params)
}

export function cjjbqkDel(id) { //删除
    return del('/admin-api/cjjbqk', id)
}

export function cjjbqkRead(id) { //详情
    return read('/admin-api/cjjbqk/' + id)
}

export function cjjbqkEdit(data, method) { //添加、编辑
    return write('/admin-api/cjjbqk', data, method)
}
