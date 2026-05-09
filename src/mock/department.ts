export default [
  {
    url: '/api/departments',
    method: 'get',
    response: ({ query }) => {
      const current = parseInt(query.current as string) || 1
      const pageSize = parseInt(query.pageSize as string) || 10
      const deptName = query.deptName as string || ''
      const status = query.status as string

      const list = [
        { id: 1, deptName: '总公司', deptCode: 'ROOT', parentId: null, parentName: '', leader: '张三', phone: '13800000000', userCount: 50, status: 1, sort: 0, remark: '集团总部' },
        { id: 2, deptName: '技术部', deptCode: 'TECH', parentId: 1, parentName: '总公司', leader: '李四', phone: '13800000001', userCount: 15, status: 1, sort: 1, remark: '负责技术研发' },
        { id: 3, deptName: '产品部', deptCode: 'PRODUCT', parentId: 1, parentName: '总公司', leader: '王五', phone: '13800000002', userCount: 10, status: 1, sort: 2, remark: '负责产品设计' },
        { id: 4, deptName: '设计部', deptCode: 'DESIGN', parentId: 1, parentName: '总公司', leader: '赵六', phone: '13800000003', userCount: 8, status: 1, sort: 3, remark: '负责UI/UX设计' },
        { id: 5, deptName: '运营部', deptCode: 'OPERATION', parentId: 1, parentName: '总公司', leader: '钱七', phone: '13800000004', userCount: 12, status: 1, sort: 4, remark: '负责日常运营' },
        { id: 6, deptName: '测试部', deptCode: 'QA', parentId: 2, parentName: '技术部', leader: '孙八', phone: '13800000005', userCount: 5, status: 1, sort: 5, remark: '负责质量保障' },
        { id: 7, deptName: '前端组', deptCode: 'FRONTEND', parentId: 2, parentName: '技术部', leader: '周九', phone: '13800000006', userCount: 4, status: 0, sort: 6, remark: '负责前端开发' },
        { id: 8, deptName: '市场部', deptCode: 'MARKET', parentId: 1, parentName: '总公司', leader: '吴十', phone: '13800000007', userCount: 6, status: 1, sort: 7, remark: '负责市场营销' },
      ]

      let filtered = list
      if (deptName) filtered = filtered.filter(item => item.deptName.includes(deptName))
      if (status !== undefined && status !== '') filtered = filtered.filter(item => item.status === parseInt(status as string))

      const start = (current - 1) * pageSize
      return { code: 200, message: 'success', data: { list: filtered.slice(start, start + pageSize), total: filtered.length, current, pageSize } }
    },
  },
  { url: '/api/departments', method: 'post', response: ({ body }) => ({ code: 200, message: '新增成功', data: { id: Date.now(), ...body } }) },
  { url: '/api/departments/:id', method: 'get', response: ({ url }) => ({ code: 200, message: 'success', data: { id: url.split('/').pop(), deptName: '技术部', deptCode: 'TECH', leader: '李四', phone: '13800000001', status: 1, sort: 1, remark: '负责技术研发' } }) },
  { url: '/api/departments/:id', method: 'put', response: ({ body }) => ({ code: 200, message: '更新成功', data: body }) },
  { url: '/api/departments/:id', method: 'delete', response: () => ({ code: 200, message: '删除成功', data: null }) },
]
