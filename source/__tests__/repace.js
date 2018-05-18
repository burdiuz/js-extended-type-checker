import {
  setTargetInfo,
  getTargetTypeCheckerConfig,
} from '@actualwave/type-checkers';

import { ARGUMENTS, RETURN_VALUE } from '@actualwave/primitive-type-checker';

import {
  replacePropertyTypeCheck,
  replaceArgumentsTypeCheck,
  replaceReturnValueTypeCheck,
  replaceIndexedTypeCheck,
} from '../replace';

import { INDEX } from '../indexed';

describe('Type check replacers', () => {
  let target;
  let typeChecker;

  beforeEach(() => {
    target = {};
    typeChecker = () => null;
    setTargetInfo(target, { config: { types: {} } });
  });

  describe('replacePropertyTypeCheck()', () => {
    describe('When function exists', () => {
      beforeEach(() => {
        replacePropertyTypeCheck(target, 'myProperty', typeChecker);
      });

      it('should be applied to type config', () => {
        expect(getTargetTypeCheckerConfig(target).types.myProperty).toBe(typeChecker);
      });
    });

    describe('When function does not exist', () => {
      it('should not throw error', () => {
        expect(() => {
          replacePropertyTypeCheck(target, 'myProperty', null);
        }).not.toThrow();
      });
    });
  });

  describe('replaceArgumentsTypeCheck()', () => {
    describe('When function exists', () => {
      beforeEach(() => {
        replaceArgumentsTypeCheck(target, typeChecker);
      });

      it('should be applied to type config', () => {
        expect(getTargetTypeCheckerConfig(target).types[ARGUMENTS]).toBe(typeChecker);
      });
    });

    describe('When function does not exist', () => {
      it('should not throw error', () => {
        expect(() => {
          replaceArgumentsTypeCheck(target, null);
        }).not.toThrow();
      });
    });
  });

  describe('replaceReturnValueTypeCheck()', () => {
    describe('When function exists', () => {
      beforeEach(() => {
        replaceReturnValueTypeCheck(target, typeChecker);
      });

      it('should be applied to type config', () => {
        expect(getTargetTypeCheckerConfig(target).types[RETURN_VALUE]).toBe(typeChecker);
      });
    });

    describe('When function does not exist', () => {
      it('should not throw error', () => {
        expect(() => {
          replaceReturnValueTypeCheck(target, null);
        }).not.toThrow();
      });
    });
  });

  describe('replaceIndexedTypeCheck()', () => {
    describe('When function exists', () => {
      beforeEach(() => {
        replaceIndexedTypeCheck(target, typeChecker);
      });

      it('should be applied to type config', () => {
        expect(getTargetTypeCheckerConfig(target).types[INDEX]).toBe(typeChecker);
      });
    });

    describe('When function does not exist', () => {
      it('should not throw error', () => {
        expect(() => {
          replaceIndexedTypeCheck(target, null);
        }).not.toThrow();
      });
    });
  });
});
