/**
 * @author zhy 2019-01-25
 * @description 科创项目-相关接口
 */
import { read, write, modify, del } from '@/api/index'

export function kcxmList(params) { //列表
    return read('/admin-api/kcxm', params)
}

export function kcxmDel(id) { //删除
    return del('/admin-api/kcxm', id)
}

export function kcxmRead(id) { //详情
    return read('/admin-api/kcxm/' + id)
}

export function kcxmEdit(data, method) { //添加、编辑
    return write('/admin-api/kcxm', data, method)
}

export function kcxmSh(data) { //审核
	return modify('/admin-api/kcxm-sh', data)
}
