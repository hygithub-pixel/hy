export interface ModuleInfo {
  filePath: string;
  imports: ImportStatement[];
  exports: ExportStatement[];
  size: number;
  lineCount: number;
}

export interface ImportStatement {
  source: string;
  specifiers: ImportSpecifier[];
  isTypeOnly: boolean;
}

export interface ImportSpecifier {
  name: string;
  alias?: string;
}

export interface ExportStatement {
  kind: 'named' | 'default' | 'reexport';
  names: string[];
  source?: string;
}

export interface DependencyGraph {
  nodes: ModuleInfo[];
  edges: DependencyEdge[];
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export interface CircularDependency {
  path: string[];
  severity: 'warning' | 'error';
}

export interface DependencyAnalysisResult {
  graph: DependencyGraph;
  circularDependencies: CircularDependency[];
  dependencyMatrix: Record<string, string[]>;
  stats: DependencyStats;
}

export interface DependencyStats {
  totalModules: number;
  totalDependencies: number;
  avgDependenciesPerModule: number;
  maxDependencies: number;
  modulesWithMostDependencies: string[];
}

export interface ComponentInfo {
  filePath: string;
  name: string;
  type: 'component' | 'composable' | 'store' | 'service';
  props?: string[];
  emits?: string[];
  uses: string[];
  usedBy: string[];
  complexity: number;
  lineCount: number;
}

export interface ComponentAnalysisResult {
  components: ComponentInfo[];
  composables: ComponentInfo[];
  stores: ComponentInfo[];
  services: ComponentInfo[];
  componentGraph: DependencyGraph;
  stats: ComponentStats;
}

export interface ComponentStats {
  totalComponents: number;
  totalComposables: number;
  totalStores: number;
  totalServices: number;
  avgComponentComplexity: number;
  mostComplexComponents: string[];
}

export interface StyleIssue {
  filePath: string;
  line: number;
  column: number;
  rule: StyleRule;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export type StyleRule = 
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'indentation'
  | 'lineLength'
  | 'commentCoverage'
  | 'unusedImport'
  | 'trailingWhitespace';

export interface StyleAnalysisResult {
  issues: StyleIssue[];
  stats: StyleStats;
}

export interface StyleStats {
  totalFiles: number;
  totalIssues: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  commentCoverage: number;
  avgLineLength: number;
  complianceRate: number;
}

export interface ProjectAnalysisResult {
  dependencyAnalysis: DependencyAnalysisResult;
  componentAnalysis: ComponentAnalysisResult;
  styleAnalysis: StyleAnalysisResult;
  timestamp: Date;
}

export interface ReportConfig {
  includeDependencies: boolean;
  includeComponents: boolean;
  includeStyle: boolean;
  outputPath: string;
}
