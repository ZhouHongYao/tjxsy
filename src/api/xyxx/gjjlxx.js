/**
 * @author zhy 2019-01-25
 * @description 国际交流学习-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function gjjlxxList(params) { //列表
    return read('/admin-api/gjjlxx', params)
}

export function gjjlxxDel(id) { //删除
    return del('/admin-api/gjjlxx', id)
}

export function gjjlxxRead(id) { //详情
    return read('/admin-api/gjjlxx/' + id)
}

export function gjjlxxEdit(data, method) { //添加、编辑
    return write('/admin-api/gjjlxx', data, method)
}

export function gjjlxxSh(data) { //审核
	return modify('/admin-api/gjjlxx-sh', data)
}
