<template>
<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]"><template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeft<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-90<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态"<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态" :required="true">
              <a-radio-group v-model:value="form.status"><template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态" :required="true">
              <a-radio-group v-model:value="form.status">
                <a-radio :value="1<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态" :required="true">
              <a-radio-group v-model:value="form.status">
                <a-radio :value="1">启用</a-radio>
                <a<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态" :required="true">
              <a-radio-group v-model:value="form.status">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group><template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态" :required="true">
              <a-radio-group v-model:value="form.status">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="昵称" :required="<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态" :required="true">
              <a-radio-group v-model:value="form.status">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="昵称" :required="true">
              <a-input v-model:value="form.nickname" placeholder="请<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <component :is="componentMap['ArrowLeftOutlined']" />
        </a-button>
        <h2 class="text-lg font-semibold text-gray-900">新增用户</h2>
      </div>
    </div>

    <div class="p-6">
      <p class="text-sm text-gray-500 mb-6">填写用户基本信息，带 <span class="text-red-500">*</span> 为必填项</p>

      <a-form :model="form" layout="vertical">
        <div class="border rounded-lg p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1 h-5 bg-blue-500"></div>
            <h3 class="font-medium text-gray-900">基本信息</h3>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <a-form-item label="用户名" :required="true">
              <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="状态" :required="true">
              <a-radio-group v-model:value="form.status">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="昵称" :required="true">
              <a-input v-model:value="form.nickname" placeholder="请输入昵称" />
            </a-form-item>

            <a-form-item label="角色