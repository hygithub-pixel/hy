type ComparisonOperator = '===' | '!==' | '==' | '!=' | '>' | '<' | '>=' | '<=';
type LogicalOperator = '&&' | '||';

interface ExpressionContext {
  formData: Record<string, any>;
}

const ALLOWED_OPERATORS: ComparisonOperator[] = ['===', '!==', '==', '!=', '>', '<', '>=', '<='];
const LOGICAL_OPERATORS: LogicalOperator[] = ['&&', '||'];

function safeCompare(left: any, operator: ComparisonOperator, right: any): boolean {
  switch (operator) {
    case '===':
      return left === right;
    case '!==':
      return left !== right;
    case '==':
      return left == right;
    case '!=':
      return left != right;
    case '>':
      return left > right;
    case '<':
      return left < right;
    case '>=':
      return left >= right;
    case '<=':
      return left <= right;
    default:
      return false;
  }
}

function parseValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  if (trimmed === 'null') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  if (/^['"](.*)['"]$/.test(trimmed)) {
    return trimmed.slice(1, -1);
  }

  const num = Number(trimmed);
  if (!isNaN(num)) return num;

  return trimmed;
}

function extractFieldAccess(expression: string, context: ExpressionContext): any {
  const trimmed = expression.trim();

  if (/^formData\.[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmed)) {
    const field = trimmed.replace('formData.', '');
    return context.formData[field];
  }

  if (/^formData\[['"][a-zA-Z_$][a-zA-Z0-9_$]*['"]\]$/.test(trimmed)) {
    const match = trimmed.match(/formData\[['"]([a-zA-Z_$][a-zA-Z0-9_$]*)['"]\]/);
    if (match) {
      return context.formData[match[1]];
    }
  }

  return parseValue(trimmed);
}

function evaluateSimpleExpression(expression: string, context: ExpressionContext): boolean {
  for (const op of ALLOWED_OPERATORS) {
    if (expression.includes(op)) {
      const parts = expression.split(op);
      if (parts.length === 2) {
        const left = extractFieldAccess(parts[0], context);
        const right = extractFieldAccess(parts[1], context);
        return safeCompare(left, op, right);
      }
    }
  }

  const value = extractFieldAccess(expression, context);
  return Boolean(value);
}

function evaluateLogicalExpression(expression: string, context: ExpressionContext): boolean {
  for (const op of LOGICAL_OPERATORS) {
    const regex = new RegExp(`(.+?)\\s*${op.replace(/[|&]/g, '\\$&')}\\s*(.+)`);
    const match = expression.match(regex);
    if (match) {
      const left = evaluateExpressionSafe(match[1].trim(), context);
      const right = evaluateExpressionSafe(match[2].trim(), context);
      return op === '&&' ? left && right : left || right;
    }
  }

  return evaluateSimpleExpression(expression, context);
}

function evaluateParentheses(expression: string, context: ExpressionContext): boolean {
  const parenRegex = /\(([^()]+)\)/;
  let result = expression;

  while (parenRegex.test(result)) {
    result = result.replace(parenRegex, (_, inner) => {
      const evaluated = evaluateLogicalExpression(inner, context);
      return evaluated ? 'true' : 'false';
    });
  }

  return evaluateLogicalExpression(result, context);
}

export function evaluateExpressionSafe(
  expression: string | undefined,
  context: ExpressionContext
): boolean {
  if (!expression) return true;

  const sanitized = expression.trim();

  if (!sanitized) return true;

  const forbiddenPatterns = [
    /function\s*\(/i,
    /=>/,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /window\./i,
    /document\./i,
    /console\./i,
    /import\s+/i,
    /require\s*\(/i,
    /setTimeout/i,
    /setInterval/i,
    /new\s+/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(sanitized)) {
      console.warn('Unsafe expression detected:', expression);
      return true;
    }
  }

  try {
    return evaluateParentheses(sanitized, context);
  } catch (error) {
    console.error('Expression evaluation error:', error);
    return true;
  }
}

export function createExpressionEvaluator(formData: Record<string, any>) {
  return (expression: string | undefined) => {
    return evaluateExpressionSafe(expression, { formData });
  };
}
