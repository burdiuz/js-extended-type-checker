/* eslint-disable global-require */
describe('Indexed', () => {
  let setTargetInfo;
  let getTargetInfo;
  let getTypeString;

  let INDEX;
  let registerIndexBasedClass;
  let isIndexAccessTarget;
  let setIndexValueType;
  let setIndexValueTypeBy;
  class MyCollection {}

  beforeEach(() => {
    ({ setTargetInfo, getTargetInfo } = require('@actualwave/type-checkers'));
    ({ getTypeString } = require('@actualwave/primitive-type-checker'));
    ({
      INDEX,
      registerIndexBasedClass,
      isIndexAccessTarget,
      setIndexValueType,
      setIndexValueTypeBy,
    } = require('../indexed'));
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('isIndexAccessTarget()', () => {
    describe('When Array', () => {
      it('should return true', () => {
        expect(isIndexAccessTarget([])).toBe(true);
      });
    });

    describe('When normal Object', () => {
      it('should return false', () => {
        expect(isIndexAccessTarget({})).toBe(false);
      });
    });
    describe('When xustom class', () => {
      it('should return false', () => {
        expect(isIndexAccessTarget(new MyCollection())).toBe(false);
      });

      describe('When registered as Indexed', () => {
        beforeEach(() => {
          registerIndexBasedClass(MyCollection);
        });

        it('should return true', () => {
          expect(isIndexAccessTarget(new MyCollection())).toBe(true);
        });
      });
    });
  });

  describe('setIndexValueType()', () => {
    let target;

    beforeEach(() => {
      target = {};
      setTargetInfo(target, { config: { types: {} } });
      setIndexValueType(target, 'myType');
    });

    it('should store type in config', () => {
      expect(getTargetInfo(target)).toEqual({
        config: { types: { [INDEX]: 'myType' } },
      });
    });

    describe('When target is not type checked', () => {
      it('should not throw an error', () => {
        expect(() => {
          setIndexValueType([], 'number');
        }).not.toThrow();
      });
    });

    describe('When type is undefined', () => {
      beforeEach(() => {
        setIndexValueType(target);
      });

      it('should store "" in config', () => {
        expect(getTargetInfo(target)).toEqual({
          config: { types: { [INDEX]: '' } },
        });
      });
    });
  });

  describe('setIndexValueTypeBy()', () => {
    let targetNumber;
    let targetString;
    let targetArray;

    beforeEach(() => {
      targetNumber = {};
      targetString = {};
      targetArray = {};

      setTargetInfo(targetNumber, {
        config: { types: {} },
        checker: { getTypeString },
      });
      setTargetInfo(targetString, {
        config: { types: {} },
        checker: { getTypeString },
      });
      setTargetInfo(targetArray, {
        config: { types: {} },
        checker: { getTypeString },
      });

      setIndexValueTypeBy(targetNumber, 0);
      setIndexValueTypeBy(targetString, '');
      setIndexValueTypeBy(targetArray, []);
    });

    it('should store type in config', () => {
      expect(getTargetInfo(targetNumber)).toEqual({
        config: { types: { [INDEX]: 'number' } },
        checker: expect.any(Object),
      });
      expect(getTargetInfo(targetString)).toEqual({
        config: { types: { [INDEX]: 'string' } },
        checker: expect.any(Object),
      });
      expect(getTargetInfo(targetArray)).toEqual({
        config: { types: { [INDEX]: 'array' } },
        checker: expect.any(Object),
      });
    });
  });
});
