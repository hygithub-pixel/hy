import {
  ProjectAnalysisResult,
  ReportConfig
} from '../../types/analysis.ts';
import { DependencyAnalyzer } from './dependencyAnalyzer.ts';
import { ComponentAnalyzer } from './componentAnalyzer.ts';
import { StyleAnalyzer } from './styleAnalyzer.ts';
import { ReportGenerator } from './reportGenerator.ts';

export class ProjectAnalyzer {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  analyze(): ProjectAnalysisResult {
    console.log('开始分析项目...');
    
    console.log('1/3 分析依赖关系...');
    const dependencyAnalyzer = new DependencyAnalyzer(this.projectRoot);
    const dependencyAnalysis = dependencyAnalyzer.analyze();
    console.log(`  发现 ${dependencyAnalysis.stats.totalModules} 个模块`);

    console.log('2/3 分析关键组件...');
    const componentAnalyzer = new ComponentAnalyzer(this.projectRoot);
    const componentAnalysis = componentAnalyzer.analyze();
    console.log(`  发现 ${componentAnalysis.stats.totalComponents} 个Vue组件`);
    console.log(`  发现 ${componentAnalysis.stats.totalComposables} 个Composables`);

    console.log('3/3 分析代码编码风格...');
    const styleAnalyzer = new StyleAnalyzer(this.projectRoot);
    const styleAnalysis = styleAnalyzer.analyze();
    console.log(`  发现 ${styleAnalysis.stats.totalIssues} 个风格问题`);

    console.log('分析完成！');

    return {
      dependencyAnalysis,
      componentAnalysis,
      styleAnalysis,
      timestamp: new Date()
    };
  }

  generateReport(config?: Partial<ReportConfig>): string {
    const result = this.analyze();
    const generator = new ReportGenerator(config);
    return generator.generate(result);
  }

  analyzeAndSaveReport(config?: Partial<ReportConfig>): string {
    const result = this.analyze();
    const generator = new ReportGenerator(config);
    return generator.generateAndSave(result);
  }
}
