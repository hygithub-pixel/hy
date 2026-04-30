const fs = require('fs');
const path = require('path');

// 目标目录
const targetDir = path.join(__dirname, '../src/stores');

// 递归遍历目录，处理所有JSON文件
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // 递归处理子目录
      processDirectory(filePath);
    } else if (stats.isFile() && path.extname(file) === '.json') {
      // 处理JSON文件
      processJsonFile(filePath);
    }
  });
}

// 处理单个JSON文件，去除width属性
function processJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    // 递归遍历对象，去除width属性
    removeWidthAttributes(data);

    // 写回文件
    const updatedContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, updatedContent);

    console.log(`处理完成: ${filePath}`);
  } catch (error) {
    console.error(`处理文件时出错 ${filePath}:`, error.message);
  }
}

// 递归去除width属性
function removeWidthAttributes(obj) {
  if (obj === null || typeof obj !== 'object') {
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach(item => removeWidthAttributes(item));
  } else {
    // 检查并删除width属性
    if ('width' in obj) {
      delete obj.width;
    }

    // 递归处理所有属性
    Object.keys(obj).forEach(key => {
      removeWidthAttributes(obj[key]);
    });
  }
}

// 开始处理
console.log('开始处理JSON文件，去除width属性...');
processDirectory(targetDir);
console.log('处理完成！');
