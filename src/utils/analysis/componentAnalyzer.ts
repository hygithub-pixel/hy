import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { parse, SFCParseResult } from '@vue/compiler-sfc';
import {
  ComponentInfo,
  ComponentAnalysisResult,
  ComponentStats,
  DependencyGraph,
  DependencyEdge
} from '../../types/analysis.ts';
import { DependencyAnalyzer } from './dependencyAnalyzer.ts';

export class ComponentAnalyzer {
  private projectRoot: string;
  private dependencyAnalyzer: DependencyAnalyzer;
  private components: ComponentInfo[] = [];
  private composables: ComponentInfo[] = [];
  private stores: ComponentInfo[] = [];
  private services: ComponentInfo[] = [];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.dependencyAnalyzer = new DependencyAnalyzer(projectRoot);
  }

  analyze(): ComponentAnalysisResult {
    this.components = [];
    this.composables = [];
    this.stores = [];
    this.services = [];

    this.scanComponents();
    this.scanComposables();
    this.scanStores();
    this.scanServices();
    this.buildComponentRelations();

    return this.buildResult();
  }

  private scanComponents(): void {
    const vueFiles = this.findFilesByExtension('.vue');
    
    for (const filePath of vueFiles) {
      const relativePath = path.relative(this.projectRoot, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const parsed = parse(content);
        const componentInfo = this.extractComponentInfo(parsed, relativePath, content);
        this.components.push(componentInfo);
      } catch {
        const lineCount = content.split('\n').length;
        this.components.push({
          filePath: relativePath,
          name: path.basename(relativePath, '.vue'),
          type: 'component',
          uses: [],
          usedBy: [],
          complexity: this.calculateComplexity(content),
          lineCount
        });
      }
    }
  }

  private scanComposables(): void {
    const composableFiles = this.findFilesByPattern(/^use.*\.ts$/);
    
    for (const filePath of composableFiles) {
      const relativePath = path.relative(this.projectRoot, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lineCount = content.split('\n').length;
      
      this.composables.push({
        filePath: relativePath,
        name: path.basename(relativePath, '.ts'),
        type: 'composable',
        uses: this.extractUsesFromContent(content),
        usedBy: [],
        complexity: this.calculateComplexity(content),
        lineCount
      });
    }
  }

  private scanStores(): void {
    const storeFiles = this.findFilesByPattern(/Store\.ts$|store\.ts$/);
    
    for (const filePath of storeFiles) {
      const relativePath = path.relative(this.projectRoot, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lineCount = content.split('\n').length;
      
      this.stores.push({
        filePath: relativePath,
        name: path.basename(relativePath, '.ts'),
        type: 'store',
        uses: this.extractUsesFromContent(content),
        usedBy: [],
        complexity: this.calculateComplexity(content),
        lineCount
      });
    }
  }

  private scanServices(): void {
    const serviceFiles = this.findFilesByPattern(/Service\.ts$|service\.ts$/);
    
    for (const filePath of serviceFiles) {
      const relativePath = path.relative(this.projectRoot, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lineCount = content.split('\n').length;
      
      this.services.push({
        filePath: relativePath,
        name: path.basename(relativePath, '.ts'),
        type: 'service',
        uses: this.extractUsesFromContent(content),
        usedBy: [],
        complexity: this.calculateComplexity(content),
        lineCount
      });
    }
  }

  private findFilesByExtension(extension: string): string[] {
    const files: string[] = [];
    const traverse = (dir: string) => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!entry.includes('node_modules')) {
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

  private findFilesByPattern(pattern: RegExp): string[] {
    const files: string[] = [];
    const traverse = (dir: string) => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!entry.includes('node_modules')) {
            traverse(fullPath);
          }
        } else if (pattern.test(entry)) {
          files.push(fullPath);
        }
      }
    };
    traverse(this.projectRoot);
    return files;
  }

  private extractComponentInfo(parsed: SFCParseResult, filePath: string, content: string): ComponentInfo {
    const props: string[] = [];
    const emits: string[] = [];
    
    if (parsed.descriptor.scriptSetup) {
      const scriptContent = parsed.descriptor.scriptSetup.content;
      const propsMatch = scriptContent.match(/defineProps<[^>]+>/);
      if (propsMatch) {
        const propsType = propsMatch[0];
        const propNames = propsType.match(/(\w+)\s*[?:]/g);
        if (propNames) {
          props.push(...propNames.map(p => p.trim().replace(/[?:]/g, '')));
        }
      }
      
      const emitsMatch = scriptContent.match(/defineEmits<[^>]+>/);
      if (emitsMatch) {
        const emitsType = emitsMatch[0];
        const emitNames = emitsType.match(/'([^']+)'/g);
        if (emitNames) {
          emits.push(...emitNames.map(e => e.replace(/'/g, '')));
        }
      }
    }

    const uses = this.extractUsesFromContent(content);
    const lineCount = content.split('\n').length;

    return {
      filePath,
      name: path.basename(filePath, '.vue'),
      type: 'component',
      props,
      emits,
      uses,
      usedBy: [],
      complexity: this.calculateComplexity(content),
      lineCount
    };
  }

  private extractUsesFromContent(content: string): string[] {
    const uses: string[] = [];
    const importRegex = /import\s+(?:\{[^}]+\}|[\w]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const baseName = path.basename(importPath, '.ts');
        if (!uses.includes(baseName)) {
          uses.push(baseName);
        }
      }
    }
    
    return uses;
  }

  private calculateComplexity(content: string): number {
    const lines = content.split('\n');
    let complexity = 0;
    
    for (const line of lines) {
      if (line.includes('if') || line.includes('else') || line.includes('for') || 
          line.includes('while') || line.includes('switch') || line.includes('case')) {
        complexity++;
      }
    }
    
    return Math.min(complexity, 100);
  }

  private buildComponentRelations(): void {
    const allComponents = [...this.components, ...this.composables, ...this.stores, ...this.services];
    
    for (const component of allComponents) {
      for (const usedName of component.uses) {
        const usedComponent = allComponents.find(c => 
          c.name === usedName || c.filePath.includes(usedName)
        );
        
        if (usedComponent && !usedComponent.usedBy.includes(component.name)) {
          usedComponent.usedBy.push(component.name);
        }
      }
    }
  }

  private buildResult(): ComponentAnalysisResult {
    const allComponents = [...this.components, ...this.composables, ...this.stores, ...this.services];
    const edges: DependencyEdge[] = [];
    
    for (const component of allComponents) {
      for (const usedName of component.uses) {
        const usedComponent = allComponents.find(c => 
          c.name === usedName || c.filePath.includes(usedName)
        );
        
        if (usedComponent) {
          edges.push({ from: component.filePath, to: usedComponent.filePath });
        }
      }
    }

    const componentGraph: DependencyGraph = {
      nodes: allComponents.map(c => ({
        filePath: c.filePath,
        imports: [],
        exports: [],
        size: 0,
        lineCount: c.lineCount
      })),
      edges
    };

    const stats = this.calculateStats();

    return {
      components: this.components,
      composables: this.composables,
      stores: this.stores,
      services: this.services,
      componentGraph,
      stats
    };
  }

  private calculateStats(): ComponentStats {
    const allComponents = [...this.components, ...this.composables, ...this.stores, ...this.services];
    const sortedByComplexity = [...allComponents]
      .sort((a, b) => b.complexity - a.complexity);
    
    const topComplex = sortedByComplexity.slice(0, 5).map(c => c.name);
    const avgComplexity = allComponents.length > 0
      ? Number((allComponents.reduce((sum, c) => sum + c.complexity, 0) / allComponents.length).toFixed(2))
      : 0;

    return {
      totalComponents: this.components.length,
      totalComposables: this.composables.length,
      totalStores: this.stores.length,
      totalServices: this.services.length,
      avgComponentComplexity: avgComplexity,
      mostComplexComponents: topComplex
    };
  }
}
