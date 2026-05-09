import Mock from 'mockjs';
import { Random } from Mock;

export interface MockFieldConfig {
  type: string;
  options?: any[];
  min?: number;
  max?: number;
  minDate?: string;
  maxDate?: string;
  from?: string[];
  prefix?: string;
  unit?: string;
  range?: string[];
  pick?: any[];
}

export interface MockConfig {
  count: number;
  fields: Record<string, MockFieldConfig>;
}

const generators: Record<string, Function> = {
  id: () => Mock.mock('@increment'),
  word: (min: number, max: number) => Random.word(min, max),
  cname: () => Random.cname(),
  email: () => Random.email(),
  phone: () => Random.phone(),
  pick: (options: any[]) => Random.pick(options),
  integer: (min: number, max: number) => Random.integer(min, max),
  float: (min: number, max: number, dmin: number, dmax: number) => Random.float(min, max, dmin, dmax),
  datetime: (format: string) => Random.datetime(format),
  date: (format: string) => Random.date(format),
  image: (size: string, bg: string, fg: string, text: string) => Random.image(size, bg, fg, text),
  county: (prefix: boolean) => Random.county(prefix),
  city: () => Random.city(),
  sentence: (min: number, max: number) => Random.sentence(min, max),
  paragraph: (min: number, max: number) => Random.paragraph(min, max),
};

const generateFieldValue = (config: MockFieldConfig): any => {
  const { type, options, min, max, minDate, maxDate, from, prefix, unit, range } = config;
  
  switch (type) {
    case 'id':
      return generators.id();
    case 'word':
      return generators.word(min || 3, max || 10);
    case 'cname':
      return generators.cname();
    case 'email':
      return generators.email();
    case 'phone':
      return generators.phone();
    case 'pick':
      return generators.pick(options || from || ['A', 'B', 'C']);
    case 'integer':
      return generators.integer(min || 0, max || 100);
    case 'float':
      return generators.float(min || 0, max || 100, min || 0, max || 2);
    case 'datetime':
      return generators.datetime(minDate || 'yyyy-MM-dd HH:mm:ss');
    case 'date':
      return generators.date(minDate || 'yyyy-MM-dd');
    case 'image':
      return generators.image(size || '40x40', bg || Random.color(), fg || Random.color(), text || Random.word(1, 2));
    case 'county':
      return generators.county(true);
    case 'city':
      return generators.city();
    case 'concat':
      return (prefix || '') + generators.word(3, 6) + (unit || '');
    case 'increment':
      return generators.id();
    default:
      return type;
  }
};

export const generateMockData = (config: MockConfig, index: number): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const [field, fieldConfig] of Object.entries(config.fields)) {
    result[field] = generateFieldValue(fieldConfig);
  }
  
  return result;
};

export const generateMockList = (config: MockConfig): any[] => {
  return Array.from({ length: config.count }, (_, i) => generateMockData(config, i));
};
