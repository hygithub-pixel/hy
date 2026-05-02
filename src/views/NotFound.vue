<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <div class="text-center">
      <a-result
        status="404"
        title="404"
        sub-title="抱歉，页面不存在"
      >
        <template #extra>
          <a-button type="primary" @click="goHome">返回首页</a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>
