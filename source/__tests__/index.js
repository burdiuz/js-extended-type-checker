import { setTargetInfo } from '@actualwave/type-checkers';

import {
  GET_PROPERTY,
  SET_PROPERTY,
  ARGUMENTS,
  RETURN_VALUE,
} from '@actualwave/primitive-type-checker';

import {
  replaceReturnValueTypeCheck,
  replaceArgumentsTypeCheck,
  replacePropertyTypeCheck,
  replaceIndexedTypeCheck,
} from '../replace';

import { ExtendedTypeChecker } from '../index';

import { INDEX } from '../indexed';

describe('ExtendedTypeChecker', () => {
  let target;
  let reporter;
  let checker;
  let config;

  const init = (data) => {
    target = data;
    config = checker.init(target, reporter);
    setTargetInfo(target, { config });
  };

  beforeEach(() => {
    reporter = jest.fn();
    checker = new ExtendedTypeChecker();
  });

  describe('init()', () => {
    describe('When init with indexed target', () => {
      describe('When enabled and collect on init', () => {
        beforeEach(() => {
          checker.collectTypesOnInit = true;
          checker.areArrayElementsOfSameType = true;
        });

        describe('When empty array', () => {
          beforeEach(() => {
            init([]);
          });

          it('should not have defined type', () => {
            expect(config).toEqual({
              types: {},
              errorReporter: reporter,
            });
          });

          describe('When accessing an item', () => {
            beforeEach(() => {
              checker.getProperty(target, '1', false, config, []);
              checker.getProperty(target, '0', 'true', config, []);
              checker.getProperty(target, '2', [], config, ['target', 'child']);
            });

            it('should report error for inconsistent types', () => {
              expect(reporter).toHaveBeenCalledTimes(2);
              expect(reporter).toHaveBeenCalledWith(
                GET_PROPERTY,
                INDEX,
                'boolean',
                'string',
              );
              expect(reporter).toHaveBeenCalledWith(
                GET_PROPERTY,
                `target.child${INDEX}`,
                'boolean',
                'array',
              );
            });
          });
        });

        describe('When array with some items', () => {
          beforeEach(() => {
            init([undefined, undefined, undefined, null]);
          });

          it('should not have defined type', () => {
            expect(config).toEqual({
              types: {
                [INDEX]: 'object',
              },
              errorReporter: reporter,
            });
          });

          describe('When accessing an item', () => {
            beforeEach(() => {
              checker.getProperty(target, '0', {}, config, []);
              checker.getProperty(target, '1', 'abc', config, []);
              checker.getProperty(target, '2', [], config, ['target', 'child']);
            });

            it('should report error for inconsistent types', () => {
              expect(reporter).toHaveBeenCalledTimes(2);
              expect(reporter).toHaveBeenCalledWith(
                GET_PROPERTY,
                INDEX,
                'object',
                'string',
              );
              expect(reporter).toHaveBeenCalledWith(
                GET_PROPERTY,
                `target.child${INDEX}`,
                'object',
                'array',
              );
            });
          });
        });

        describe('When array with items', () => {
          beforeEach(() => {
            init(['abc', 123, true, null]);
          });

          it('should have defined type', () => {
            expect(config).toEqual({
              types: {
                [INDEX]: 'string',
              },
              errorReporter: reporter,
            });
          });

          describe('When accessing an item', () => {
            beforeEach(() => {
              checker.getProperty(target, '0', 'abc', config, []);
              checker.getProperty(target, '1', 123, config, []);
              checker.getProperty(target, '2', true, config, [
                'target',
                'child',
              ]);
            });

            it('should report error for inconsistent types', () => {
              expect(reporter).toHaveBeenCalledTimes(2);
              expect(reporter).toHaveBeenCalledWith(
                GET_PROPERTY,
                INDEX,
                'string',
                'number',
              );
              expect(reporter).toHaveBeenCalledWith(
                GET_PROPERTY,
                `target.child${INDEX}`,
                'string',
                'boolean',
              );
            });
          });
        });

        describe('When custom indexed collection', () => {
          beforeEach(() => {
            init(['abc', 123, true, null]);
          });
        });

        describe('When ordinary object', () => {});
      });

      describe('When enabled and no collect on init', () => {
        beforeEach(() => {
          checker.collectTypesOnInit = false;
          checker.areArrayElementsOfSameType = true;
        });
      });
    });
  });

  describe('getProperty()', () => {
    describe('When named properties', () => {
      beforeEach(() => {
        init({
          numberValue: 123,
          stringValue: 'my string',
          booleanValue: true,
          objectValue: {},
          arrayValue: [],
        });
      });

      describe('When default types used', () => {
        describe('When value of valid type', () => {
          beforeEach(() => {
            checker.getProperty(target, 'stringValue', '123', config, []);
            checker.getProperty(target, 'numberValue', 0, config, [
              'parent',
              'target',
            ]);
          });

          it('should not report any errors', () => {
            expect(reporter).not.toHaveBeenCalled();
          });
        });

        describe('When value of invalid type', () => {
          beforeEach(() => {
            checker.getProperty(target, 'stringValue', 123, config, []);
            checker.getProperty(target, 'booleanValue', 0, config, [
              'parent',
              'target',
            ]);
          });

          it('should report type errors', () => {
            expect(reporter).toHaveBeenCalledTimes(2);
            expect(reporter).toHaveBeenCalledWith(
              GET_PROPERTY,
              'stringValue',
              'string',
              'number',
            );
            expect(reporter).toHaveBeenCalledWith(
              GET_PROPERTY,
              'parent.target.booleanValue',
              'boolean',
              'number',
            );
          });
        });
      });

      describe('When type checker replaced by custom function', () => {
        let customChecker;

        beforeEach(() => {
          customChecker = jest.fn();
          replacePropertyTypeCheck(target, 'objectValue', (...args) =>
            customChecker(...args));
          checker.getProperty(
            target,
            'objectValue',
            { type: 'my-obj' },
            config,
            ['target, child'],
          );
        });

        it('should call custom type checker', () => {
          expect(customChecker).toHaveBeenCalledTimes(1);
          expect(customChecker).toHaveBeenCalledWith(
            GET_PROPERTY,
            target,
            'objectValue',
            { type: 'my-obj' },
            config,
            ['target, child'],
          );
        });
      });
    });

    describe('When indexed properties', () => {
      beforeEach(() => {
        checker.areArrayElementsOfSameType = true;
        init([]);
      });

      describe('When default types used', () => {
        beforeEach(() => {
          checker.getProperty(target, '12', { type: 'my-obj' }, config, [
            'target',
            'child',
          ]);
          checker.getProperty(target, '2', 123, config, []);
          checker.getProperty(target, '5', 'my-obj', config, [
            'target',
            'child',
          ]);
        });

        it('should call custom type checker', () => {
          expect(reporter).toHaveBeenCalledTimes(2);
          expect(reporter).toHaveBeenCalledWith(
            GET_PROPERTY,
            INDEX,
            'object',
            'number',
          );
          expect(reporter).toHaveBeenCalledWith(
            GET_PROPERTY,
            `target.child${INDEX}`,
            'object',
            'string',
          );
        });
      });

      describe('When type checker replaced by custom function', () => {
        let customChecker;

        beforeEach(() => {
          customChecker = jest.fn();
          replaceIndexedTypeCheck(target, (...args) => customChecker(...args));
          checker.getProperty(target, '12', { type: 'my-obj' }, config, [
            'target, child',
          ]);
        });

        it('should call custom type checker', () => {
          expect(customChecker).toHaveBeenCalledTimes(1);
          expect(customChecker).toHaveBeenCalledWith(
            GET_PROPERTY,
            target,
            INDEX,
            { type: 'my-obj' },
            config,
            ['target, child'],
          );
        });
      });
    });
  });

  describe('setProperty()', () => {
    describe('When named properties', () => {
      beforeEach(() => {
        init({
          numberValue: 123,
          stringValue: 'my string',
          booleanValue: true,
          objectValue: {},
          arrayValue: [],
        });
      });

      describe('When default types used', () => {
        describe('When value of valid type', () => {
          beforeEach(() => {
            checker.setProperty(target, 'stringValue', '123', config, []);
            checker.setProperty(target, 'numberValue', 0, config, [
              'parent',
              'target',
            ]);
          });

          it('should not report any errors', () => {
            expect(reporter).not.toHaveBeenCalled();
          });
        });

        describe('When value of invalid type', () => {
          beforeEach(() => {
            checker.setProperty(target, 'booleanValue', '', config, []);
            checker.setProperty(target, 'numberValue', '123', config, [
              'parent',
              'target',
            ]);
          });

          it('should report type errors', () => {
            expect(reporter).toHaveBeenCalledTimes(2);
            expect(reporter).toHaveBeenCalledWith(
              SET_PROPERTY,
              'booleanValue',
              'boolean',
              'string',
            );
            expect(reporter).toHaveBeenCalledWith(
              SET_PROPERTY,
              'parent.target.numberValue',
              'number',
              'string',
            );
          });
        });
      });

      describe('When type checker replaced by custom function', () => {
        let customChecker;

        beforeEach(() => {
          customChecker = jest.fn();
          replacePropertyTypeCheck(target, 'stringValue', (...args) =>
            customChecker(...args));
          checker.setProperty(target, 'stringValue', ['my string'], config, [
            'target, child',
          ]);
        });

        it('should call custom type checker', () => {
          expect(customChecker).toHaveBeenCalledTimes(1);
          expect(customChecker).toHaveBeenCalledWith(
            SET_PROPERTY,
            target,
            'stringValue',
            ['my string'],
            config,
            ['target, child'],
          );
        });
      });
    });

    describe('When indexed properties', () => {
      beforeEach(() => {
        checker.collectTypesOnInit = true;
        checker.areArrayElementsOfSameType = true;
        init([{}]);
      });

      describe('When default types used', () => {
        beforeEach(() => {
          checker.setProperty(target, '2', 123, config, []);
          checker.setProperty(target, '5', 'my-obj', config, [
            'target',
            'child',
          ]);
        });

        it('should call custom type checker', () => {
          expect(reporter).toHaveBeenCalledTimes(2);
          expect(reporter).toHaveBeenCalledWith(
            SET_PROPERTY,
            INDEX,
            'object',
            'number',
          );
          expect(reporter).toHaveBeenCalledWith(
            SET_PROPERTY,
            `target.child${INDEX}`,
            'object',
            'string',
          );
        });
      });

      describe('When type checker replaced by custom function', () => {
        let customChecker;

        beforeEach(() => {
          customChecker = jest.fn();
          replaceIndexedTypeCheck(target, (...args) => customChecker(...args));
          checker.setProperty(target, '12', true, config, ['target, child']);
        });

        it('should call custom type checker', () => {
          expect(customChecker).toHaveBeenCalledTimes(1);
          expect(customChecker).toHaveBeenCalledWith(
            SET_PROPERTY,
            target,
            INDEX,
            true,
            config,
            ['target, child'],
          );
        });
      });
    });
  });

  describe('arguments()', () => {
    beforeEach(() => {
      init({});
    });

    describe('When default types used', () => {
      describe('When value of valid type', () => {
        beforeEach(() => {
          // init
          checker.arguments(target, target, [false, 0, ''], config, []);
          // check
          checker.arguments(target, target, [true, 1, 'abc'], config, []);
          checker.arguments(target, target, [false, -1, ''], config, [
            'parent',
            'target',
          ]);
        });

        it('should not report any errors', () => {
          expect(reporter).not.toHaveBeenCalled();
        });
      });

      describe('When value of invalid type', () => {
        beforeEach(() => {
          // init
          checker.arguments(target, target, [false, 0, ''], config, []);
          // check
          checker.arguments(
            target,
            target,
            [true, '0', 'my string'],
            config,
            [],
          );
          checker.arguments(target, target, ['', 1, null], config, [
            'parent',
            'target',
          ]);
        });

        it('should report type errors', () => {
          expect(reporter).toHaveBeenCalledTimes(3);
          expect(reporter).toHaveBeenCalledWith(
            ARGUMENTS,
            '[1]',
            'number',
            'string',
          );
          expect(reporter).toHaveBeenCalledWith(
            ARGUMENTS,
            'parent.target[0]',
            'boolean',
            'string',
          );
          expect(reporter).toHaveBeenCalledWith(
            ARGUMENTS,
            'parent.target[2]',
            'string',
            'object',
          );
        });
      });
    });

    describe('When type checker replaced by custom function', () => {
      let customChecker;

      beforeEach(() => {
        customChecker = jest.fn();
        replaceArgumentsTypeCheck(target, (...args) => customChecker(...args));
        checker.arguments(target, target, [0, 'my string', true], config, [
          'target, child',
        ]);
      });

      it('should call custom type checker', () => {
        expect(customChecker).toHaveBeenCalledTimes(1);
        expect(customChecker).toHaveBeenCalledWith(
          ARGUMENTS,
          target,
          [0, 'my string', true],
          config,
          ['target, child'],
        );
      });
    });
  });

  describe('returnValue()', () => {
    beforeEach(() => {
      init({});
    });

    describe('When default types used', () => {
      describe('When value of valid type', () => {
        beforeEach(() => {
          // init
          checker.returnValue(target, target, 'my string', config, []);
          // checks
          checker.returnValue(target, target, '', config, []);
          checker.returnValue(target, target, '123', config, [
            'parent',
            'target',
          ]);
        });

        it('should not report any errors', () => {
          expect(reporter).not.toHaveBeenCalled();
        });
      });

      describe('When value of invalid type', () => {
        beforeEach(() => {
          // init
          checker.returnValue(target, target, false, config, []);
          // checks
          checker.returnValue(target, target, 0, config, []);
          checker.returnValue(target, target, '', config, ['parent', 'target']);
        });

        it('should report type errors', () => {
          expect(reporter).toHaveBeenCalledTimes(2);
          expect(reporter).toHaveBeenCalledWith(
            RETURN_VALUE,
            RETURN_VALUE,
            'boolean',
            'number',
          );
          expect(reporter).toHaveBeenCalledWith(
            RETURN_VALUE,
            `parent.target${RETURN_VALUE}`,
            'boolean',
            'string',
          );
        });
      });
    });

    describe('When type checker replaced by custom function', () => {
      let customChecker;

      beforeEach(() => {
        customChecker = jest.fn();
        replaceReturnValueTypeCheck(target, (...args) =>
          customChecker(...args));
        checker.returnValue(target, target, 'my string', config, [
          'target, child',
        ]);
      });

      it('should call custom type checker', () => {
        expect(customChecker).toHaveBeenCalledTimes(1);
        expect(customChecker).toHaveBeenCalledWith(
          RETURN_VALUE,
          target,
          'my string',
          config,
          ['target, child'],
        );
      });
    });
  });
});
