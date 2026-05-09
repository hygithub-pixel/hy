export default [
  {
    url: '/api/roles',
    method: 'get',
    response: ({ query }) => {
      const current = parseInt(query.current as string) || 1
      const pageSize = parseInt(query.pageSize as string) || 10
      const roleName = query.roleName as string || ''
      const status = query.status as string

      const list = [
        { id: 1, roleName: '超级管理员', roleCode: 'SUPER_ADMIN', description: '系统最高权限管理员', status: 1, userCount: 2, dataPermissions: 'all', createTime: '2024-01-01 10:00:00' },
        { id: 2, roleName: '产品经理', roleCode: 'PRODUCT_MANAGER', description: '负责产品规划和设计', status: 1, userCount: 5, dataPermissions: 'dept', createTime: '2024-01-05 14:30:00' },
        { id: 3, roleName: '设计师', roleCode: 'DESIGNER', description: '负责产品UI/UX设计', status: 1, userCount: 3, dataPermissions: 'dept', createTime: '2024-01-08 09:15:00' },
        { id: 4, roleName: '运营专员', roleCode: 'OPERATOR', description: '负责日常运营工作', status: 1, userCount: 8, dataPermissions: 'self', createTime: '2024-01-10 11:20:00' },
        { id: 5, roleName: '开发工程师', roleCode: 'DEVELOPER', description: '负责系统开发', status: 1, userCount: 12, dataPermissions: 'dept', createTime: '2024-01-12 16:45:00' },
        { id: 6, roleName: '测试工程师', roleCode: 'TESTER', description: '负责系统测试', status: 0, userCount: 4, dataPermissions: 'self', createTime: '2024-01-15 08:30:00' },
        { id: 7, roleName: '访客', roleCode: 'GUEST', description: '仅查看权限', status: 0, userCount: 10, dataPermissions: 'self', createTime: '2024-02-01 10:00:00' },
      ]

      let filtered = list
      if (roleName) filtered = filtered.filter(item => item.roleName.includes(roleName))
      if (status !== undefined && status !== '') filtered = filtered.filter(item => item.status === parseInt(status as string))

      const start = (current - 1) * pageSize
      return { code: 200, message: 'success', data: { list: filtered.slice(start, start + pageSize), total: filtered.length, current, pageSize } }
    },
  },
  { url: '/api/roles', method: 'post', response: ({ body }) => ({ code: 200, message: '新增成功', data: { id: Date.now(), ...body } }) },
  { url: '/api/roles/:id', method: 'get', response: ({ url }) => ({ code: 200, message: 'success', data: { id: url.split('/').pop(), roleName: '超级管理员', roleCode: 'SUPER_ADMIN', description: '系统最高权限管理员', status: 1, dataPermissions: ['all'] } }) },
  { url: '/api/roles/:id', method: 'put', response: ({ body }) => ({ code: 200, message: '更新成功', data: body }) },
  { url: '/api/roles/:id', method: 'delete', response: () => ({ code: 200, message: '删除成功', data: null }) },
]
