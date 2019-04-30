/**
 * @author zhy 2019-01-24
 * @description 学业成绩分析-相关接口
 */
import { read } from '@/api/index'

export function xycjfxList(params) { //列表
    return read('/admin-api/cjjbqk', params)
}

export function getPm() { //获取排名
    return read('/admin-api/cjjbqkpm')
}
