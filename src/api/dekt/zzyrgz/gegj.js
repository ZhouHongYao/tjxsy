/**
 * @author zhy 2019-01-23
 * @description 感恩国家-相关接口
 */
import { read, write, del } from '@/api/index'

export function gegjList(params) { //列表
    return read('/admin-api/gegj', params)
}

export function gegjDel(id) { //删除
    return del('/admin-api/gegj', id)
}

export function gegjRead(id) { //详情
    return read('/admin-api/gegj/' + id)
}

export function gegjEdit(data, method) { //编辑
    return write('/admin-api/gegj', data, method)
}

