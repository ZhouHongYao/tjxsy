/**
 * @author zhy 2019-01-07
 * @description 学生干部-相关接口
 */
import { read, write, del } from '@/api/index'

export function xsgbList(params) { //列表
    return read('/admin-api/xsgb', params)
}

export function xsgbDel(id) { //删除
    return del('/admin-api/xsgb', id)
}

export function xsgbRead(id) { //详情
    return read('/admin-api/xsgb/' + id)
}

export function xsgbEdit(data, method) { //添加、编辑
    return write('/admin-api/xsgb', data, method)
}

