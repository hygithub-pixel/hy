import * as fs from 'fs';
import * as path from 'path';
import {
  ProjectAnalysisResult,
  DependencyAnalysisResult,
  ComponentAnalysisResult,
  StyleAnalysisResult,
  ReportConfig
} from '../../types/analysis.ts';

export class ReportGenerator {
  private config: ReportConfig;

  constructor(config: Partial<ReportConfig> = {}) {
    this.config = {
      includeDependencies: true,
      includeComponents: true,
      includeStyle: true,
      outputPath: './analysis-report.md',
      ...config
    };
  }

  generate(result: ProjectAnalysisResult): string {
    let markdown = `# 项目分析报告\n\n`;
    markdown += `生成时间: ${result.timestamp.toLocaleString('zh-CN')}\n\n`;
    markdown += `---\n\n`;

    if (this.config.includeDependencies) {
      markdown += this.generateDependencySection(result.dependencyAnalysis);
    }

    if (this.config.includeComponents) {
      markdown += this.generateComponentSection(result.componentAnalysis);
    }

    if (this.config.includeStyle) {
      markdown += this.generateStyleSection(result.styleAnalysis);
    }

    markdown += this.generateSummary(result);

    return markdown;
  }

  generateAndSave(result: ProjectAnalysisResult): string {
    const markdown = this.generate(result);
    fs.writeFileSync(this.config.outputPath, markdown, 'utf-8');
    return this.config.outputPath;
  }

  private generateDependencySection(analysis: DependencyAnalysisResult): string {
    let section = `## 1. 依赖关系分析\n\n`;

    section += `### 1.1 统计概览\n\n`;
    section += `| 指标 | 数值 |\n`;
    section += `|------|------|\n`;
    section += `| 模块总数 | ${analysis.stats.totalModules} |\n`;
    section += `| 依赖总数 | ${analysis.stats.totalDependencies} |\n`;
    section += `| 平均依赖数 | ${analysis.stats.avgDependenciesPerModule} |\n`;
    section += `| 最大依赖数 | ${analysis.stats.maxDependencies} |\n`;
    section += `\n`;

    if (analysis.stats.modulesWithMostDependencies.length > 0) {
      section += `### 1.2 依赖最多的模块\n\n`;
      section += `| 排名 | 模块路径 |\n`;
      section += `|------|----------|\n`;
      analysis.stats.modulesWithMostDependencies.forEach((module, index) => {
        section += `| ${index + 1} | \`${module}\` |\n`;
      });
      section += `\n`;
    }

    if (analysis.circularDependencies.length > 0) {
      section += `### 1.3 循环依赖检测\n\n`;
      section += `**发现 ${analysis.circularDependencies.length} 个循环依赖**\n\n`;
      analysis.circularDependencies.forEach((cycle, index) => {
        section += `#### 循环 ${index + 1}\n\n`;
        section += `\`\`\`\n${cycle.path.join(' -> ')}\n\`\`\`\n\n`;
      });
    } else {
      section += `### 1.3 循环依赖检测\n\n`;
      section += `✓ 未发现循环依赖\n\n`;
    }

    section += `### 1.4 依赖矩阵\n\n`;
    const sortedModules = Object.keys(analysis.dependencyMatrix).sort();
    sortedModules.forEach(module => {
      const deps = analysis.dependencyMatrix[module];
      if (deps.length > 0) {
        section += `**\`${module}\`** 依赖:\n\n`;
        section += `- ${deps.map(d => `\`${d}\``).join('\n- ')}\n\n`;
      }
    });

    section += `---\n\n`;
    return section;
  }

  private generateComponentSection(analysis: ComponentAnalysisResult): string {
    let section = `## 2. 关键组件分析\n\n`;

    section += `### 2.1 统计概览\n\n`;
    section += `| 类别 | 数量 |\n`;
    section += `|------|------|\n`;
    section += `| Vue组件 | ${analysis.stats.totalComponents} |\n`;
    section += `| Composables | ${analysis.stats.totalComposables} |\n`;
    section += `| Stores | ${analysis.stats.totalStores} |\n`;
    section += `| Services | ${analysis.stats.totalServices} |\n`;
    section += `| 平均复杂度 | ${analysis.stats.avgComponentComplexity} |\n`;
    section += `\n`;

    if (analysis.components.length > 0) {
      section += `### 2.2 Vue组件\n\n`;
      section += `| 组件名称 | 文件路径 | 复杂度 | 行数 |\n`;
      section += `|----------|----------|--------|------|\n`;
      analysis.components.forEach(comp => {
        section += `| ${comp.name} | \`${comp.filePath}\` | ${comp.complexity} | ${comp.lineCount} |\n`;
      });
      section += `\n`;
    }

    if (analysis.composables.length > 0) {
      section += `### 2.3 Composables\n\n`;
      section += `| 名称 | 文件路径 | 复杂度 | 行数 |\n`;
      section += `|------|----------|--------|------|\n`;
      analysis.composables.forEach(comp => {
        section += `| ${comp.name} | \`${comp.filePath}\` | ${comp.complexity} | ${comp.lineCount} |\n`;
      });
      section += `\n`;
    }

    if (analysis.stats.mostComplexComponents.length > 0) {
      section += `### 2.4 最复杂的组件\n\n`;
      section += `| 排名 | 组件名称 |\n`;
      section += `|------|----------|\n`;
      analysis.stats.mostComplexComponents.forEach((name, index) => {
        section += `| ${index + 1} | ${name} |\n`;
      });
      section += `\n`;
    }

    section += `### 2.5 组件调用关系\n\n`;
    const allComponents = [...analysis.components, ...analysis.composables, ...analysis.stores, ...analysis.services];
    allComponents.forEach(comp => {
      if (comp.uses.length > 0 || comp.usedBy.length > 0) {
        section += `**${comp.name}**\n\n`;
        if (comp.uses.length > 0) {
          section += `- 依赖: ${comp.uses.join(', ')}\n`;
        }
        if (comp.usedBy.length > 0) {
          section += `- 被依赖: ${comp.usedBy.join(', ')}\n`;
        }
        section += `\n`;
      }
    });

    section += `---\n\n`;
    return section;
  }

  private generateStyleSection(analysis: StyleAnalysisResult): string {
    let section = `## 3. 代码编码风格分析\n\n`;

    section += `### 3.1 统计概览\n\n`;
    section += `| 指标 | 数值 |\n`;
    section += `|------|------|\n`;
    section += `| 分析文件数 | ${analysis.stats.totalFiles} |\n`;
    section += `| 问题总数 | ${analysis.stats.totalIssues} |\n`;
    section += `| 错误数 | ${analysis.stats.errorCount} |\n`;
    section += `| 警告数 | ${analysis.stats.warningCount} |\n`;
    section += `| 提示数 | ${analysis.stats.infoCount} |\n`;
    section += `| 注释覆盖率 | ${analysis.stats.commentCoverage}% |\n`;
    section += `| 平均行长度 | ${analysis.stats.avgLineLength} |\n`;
    section += `| 合规率 | ${analysis.stats.complianceRate}% |\n`;
    section += `\n`;

    if (analysis.issues.length > 0) {
      section += `### 3.2 问题详情\n\n`;
      
      const issuesByRule: Record<string, typeof analysis.issues> = {};
      analysis.issues.forEach(issue => {
        if (!issuesByRule[issue.rule]) {
          issuesByRule[issue.rule] = [];
        }
        issuesByRule[issue.rule].push(issue);
      });

      const ruleNames: Record<string, string> = {
        camelCase: '驼峰命名',
        PascalCase: '帕斯卡命名',
        snake_case: '下划线命名',
        kebab_case: '短横线命名',
        indentation: '缩进',
        lineLength: '行长度',
        commentCoverage: '注释覆盖率',
        unusedImport: '未使用导入',
        trailingWhitespace: '行尾空格'
      };

      for (const rule in issuesByRule) {
        section += `#### ${ruleNames[rule] || rule}\n\n`;
        section += `| 文件 | 行 | 列 | 消息 |\n`;
        section += `|------|----|----|------|\n`;
        issuesByRule[rule].forEach(issue => {
          const severityIcon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
          section += `| \`${issue.filePath}\` | ${issue.line} | ${issue.column} | ${severityIcon} ${issue.message} |\n`;
        });
        section += `\n`;
      }
    } else {
      section += `### 3.2 问题详情\n\n`;
      section += `✓ 未发现代码风格问题\n\n`;
    }

    section += `---\n\n`;
    return section;
  }

  private generateSummary(result: ProjectAnalysisResult): string {
    let summary = `## 4. 总结与建议\n\n`;

    const issues: string[] = [];
    const suggestions: string[] = [];

    if (result.dependencyAnalysis.circularDependencies.length > 0) {
      issues.push(`发现 ${result.dependencyAnalysis.circularDependencies.length} 个循环依赖`);
      suggestions.push('建议消除循环依赖，可考虑通过中间层或事件总线解耦');
    }

    const highDepModules = result.dependencyAnalysis.stats.modulesWithMostDependencies;
    if (highDepModules.length > 0 && result.dependencyAnalysis.stats.maxDependencies > 10) {
      issues.push(`部分模块依赖过多（最大 ${result.dependencyAnalysis.stats.maxDependencies} 个）`);
      suggestions.push('建议拆分大型模块，降低耦合度');
    }

    if (result.componentAnalysis.stats.avgComponentComplexity > 20) {
      issues.push(`组件平均复杂度较高（${result.componentAnalysis.stats.avgComponentComplexity}）`);
      suggestions.push('建议提取复杂逻辑到composables或工具函数');
    }

    if (result.styleAnalysis.stats.complianceRate < 90) {
      issues.push(`代码风格合规率较低（${result.styleAnalysis.stats.complianceRate}%）`);
      suggestions.push('建议运行ESLint自动修复，并配置pre-commit钩子');
    }

    if (result.styleAnalysis.stats.commentCoverage < 5) {
      issues.push(`注释覆盖率较低（${result.styleAnalysis.stats.commentCoverage}%）`);
      suggestions.push('建议为核心函数和复杂逻辑添加注释');
    }

    if (issues.length === 0) {
      summary += `### 4.1 分析结论\n\n`;
      summary += `✓ 项目代码质量良好，未发现严重问题。\n\n`;
    } else {
      summary += `### 4.1 发现的问题\n\n`;
      issues.forEach(issue => {
        summary += `- ⚠️ ${issue}\n`;
      });
      summary += `\n`;

      summary += `### 4.2 优化建议\n\n`;
      suggestions.forEach((suggestion, index) => {
        summary += `${index + 1}. ${suggestion}\n`;
      });
      summary += `\n`;
    }

    summary += `### 4.3 核心指标汇总\n\n`;
    summary += `| 类别 | 指标 | 数值 |\n`;
    summary += `|------|------|------|\n`;
    summary += `| 依赖 | 模块总数 | ${result.dependencyAnalysis.stats.totalModules} |\n`;
    summary += `| 依赖 | 循环依赖 | ${result.dependencyAnalysis.circularDependencies.length} |\n`;
    summary += `| 组件 | Vue组件数 | ${result.componentAnalysis.stats.totalComponents} |\n`;
    summary += `| 组件 | Composables数 | ${result.componentAnalysis.stats.totalComposables} |\n`;
    summary += `| 风格 | 合规率 | ${result.styleAnalysis.stats.complianceRate}% |\n`;
    summary += `| 风格 | 注释覆盖率 | ${result.styleAnalysis.stats.commentCoverage}% |\n`;

    return summary;
  }
}
