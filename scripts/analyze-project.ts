import { ProjectAnalyzer } from '../src/utils/analysis/projectAnalyzer.ts';

async function main() {
  try {
    const analyzer = new ProjectAnalyzer(process.cwd());
    const reportPath = analyzer.analyzeAndSaveReport({
      outputPath: './docs/project-analysis-report.md'
    });
    console.log(`分析报告已生成: ${reportPath}`);
  } catch (error) {
    console.error('分析失败:', error);
    process.exit(1);
  }
}

main();
