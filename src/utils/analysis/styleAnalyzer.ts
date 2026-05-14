import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {
  StyleIssue,
  StyleRule,
  StyleAnalysisResult,
  StyleStats
} from '../../types/analysis.ts';

export class StyleAnalyzer {
  private projectRoot: string;
  private issues: StyleIssue[] = [];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  analyze(): StyleAnalysisResult {
    this.issues = [];
    const tsFiles = this.findTsFiles();
    
    for (const filePath of tsFiles) {
      this.analyzeFile(filePath);
    }

    const vueFiles = this.findVueFiles();
    for (const filePath of vueFiles) {
      this.analyzeVueFile(filePath);
    }

    return {
      issues: this.issues,
      stats: this.calculateStats(tsFiles.length + vueFiles.length)
    };
  }

  private findTsFiles(): string[] {
    return this.findFilesByExtension('.ts');
  }

  private findVueFiles(): string[] {
    return this.findFilesByExtension('.vue');
  }

  private findFilesByExtension(extension: string): string[] {
    const files: string[] = [];
    const traverse = (dir: string) => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!entry.includes('node_modules') && !entry.includes('.d.ts')) {
            traverse(fullPath);
          }
        } else if (fullPath.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    };
    traverse(this.projectRoot);
    return files;
  }

  private analyzeFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(this.projectRoot, filePath);
    const lines = content.split('\n');

    this.checkIndentation(lines, relativePath);
    this.checkLineLength(lines, relativePath);
    this.checkTrailingWhitespace(lines, relativePath);
    this.checkCommentCoverage(content, relativePath);
    this.checkNamingConventions(content, lines, relativePath);
  }

  private analyzeVueFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(this.projectRoot, filePath);
    const lines = content.split('\n');

    this.checkIndentation(lines, relativePath);
    this.checkLineLength(lines, relativePath);
    this.checkTrailingWhitespace(lines, relativePath);
    this.checkCommentCoverage(content, relativePath);
  }

  private checkIndentation(lines: string[], filePath: string): void {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() && !this.isCommentLine(line)) {
        const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
        if (leadingSpaces.length % 2 !== 0) {
          this.addIssue(filePath, i + 1, leadingSpaces.length + 1, 'indentation',
            '缩进应该使用2个空格');
        }
      }
    }
  }

  private checkLineLength(lines: string[], filePath: string): void {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > 120) {
        this.addIssue(filePath, i + 1, 121, 'lineLength',
          `行长度超过120字符 (当前: ${lines[i].length})`);
      }
    }
  }

  private checkTrailingWhitespace(lines: string[], filePath: string): void {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/\s+$/)) {
        this.addIssue(filePath, i + 1, lines[i].length, 'trailingWhitespace',
          '行尾存在多余空格');
      }
    }
  }

  private checkCommentCoverage(content: string, filePath: string): void {
    const lines = content.split('\n');
    let commentLines = 0;
    let codeLines = 0;

    for (const line of lines) {
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().endsWith('*/')) {
        commentLines++;
      } else if (line.trim()) {
        codeLines++;
      }
    }

    const coverage = codeLines > 0 ? (commentLines / (codeLines + commentLines)) * 100 : 0;
    if (coverage < 5) {
      this.addIssue(filePath, 1, 1, 'commentCoverage',
        `注释覆盖率低于5% (当前: ${coverage.toFixed(1)}%)`, 'info');
    }
  }

  private checkNamingConventions(content: string, lines: string[], filePath: string): void {
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    sourceFile.forEachChild(node => {
      if (ts.isVariableDeclarationList(node)) {
        for (const decl of node.declarations) {
          this.checkVariableName(decl, lines, filePath);
        }
      } else if (ts.isFunctionDeclaration(node) && node.name) {
        this.checkFunctionName(node.name, node.getStart(sourceFile), lines, filePath);
      } else if (ts.isClassDeclaration(node) && node.name) {
        this.checkClassName(node.name, node.getStart(sourceFile), lines, filePath);
      } else if (ts.isInterfaceDeclaration(node) && node.name) {
        this.checkInterfaceName(node.name, node.getStart(sourceFile), lines, filePath);
      } else if (ts.isTypeAliasDeclaration(node) && node.name) {
        this.checkTypeName(node.name, node.getStart(sourceFile), lines, filePath);
      }
    });
  }

  private checkVariableName(decl: ts.VariableDeclaration, lines: string[], filePath: string): void {
    const name = decl.name.getText();
    const pos = decl.getStart();
    
    if (!this.isCamelCase(name) && !this.isSnakeCase(name)) {
      const lineNum = this.getLineNumber(pos, lines);
      this.addIssue(filePath, lineNum, 1, 'camelCase',
        `变量名应使用驼峰命名: ${name}`);
    }
  }

  private checkFunctionName(name: ts.Identifier, pos: number, lines: string[], filePath: string): void {
    const funcName = name.getText();
    
    if (!this.isCamelCase(funcName)) {
      const lineNum = this.getLineNumber(pos, lines);
      this.addIssue(filePath, lineNum, 1, 'camelCase',
        `函数名应使用驼峰命名: ${funcName}`);
    }
  }

  private checkClassName(name: ts.Identifier, pos: number, lines: string[], filePath: string): void {
    const className = name.getText();
    
    if (!this.isPascalCase(className)) {
      const lineNum = this.getLineNumber(pos, lines);
      this.addIssue(filePath, lineNum, 1, 'PascalCase',
        `类名应使用帕斯卡命名: ${className}`);
    }
  }

  private checkInterfaceName(name: ts.Identifier, pos: number, lines: string[], filePath: string): void {
    const interfaceName = name.getText();
    
    if (!this.isPascalCase(interfaceName)) {
      const lineNum = this.getLineNumber(pos, lines);
      this.addIssue(filePath, lineNum, 1, 'PascalCase',
        `接口名应使用帕斯卡命名: ${interfaceName}`);
    }
  }

  private checkTypeName(name: ts.Identifier, pos: number, lines: string[], filePath: string): void {
    const typeName = name.getText();
    
    if (!this.isPascalCase(typeName)) {
      const lineNum = this.getLineNumber(pos, lines);
      this.addIssue(filePath, lineNum, 1, 'PascalCase',
        `类型别名应使用帕斯卡命名: ${typeName}`);
    }
  }

  private isCamelCase(str: string): boolean {
    return /^[a-z][a-zA-Z0-9]*$/.test(str);
  }

  private isPascalCase(str: string): boolean {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str);
  }

  private isSnakeCase(str: string): boolean {
    return /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/.test(str);
  }

  private isCommentLine(line: string): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
  }

  private getLineNumber(pos: number, lines: string[]): number {
    let currentPos = 0;
    for (let i = 0; i < lines.length; i++) {
      currentPos += lines[i].length + 1;
      if (currentPos > pos) {
        return i + 1;
      }
    }
    return 1;
  }

  private addIssue(
    filePath: string,
    line: number,
    column: number,
    rule: StyleRule,
    message: string,
    severity: 'error' | 'warning' | 'info' = 'warning'
  ): void {
    this.issues.push({
      filePath,
      line,
      column,
      rule,
      message,
      severity
    });
  }

  private calculateStats(totalFiles: number): StyleStats {
    const errorCount = this.issues.filter(i => i.severity === 'error').length;
    const warningCount = this.issues.filter(i => i.severity === 'warning').length;
    const infoCount = this.issues.filter(i => i.severity === 'info').length;
    const totalIssues = this.issues.length;
    
    const complianceRate = totalFiles > 0 
      ? Number(((totalFiles * 100 - totalIssues) / (totalFiles * 100) * 100).toFixed(2))
      : 100;

    return {
      totalFiles,
      totalIssues,
      errorCount,
      warningCount,
      infoCount,
      commentCoverage: this.calculateOverallCommentCoverage(),
      avgLineLength: this.calculateAvgLineLength(),
      complianceRate
    };
  }

  private calculateOverallCommentCoverage(): number {
    let totalCoverage = 0;
    const coverageIssues = this.issues.filter(i => i.rule === 'commentCoverage');
    
    if (coverageIssues.length === 0) return 10;
    
    for (const issue of coverageIssues) {
      const match = issue.message.match(/(\d+\.\d+)%/);
      if (match) {
        totalCoverage += parseFloat(match[1]);
      }
    }
    
    return Number((totalCoverage / coverageIssues.length).toFixed(2));
  }

  private calculateAvgLineLength(): number {
    let totalLength = 0;
    const lineLengthIssues = this.issues.filter(i => i.rule === 'lineLength');
    
    if (lineLengthIssues.length === 0) return 80;
    
    for (const issue of lineLengthIssues) {
      const match = issue.message.match(/(\d+)/);
      if (match) {
        totalLength += parseInt(match[1]);
      }
    }
    
    return Number((totalLength / lineLengthIssues.length).toFixed(2));
  }
}
