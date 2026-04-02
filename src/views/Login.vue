<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 lg:p-8">
    <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <!-- 左侧品牌区域 -->
      <div class="hidden lg:flex flex-col items-center justify-center space-y-8 text-center p-8">
        <div class="flex items-center gap-3">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <el-icon :size="40" class="text-white">
              <House />
            </el-icon>
          </div>
          <h1 class="text-4xl font-bold text-slate-800">Vue3 Admin</h1>
        </div>
        <p class="text-xl text-slate-600 max-w-md">
          现代化的管理后台系统，为您提供高效、直观的管理体验
        </p>
        <div class="w-full max-w-md">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20admin%20dashboard%20interface%20minimal%20clean%20design&image_size=landscape_16_9" 
            alt="管理系统界面" 
            loading="lazy"
            class="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
        <div class="flex gap-6 text-sm text-slate-500">
          <span>✓ 高效管理</span>
          <span>✓ 直观操作</span>
          <span>✓ 安全可靠</span>
        </div>
      </div>

      <!-- 右侧登录区域 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 lg:p-10 w-full max-w-md mx-auto">
        <div class="lg:hidden flex items-center gap-3 mb-8">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <el-icon :size="24" class="text-white">
              <House />
            </el-icon>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Vue3 Admin</h1>
        </div>
        
        <h2 class="text-2xl font-bold text-slate-800 mb-2">欢迎回来</h2>
        <p class="text-slate-500 mb-8">请登录您的账户</p>
        
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="space-y-6">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
              class="rounded-lg"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
              class="rounded-lg"
            />
          </el-form-item>
          
          <div class="flex items-center justify-between mb-6">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-button type="text" class="text-indigo-600">忘记密码？</el-button>
          </div>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="w-full rounded-lg h-12 text-base"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="mt-8 text-center text-sm text-slate-500">
          <p>提示：任意用户名密码均可登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { House, User, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
});

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, message: '密码长度不能少于3位', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const result = await userStore.login(loginForm.username, loginForm.password);
        if (result.success) {
          ElMessage.success('登录成功');
          router.push('/dashboard');
        }
      } catch (error) {
        ElMessage.error('登录失败，请重试');
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.space-y-6 {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .space-y-6 {
    gap: 1rem;
  }
}
</style>
