const fs = require('fs');
const path = require('path');

// 模拟性能监控报告数据
const generatePerformanceReport = () => {
  return {
    metrics: [
      // 导航指标
      { name: 'DNS查询时间', value: 12.34, type: 'navigation' },
      { name: 'TCP连接时间', value: 23.45, type: 'navigation' },
      { name: 'SSL握手时间', value: 34.56, type: 'navigation' },
      { name: 'DOM解析时间', value: 45.67, type: 'navigation' },
      { name: '资源加载时间', value: 56.78, type: 'navigation' },
      { name: '首字节时间(TTFB)', value: 67.89, type: 'navigation' },
      { name: '页面完全加载时间', value: 1234.56, type: 'navigation' },
      { name: 'DOM构建时间', value: 78.9, type: 'navigation' },

      // 绘制指标
      { name: 'first-paint', value: 123.45, type: 'paint' },
      { name: 'first-contentful-paint', value: 234.56, type: 'paint' },
      { name: 'LCP (最大内容绘制)', value: 345.67, type: 'paint' },
      { name: 'CLS (累积布局偏移)', value: 0.12, type: 'paint' },
      { name: 'FID (首次输入延迟)', value: 12.34, type: 'paint' },

      // 资源指标
      {
        name: '慢资源: http://localhost:5177/mgmt-cli-ebank/assets/index.js',
        value: 1234.56,
        type: 'resource',
      },

      // 自定义指标
      { name: 'route-/', value: 123.45, type: 'custom' },
      { name: 'route-dashboard', value: 234.56, type: 'custom' },
    ],
    timestamp: Date.now(),
    url: 'http://localhost:5177/mgmt-cli-ebank/',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  };
};

// 生成性能监控HTML报告
const generateHTMLReport = report => {
  const metricsByType = report.metrics.reduce((acc, metric) => {
    if (!acc[metric.type]) {
      acc[metric.type] = [];
    }
    acc[metric.type].push(metric);
    return acc;
  }, {});

  const typeLabels = {
    navigation: '导航性能',
    paint: '绘制性能',
    resource: '资源性能',
    custom: '自定义性能',
  };

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>性能监控报告</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .header {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header p {
      margin-bottom: 10px;
    }
    
    .metric-section {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    h2 {
      color: #444;
      margin-bottom: 15px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    
    tr:hover {
      background-color: #f8f9fa;
    }
    
    .metric-value {
      font-weight: 600;
    }
    
    .warning {
      color: #ff9800;
    }
    
    .error {
      color: #f44336;
    }
    
    .success {
      color: #4caf50;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 性能监控报告</h1>
    
    <div class="header">
      <p><strong>报告生成时间:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
      <p><strong>测试URL:</strong> ${report.url}</p>
      <p><strong>用户代理:</strong> ${report.userAgent}</p>
    </div>
    
    ${Object.entries(metricsByType)
      .map(
        ([type, metrics]) => `
    <div class="metric-section">
      <h2>${typeLabels[type] || type}</h2>
      <table>
        <thead>
          <tr>
            <th>指标名称</th>
            <th>数值</th>
            <th>类型</th>
          </tr>
        </thead>
        <tbody>
          ${metrics
            .map(metric => {
              let className = 'success';
              if (metric.name.includes('慢资源')) className = 'error';
              else if (metric.name.includes('CLS') && metric.value > 0.1) className = 'warning';
              else if (metric.name.includes('LCP') && metric.value > 2000) className = 'warning';
              else if (metric.name.includes('FID') && metric.value > 100) className = 'warning';

              return `
            <tr>
              <td>${metric.name}</td>
              <td class="metric-value ${className}">
                ${metric.name.includes('CLS') ? metric.value.toFixed(3) : `${metric.value.toFixed(2)}ms`}
              </td>
              <td>${typeLabels[metric.type] || metric.type}</td>
            </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
    `
      )
      .join('')}
  </div>
</body>
</html>
  `;

  return html;
};

// 生成JSON报告
const generateJSONReport = report => {
  return JSON.stringify(report, null, 2);
};

// 导出报告
const exportReports = () => {
  const report = generatePerformanceReport();

  // 确保输出目录存在
  const outputDir = path.join(__dirname, '../performance-reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 导出HTML报告
  const htmlReport = generateHTMLReport(report);
  const htmlPath = path.join(outputDir, `performance-report-${Date.now()}.html`);
  fs.writeFileSync(htmlPath, htmlReport);

  // 导出JSON报告
  const jsonReport = generateJSONReport(report);
  const jsonPath = path.join(outputDir, `performance-report-${Date.now()}.json`);
  fs.writeFileSync(jsonPath, jsonReport);

  console.log(`性能监控报告已导出:`);
  console.log(`HTML报告: ${htmlPath}`);
  console.log(`JSON报告: ${jsonPath}`);

  return { htmlPath, jsonPath };
};

// 执行导出
if (require.main === module) {
  exportReports();
}

module.exports = { exportReports, generatePerformanceReport };
