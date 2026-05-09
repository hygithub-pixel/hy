export default [
  {
    url: '/api/users',
    method: 'get',
    response: ({ query }) => {
      const current = parseInt(query.current as string) || 1
      const pageSize = parseInt(query.pageSize as string) || 10
      const username = query.username as string || ''
      const status = query.status as string

      const list = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        username: `user_${i + 1}`,
        nickname: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'][i % 8] + (i + 1),
        email: `user${i + 1}@example.com`,
        phone: `138${String(i + 1).padStart(8, '0')}`,
        department: ['技术部', '产品部', '设计部', '运营部', '测试部'][i % 5],
        role: ['超级管理员', '产品经理', '设计师', '运营专员', '开发工程师', '测试工程师'][i % 6],
        status: i % 4 === 0 ? 0 : 1,
        gender: i % 2 === 0 ? '男' : '女',
        createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
      }))

      let filtered = list
      if (username) {
        filtered = filtered.filter(item => item.username.includes(username) || item.nickname.includes(username))
      }
      if (status !== undefined && status !== '') {
        filtered = filtered.filter(item => item.status === parseInt(status as string))
      }

      const start = (current - 1) * pageSize
      const end = start + pageSize

      return {
        code: 200,
        message: 'success',
        data: {
          list: filtered.slice(start, end),
          total: filtered.length,
          current,
          pageSize,
        },
      }
    },
  },
  {
    url: '/api/users',
    method: 'post',
    response: ({ body }) => {
      return { code: 200, message: '新增成功', data: { id: Date.now(), ...body } }
    },
  },
  {
    url: '/api/users/:id',
    method: 'put',
    response: ({ body }) => {
      return { code: 200, message: '更新成功', data: body }
    },
  },
  {
    url: '/api/users/:id',
    method: 'delete',
    response: () => {
      return { code: 200, message: '删除成功', data: null }
    },
  },
]
