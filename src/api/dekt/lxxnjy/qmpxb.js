/**
 * @author zhy 2019-01-21
 * @description 入党启蒙培训班-相关接口
 */
import { read, write, del } from '@/api/index'

export function groupList(params) { //分组列表
	return read('/admin-api/qmpxb', params)
}

export function onlineSet(num) { //在线分组
	return read('/admin-api/grouppxb/' + num)
}

export function kcList(sid) { //学生培训课程列表
	return read('/admin-api/pxkcs/' + sid)
}

export function qmpxbList(params) { //列表
	return read('/admin-api/pxbcy', params)
}

export function qmpxbDel(id) { //删除
	return del('/admin-api/pxbcy', id)
}

export function qmpxbRead(id) { //课程详情
	return read('/admin-api/pxbkc/' + id)
}

export function qmpxbEdit(data, method) { //添加、编辑课程反馈
	return write('/admin-api/pxbkc', data, method)
}

export function khRead(id) { //考核成绩详情
	return read('/admin-api/pxbcy/' + id)
}

export function khEdit(data, method) { //添加、编辑核成绩
	return write('/admin-api/pxbcy', data, method)
}
