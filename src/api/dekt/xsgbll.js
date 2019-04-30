/**
 * @author zhy 2019-01-05
 * @description 学生干部履历-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function xsgbllList(params) { //列表
    return read('/admin-api/xsgbll', params)
}

export function xsgbllDel(id) { //删除
    return del('/admin-api/xsgbll', id)
}

export function xsgbllRead(id) { //详情
    return read('/admin-api/xsgbll/' + id)
}

export function xsgbllEdit(data, method) { //添加、编辑
    return write('/admin-api/xsgbll', data, method)
}

export function xsgbllSh(data) { //审核
	return modify('/admin-api/xsgbll-sh', data)
}

export function studentInfo(data) { //审核
	return modify('/admin-api/xsgbll-sh', data)
}
