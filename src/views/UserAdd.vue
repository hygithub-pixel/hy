<template>
  <div class="flex h-screen">
    <Sidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopNav />
      
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div class="bg-white rounded-lg shadow-sm">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
            <div class="flex items-center gap-3">
              <a-button type="text" @click="handleBack">
                <ArrowLeftOutlined />
              </a-button>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
                <p class="text-sm text-gray-500 mt-1">填写用户基本信息，带 * 为必填项</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <a-form :model="formData" layout="vertical">
              <div class="border-b border-[#e8e8e8] pb-4 mb-6">
                <h3 class="text-base font-medium text-gray-900 flex items-center gap-2">
                  <span class="w-1 h-5 bg-blue-500 rounded"></span>
                  基本信息
                </h3>
              </div>

              <div class="grid grid-cols-2 gap-6 mb-6">
                <a-form-item label="用户名" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>
                    <span class="text-red-500 mr-1">*</span>用户名
                  </template>
                  <a-input v-model:value="formData.username" placeholder="请输入用户名" />
                </a-form-item>

                <a-form-item label="状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>
                    <span class="text-red-500 mr-1">*</span>状态
                  </template>
                  <a-space>
                    <a-radio-group v-model:value="formData.status">
                      <a-radio value="1">启用</a-radio>
                      <a-radio value="0">禁用</a-radio>
                    </a-radio-group>
                  </a-space>
                </a-form-item>

                <a-form-item label="昵称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>
                    <span class="text-red-500 mr-1">*</span>昵称
                  </template>
                  <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
                </a-form-item>

                <a-form-item label="角色" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>
                    <span class="text-red-500 mr-1">*</span>角色
                  </template>
                  <a-select v-model:value="formData.role" placeholder="请选择角色">
                    <a-select-option value="超级管理员">超级管理员</a-select-option>
                    <a-select-option value="产品经理">产品经理</a-select-option>
                    <a-select-option value="设计师">设计师</a-select-option>
                    <a-select-option value="运营专员">运营专员</a-select-option>
                    <a-select-option value="开发工程师">开发工程师</a-select-option>
                    <a-select-option value="测试工程师">测试工程师</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="邮箱" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>
                    <span class="text-red-500 mr-1">*</span>邮箱
                  </template>
                  <a-input v-model:value="formData.email" placeholder="请输入邮箱地址" />
                </a-form-item>

                <a-form-item label="性别" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>性别</template>
                  <a-space>
                    <a-radio-group v-model:value="formData.gender">
                      <a-radio value="男">男</a-radio>
                      <a-radio value="女">女</a-radio>
                    </a-radio-group>
                  </a-space>
                </a-form-item>

                <a-form-item label="手机号码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>手机号码</template>
                  <a-input v-model:value="formData.phone" placeholder="请输入手机号码" />
                </a-form-item>

                <a-form-item label="生日" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>生日</template>
                  <a-date-picker v-model:value="formData.birthday" placeholder="请选择日期" />
                </a-form-item>

                <a-form-item label="所属部门" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>所属部门</template>
                  <a-select v-model:value="formData.department" placeholder="请选择所属部门">
                    <a-select-option value="技术部">技术部</a-select-option>
                    <a-select-option value="产品部">产品部</a-select-option>
                    <a-select-option value="设计部">设计部</a-select-option>
                    <a-select-option value="运营部">运营部</a-select-option>
                    <a-select-option value="测试部">测试部</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="入职日期" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>入职日期</template>
                  <a-date-picker v-model:value="formData.entryDate" placeholder="请选择日期" />
                </a-form-item>
              </div>

              <div class="border-b border-[#e8e8e8] pb-4 mb-6">
                <h3 class="text-base font-medium text-gray-900 flex items-center gap-2">
                  <span class="w-1 h-5 bg-blue-500 rounded"></span>
                  账号信息
                </h3>
              </div>

              <div class="grid grid-cols-2 gap-6 mb-6">
                <a-form-item label="密码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>
                    <span class="text-red-500 mr-1">*</span>密码
                  </template>
                  <a-input-password v-model:value="formData.password" placeholder="请输入密码">
                    <template #suffix>
                      <EyeOutlined v-if="!showPassword" @click="showPassword = true" />
                      <EyeInvisibleOutlined v-else @click="showPassword = false" />
                    </template>
                  </a-input-password>
                  <p class="text-xs text-gray-400 mt-1">密码长度为 6-20 位，必须包含字母和数字</p>
                </a-form-item>

                <a-form-item label="登录方式" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>
                    <span class="text-red-500 mr-1">*</span>登录方式
                  </template>
                  <a-space>
                    <a-checkbox-group v-model:value="formData.loginType">
                      <a-checkbox value="username">账号密码</a-checkbox>
                      <a-checkbox value="phone">手机号登录</a-checkbox>
                      <a-checkbox value="email">邮箱登录</a-checkbox>
                    </a-checkbox-group>
                  </a-space>
                </a-form-item>

                <a-form-item label="确认密码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>确认密码</template>
                  <a-input-password v-model:value="formData.confirmPassword" placeholder="请再次输入密码">
                    <template #suffix>
                      <EyeOutlined v-if="!showConfirmPassword" @click="showConfirmPassword = true" />
                      <EyeInvisibleOutlined v-else @click="showConfirmPassword = false" />
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-form-item label="备注" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <template #label>备注</template>
                  <a-textarea v-model:value="formData.remark" placeholder="请输入备注信息" :maxlength="200" :show-count="true" :rows="4" />
                </a-form-item>
              </div>

              <div class="border-b border-[#e8e8e8] pb-4 mb-6">
                <h3 class="text-base font-medium text-gray-900 flex items-center gap-2">
                  <span class="w-1 h-5 bg-blue-500 rounded"></span>
                  其他信息
                </h3>
              </div>

              <div class="flex items-center gap-6 mb-8">
                <a-form-item label="头像" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                  <template #label>头像</template>
                  <a-upload
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    accept="image/*"
                  >
                    <div class="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                      <PlusOutlined class="text-gray-400 text-xl" />
                      <span class="text-xs text-gray-400 mt-1">上传头像</span>
                    </div>
                  </a-upload>
                  <p class="text-xs text-gray-400 mt-2">支持 JPG、PNG 格式，大小不超过 2MB</p>
                </a-form-item>
              </div>

              <div class="flex items-center justify-end gap-3">
                <a-button @click="handleCancel">取消</a-button>
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleSave">保存</a-button>
              </div>
            </a-form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';

const router = useRouter();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const formData = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  status: '1',
  gender: '男',
  birthday: null,
  entryDate: null,
  password: '',
  confirmPassword: '',
  loginType: ['username'],
  remark: '',
  avatar: '',
});

const beforeUpload = () => {
  return false;
};

const handleBack = () => {
  router.push('/users');
};

const handleCancel = () => {
  router.push('/users');
};

const handleReset = () => {
  Object.assign(formData, {
    username: '',
    nickname: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    status: '1',
    gender: '男',
    birthday: null,
    entryDate: null,
    password: '',
    confirmPassword: '',
    loginType: ['username'],
    remark: '',
    avatar: '',
  });
};

const handleSave = () => {
  console.log('保存:', formData);
  router.push('/users');
};
</script>
