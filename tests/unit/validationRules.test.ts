import { describe, it, expect } from 'vitest';
import { 
  isEmail, isUrl, isPhone, isIdCard, isNumeric, 
  isInteger, isDecimal, isPositive, isNegative, 
  isDate, isDatetime, isLength, isBetween, isInEnum,
  buildValidationRule, validationRules
} from '../../src/utils/validationRules';

describe('validationRules', () => {
  describe('isEmail', () => {
    it('should return true for valid email', () => {
      expect(isEmail('test@example.com')).toBe(true);
    });
    
    it('should return false for invalid email', () => {
      expect(isEmail('invalid-email')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should return true for valid URL', () => {
      expect(isUrl('https://example.com')).toBe(true);
    });
    
    it('should return false for invalid URL', () => {
      expect(isUrl('invalid-url')).toBe(false);
    });
  });

  describe('isPhone', () => {
    it('should return true for valid phone number', () => {
      expect(isPhone('13800138000')).toBe(true);
    });
    
    it('should return false for invalid phone number', () => {
      expect(isPhone('1234567890')).toBe(false);
    });
  });

  describe('isIdCard', () => {
    it('should return true for valid ID card', () => {
      expect(isIdCard('110101199001011234')).toBe(true);
    });
    
    it('should return false for invalid ID card', () => {
      expect(isIdCard('123456789012345678')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should return true for valid number', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('123.45')).toBe(true);
    });
    
    it('should return false for invalid number', () => {
      expect(isNumeric('abc')).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('should return true for valid integer', () => {
      expect(isInteger('123')).toBe(true);
      expect(isInteger('-123')).toBe(true);
    });
    
    it('should return false for invalid integer', () => {
      expect(isInteger('123.45')).toBe(false);
    });
  });

  describe('isDecimal', () => {
    it('should return true for valid decimal', () => {
      expect(isDecimal('123.45')).toBe(true);
      expect(isDecimal('-123.45')).toBe(true);
    });
    
    it('should return false for invalid decimal', () => {
      expect(isDecimal('abc')).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive number', () => {
      expect(isPositive(123)).toBe(true);
    });
    
    it('should return false for non-positive number', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-123)).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return true for negative number', () => {
      expect(isNegative(-123)).toBe(true);
    });
    
    it('should return false for non-negative number', () => {
      expect(isNegative(0)).toBe(false);
      expect(isNegative(123)).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for valid date', () => {
      expect(isDate('2023-01-01')).toBe(true);
    });
    
    it('should return false for invalid date', () => {
      expect(isDate('2023-13-01')).toBe(false);
      expect(isDate('2023-02-30')).toBe(false);
    });
  });

  describe('isDatetime', () => {
    it('should return true for valid datetime', () => {
      expect(isDatetime('2023-01-01 12:00:00')).toBe(true);
    });
    
    it('should return false for invalid datetime', () => {
      expect(isDatetime('2023-13-01 12:00:00')).toBe(false);
      expect(isDatetime('2023-01-01 25:00:00')).toBe(false);
    });
  });

  describe('isLength', () => {
    it('should return true for exact length', () => {
      expect(isLength('abc', 3)).toBe(true);
    });
    
    it('should return true for length within range', () => {
      expect(isLength('abc', [2, 4])).toBe(true);
    });
    
    it('should return false for length outside range', () => {
      expect(isLength('abc', 2)).toBe(false);
      expect(isLength('abc', [4, 5])).toBe(false);
    });
  });

  describe('isBetween', () => {
    it('should return true for number within range', () => {
      expect(isBetween(5, [1, 10])).toBe(true);
    });
    
    it('should return false for number outside range', () => {
      expect(isBetween(15, [1, 10])).toBe(false);
    });
  });

  describe('isInEnum', () => {
    it('should return true for value in enum', () => {
      expect(isInEnum('a', ['a', 'b', 'c'])).toBe(true);
    });
    
    it('should return false for value not in enum', () => {
      expect(isInEnum('d', ['a', 'b', 'c'])).toBe(false);
    });
  });

  describe('buildValidationRule', () => {
    it('should build required rule', () => {
      const rule = buildValidationRule({ required: true, message: 'Required' });
      expect(rule.required).toBe(true);
      expect(rule.message).toBe('Required');
    });
    
    it('should build email rule', () => {
      const rule = buildValidationRule({ email: true, message: 'Invalid email' });
      expect(typeof rule.validator).toBe('function');
    });
  });

  describe('validationRules', () => {
    it('should create required rule', () => {
      const rule = validationRules.required('Required field');
      expect(rule.required).toBe(true);
      expect(rule.message).toBe('Required field');
    });
    
    it('should create email rule', () => {
      const rule = validationRules.email('Invalid email');
      expect(rule.email).toBe(true);
      expect(rule.message).toBe('Invalid email');
    });
  });
});
