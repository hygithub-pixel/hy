import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {
  ModuleInfo,
  ImportStatement,
  ExportStatement,
  ImportSpecifier,
  DependencyGraph,
  DependencyEdge,
  CircularDependency,
  DependencyAnalysisResult,
  DependencyStats
} from '../../types/analysis.ts';

export class DependencyAnalyzer {
  private projectRoot: string;
  private tsConfig: ts.ParsedCommandLine;
  private moduleInfos: Map<string, ModuleInfo> = new Map();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    const tsConfigPath = ts.findConfigFile(projectRoot, ts.sys.fileExists);
    if (!tsConfigPath) {
      throw new Error('Cannot find tsconfig.json');
    }
    const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    this.tsConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(tsConfigPath));
  }

  analyze(): DependencyAnalysisResult {
    this.moduleInfos.clear();
    this.scanFiles();
    return this.buildAnalysisResult();
  }

  private scanFiles(): void {
    const sourceFiles = this.tsConfig.fileNames.filter(file => 
      file.endsWith('.ts') && !file.includes('node_modules') && !file.includes('.d.ts')
    );

    for (const filePath of sourceFiles) {
      this.analyzeFile(filePath);
    }
  }

  private analyzeFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const imports: ImportStatement[] = [];
    const exports: ExportStatement[] = [];

    sourceFile.forEachChild(node => {
      if (ts.isImportDeclaration(node)) {
        imports.push(this.parseImport(node));
      } else if (ts.isExportDeclaration(node)) {
        exports.push(this.parseExport(node));
      }
    });

    const relativePath = path.relative(this.projectRoot, filePath);
    const lineCount = content.split('\n').length;

    this.moduleInfos.set(relativePath, {
      filePath: relativePath,
      imports,
      exports,
      size: content.length,
      lineCount
    });
  }

  private parseImport(node: ts.ImportDeclaration): ImportStatement {
    const specifiers: ImportSpecifier[] = [];

    if (node.importClause) {
      if (node.importClause.name) {
        specifiers.push({ name: node.importClause.name.text });
      }
      if (node.importClause.namedBindings) {
        if (ts.isNamedImports(node.importClause.namedBindings)) {
          for (const specifier of node.importClause.namedBindings.elements) {
            specifiers.push({
              name: specifier.propertyName?.text || specifier.name.text,
              alias: specifier.propertyName ? specifier.name.text : undefined
            });
          }
        }
      }
    }

    return {
      source: node.moduleSpecifier.getText().replace(/['"]/g, ''),
      specifiers,
      isTypeOnly: node.importClause?.isTypeOnly || false
    };
  }

  private parseExport(node: ts.ExportDeclaration): ExportStatement {
    const names: string[] = [];

    if (node.exportClause) {
      for (const specifier of node.exportClause.elements) {
        names.push(specifier.propertyName?.text || specifier.name.text);
      }
    }

    return {
      kind: node.moduleSpecifier ? 'reexport' : 
            node.exportClause?.elements.some(e => e.propertyName) ? 'named' : 'default',
      names,
      source: node.moduleSpecifier?.getText().replace(/['"]/g, '')
    };
  }

  private buildAnalysisResult(): DependencyAnalysisResult {
    const nodes = Array.from(this.moduleInfos.values());
    const edges: DependencyEdge[] = [];
    const dependencyMatrix: Record<string, string[]> = {};

    for (const module of nodes) {
      dependencyMatrix[module.filePath] = [];
      for (const imp of module.imports) {
        const resolvedPath = this.resolveImportPath(module.filePath, imp.source);
        if (resolvedPath && this.moduleInfos.has(resolvedPath)) {
          edges.push({ from: module.filePath, to: resolvedPath });
          dependencyMatrix[module.filePath].push(resolvedPath);
        }
      }
    }

    const graph: DependencyGraph = { nodes, edges };
    const circularDependencies = this.findCircularDependencies(graph);
    const stats = this.calculateStats(graph, circularDependencies);

    return {
      graph,
      circularDependencies,
      dependencyMatrix,
      stats
    };
  }

  private resolveImportPath(fromPath: string, importSource: string): string | null {
    if (importSource.startsWith('.') || importSource.startsWith('/')) {
      const dirname = path.dirname(fromPath);
      let resolved = path.join(dirname, importSource);
      
      if (fs.existsSync(path.join(this.projectRoot, resolved + '.ts'))) {
        return resolved + '.ts';
      }
      if (fs.existsSync(path.join(this.projectRoot, resolved, 'index.ts'))) {
        return path.join(resolved, 'index.ts');
      }
      if (fs.existsSync(path.join(this.projectRoot, resolved + '.vue'))) {
        return resolved + '.vue';
      }
    }
    return null;
  }

  private findCircularDependencies(graph: DependencyGraph): CircularDependency[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const cycles: CircularDependency[] = [];

    const dfs = (node: string, path: string[]): void => {
      if (visited.has(node)) return;
      if (visiting.has(node)) {
        const cycleStart = path.indexOf(node);
        if (cycleStart !== -1) {
          cycles.push({
            path: path.slice(cycleStart),
            severity: 'warning'
          });
        }
        return;
      }

      visiting.add(node);
      const edgesFromNode = graph.edges.filter(e => e.from === node);
      
      for (const edge of edgesFromNode) {
        dfs(edge.to, [...path, node]);
      }

      visiting.delete(node);
      visited.add(node);
    };

    for (const node of graph.nodes) {
      dfs(node.filePath, []);
    }

    return cycles;
  }

  private calculateStats(graph: DependencyGraph, circularDeps: CircularDependency[]): DependencyStats {
    const dependencyCount = new Map<string, number>();
    
    for (const node of graph.nodes) {
      const deps = graph.edges.filter(e => e.from === node.filePath).length;
      dependencyCount.set(node.filePath, deps);
    }

    const sortedByDeps = Array.from(dependencyCount.entries())
      .sort((a, b) => b[1] - a[1]);

    const maxDeps = sortedByDeps[0]?.[1] || 0;
    const topModules = sortedByDeps.slice(0, 5).map(([path]) => path);

    return {
      totalModules: graph.nodes.length,
      totalDependencies: graph.edges.length,
      avgDependenciesPerModule: graph.nodes.length > 0 
        ? Number((graph.edges.length / graph.nodes.length).toFixed(2)) 
        : 0,
      maxDependencies: maxDeps,
      modulesWithMostDependencies: topModules
    };
  }
}
