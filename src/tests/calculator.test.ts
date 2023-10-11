import calculator from '../controllers/calculatorController';
import { Request, Response } from 'express';

describe('Calculator API', () => {
  let req: Request, res: Response;
  let calculatorId: string;

  beforeEach(() => {
    req = { body: {}, cookies: {} } as any;
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as any;
  });

  describe('operatorValidation', () => {
    it('should return true for valid operators', () => {
      expect(calculator.operatorValidation('+')).toBe(true);
      expect(calculator.operatorValidation('-')).toBe(true);
      expect(calculator.operatorValidation('*')).toBe(true);
      expect(calculator.operatorValidation('/')).toBe(true);
    });

    it('should return false for invalid operators', () => {
      expect(calculator.operatorValidation('')).toBe(false);
      expect(calculator.operatorValidation('&')).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(calculator.isNumber('123')).toBe(true);
      expect(calculator.isNumber('-45.67')).toBe(true);
      expect(calculator.isNumber('0.123e5')).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(calculator.isNumber('2*3')).toBe(false);
      expect(calculator.isNumber('12a3')).toBe(false);
      expect(calculator.isNumber('12.34.56')).toBe(false);
    });
  });

  describe('initFunction', () => {
    it('should return 400 for missing input fields', () => {
      calculator.initFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for an invalid operator', () => {
      req.body = { operator: '%', num1: '10', num2: '5' };
      calculator.initFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for division by zero', () => {
      req.body = { operator: '/', num1: '10', num2: '0' };
       calculator.initFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 200 for valid decimal numbers', () => {
      req.body = { operator: '+', num1: '12.34', num2: '5.67' };
      calculator.initFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      calculatorId = calculator.calculatorId;
    });

  });

  describe('operationFunction', () => {
    it('should return 400 for missing input fields',  () => {
      calculator.operationFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 for an uninitialized calculator',  () => {
      req.body = { operator: '+', num: '10', Id: 'nonexistent' };
       calculator.operationFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('undoFunction', () => {
    it('should return 400 for missing input fields',  () => {
       calculator.undoFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 for an uninitialized calculator',  () => {
      req.body = { Id: 'nonexistent' };
       calculator.undoFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 for undo operation with no more operations',  () => {
      req.body = { Id: 'calculatorId' };
      req.cookies.calculatorId = { result: 10, totalOps: 1, list: [] };
      calculator.undoFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should correctly calculate the undo operation', () => {
      req.body = { Id: 'calculatorId' };
      req.cookies.calculatorId = { result: 20, totalOps: 2, list: ['+5', '-7'] };
      calculator.undoFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('resetFunction', () => {
    it('should return 400 for missing calculator ID', () => {
      req.params = { id: '' };
      calculator.resetFunction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should clear the calculator data', () => {
      req.params = { id: 'calculatorId' };
      calculator.resetFunction(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('calculatorId');
    });
  });
});