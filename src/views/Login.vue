<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 lg:p-8"
  >
    <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="hidden lg:flex flex-col items-center justify-center space-y-8 text-center p-8">
        <div class="flex items-center gap-3">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center"
          >
            <HomeOutlined style="font-size: 40px; color: white;" />
          </div>
          <h1 class="text-4xl font-bold text-slate-800">Vue3 Admin</h1>
        </div>
        <p class="text-xl text-slate-600 max-w-md">
          现代化的管理后台系统，为您提供高效、直观的管理体验
        </p>
        <div class="w-full max-w-md">
          <img
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text-to-image?prompt=modern%20admin%20dashboard%20interface%20minimal%20clean%20design&image_size=landscape_16_9"
            alt="管理系统界面"
            loading="lazy"
            width="640"
            height="360"
            class="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
        <div class="flex gap-6 text-sm text-slate-500">
          <span>✓ 高效管理</span>
          <span>✓ 直观操作</span>
          <span>✓ 安全可靠</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 lg:p-10 w-full max-w-md mx-auto">
        <div class="lg:hidden flex items-center gap-3 mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center"
          >
            <HomeOutlined style="font-size: 24px; color: white;" />
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Vue3 Admin</h1>
        </div>

        <h2 class="text-2xl font-bold text-slate-800 mb-2">欢迎回来</h2>
        <p class="text-slate-500 mb-8">请登录您的账户</p>

        <a-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="flex flex-col gap-6 sm:gap-4"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              autocomplete="username"
              size="large"
              :prefix="h(UserOutlined)"
              class="rounded-lg"
            />
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
              v-model:value="loginForm.password"
              placeholder="请输入密码"
              name="password"
              autocomplete="current-password"
              size="large"
              :prefix="h(LockOutlined)"
              class="rounded-lg"
              @keyup.enter="handleLogin"
            />
          </a-form-item>

          <div class="flex items-center justify-between mb-6">
            <a-checkbox v-model:checked="loginForm.remember">记住我</a-checkbox>
            <a-button type="link" class="text-indigo-600 p-0 h-auto">忘记密码？</a-button>
          </div>

          <a-form-item>
            <a-button
              type="primary"
              size="large"
              class="w-full rounded-lg h-12 text-base"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="mt-8 text-center text-sm text-slate-500">
          <p>提示：任意用户名密码均可登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { useUser } from '@/composables/useUser';
import { notificationService } from '@/services/notificationService';

const router = useRouter();
const { login, loading } = useUser();

const loginFormRef = ref();

const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
});

const loginRules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, message: '密码长度不能少于3位', trigger: 'blur' },
  ],
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    const result = await login(loginForm.username, loginForm.password);
    if (result.success) {
      notificationService.success('登录成功');
      router.push('/dashboard');
    }
  } catch (error) {
    notificationService.error('登录失败，请重试');
  }
};
</script>
