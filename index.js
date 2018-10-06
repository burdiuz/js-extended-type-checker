'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getClass = require('@actualwave/get-class');
var PrimitiveTypeChecker = require('@actualwave/primitive-type-checker');
var PrimitiveTypeChecker__default = _interopDefault(PrimitiveTypeChecker);
var typeCheckers = require('@actualwave/type-checkers');
var typeCheckerLevelsStorage = require('@actualwave/type-checker-levels-storage');
var isFunction = _interopDefault(require('@actualwave/is-function'));

const indexBasedClasses = new Set([Array]);
const INDEX = '(Index)';
const isIndexAccessTarget = target => !!target && indexBasedClasses.has(getClass.getClass(target));
const registerIndexBasedClass = constructor => {
  indexBasedClasses.add(constructor);
};
const setIndexValueType = (target, type) => {
  const storage = typeCheckers.getTypeCheckerData(target);

  if (storage && type) {
    storage.set(INDEX, new Set([type]));
  }
};
const setIndexValueTypeBy = (target, value) => {
  setIndexValueType(target, PrimitiveTypeChecker.getTypeValue(value));
};

class ExtendedTypeChecker extends PrimitiveTypeChecker__default {
  constructor({
    collectTypesOnInit = true,
    enableGetChecker = true,
    areArrayElementsOfSameType = true,
    customGetTypeValue = undefined
  } = {}) {
    super(collectTypesOnInit, enableGetChecker);

    this.setNamedProperty = (target, names, newValue, storage) => {
      return super.setProperty(target, names, newValue, storage);
    };

    this.areArrayElementsOfSameType = areArrayElementsOfSameType;
    this.customGetTypeValue = customGetTypeValue;

    if (this.customGetTypeValue !== undefined && !isFunction(this.customGetTypeValue)) {
      throw new Error('"customGetTypeValue" must be a callable object, i.e. function.');
    }
  }

  getTypeValue(value) {
    if (this.customGetTypeValue) {
      return this.customGetTypeValue(value);
    }

    return super.getTypeValue(value);
  }

  findIndexedType(target) {
    const {
      length
    } = target;

    for (let index = 0; index < length; index += 1) {
      const type = this.getTypeValue(target[index]);

      if (type) {
        return type;
      }
    }

    return '';
  }

  init(target, cachedStorage = null) {
    if (!cachedStorage && this.collectTypesOnInit && this.areArrayElementsOfSameType && isIndexAccessTarget(target)) {
      const storage = typeCheckerLevelsStorage.createTypesStorage();
      const type = this.findIndexedType(target);

      if (type) {
        storage.add(INDEX, type);
        return storage;
      }
    }

    return super.init(target, cachedStorage);
  }

  getProperty(target, names, value, storage) {
    if (this.areArrayElementsOfSameType && isIndexAccessTarget(target)) {
      return this.getIndexProperty(target, names, value, storage);
    }

    return this.getNamedProperty(target, names, value, storage);
  }

  getIndexProperty(target, names, value, storage) {
    return this.checkType(PrimitiveTypeChecker.GET_PROPERTY, target, names.clone(INDEX), this.getTypeValue(value), storage);
  }

  getNamedProperty(target, names, value, storage) {
    return super.getProperty(target, names, value, storage);
  }

  setProperty(target, names, newValue, storage) {
    if (this.areArrayElementsOfSameType && isIndexAccessTarget(target)) {
      return this.setIndexProperty(target, names, newValue, storage);
    }

    return this.setNamedProperty(target, names, newValue, storage);
  }

  setIndexProperty(target, names, newValue, storage) {
    const type = this.getTypeValue(newValue);
    return this.checkType(PrimitiveTypeChecker.SET_PROPERTY, target, names, type, storage);
  }

}

const createExtendedTypeChecker = (collectTypesOnInit = true, enableGetChecker = true, areArrayElementsOfSameType = true) => new ExtendedTypeChecker(collectTypesOnInit, enableGetChecker, areArrayElementsOfSameType);

exports.MERGE = PrimitiveTypeChecker.MERGE;
exports.ARGUMENTS = PrimitiveTypeChecker.ARGUMENTS;
exports.GET_PROPERTY = PrimitiveTypeChecker.GET_PROPERTY;
exports.RETURN_VALUE = PrimitiveTypeChecker.RETURN_VALUE;
exports.SET_PROPERTY = PrimitiveTypeChecker.SET_PROPERTY;
exports.getErrorReporter = PrimitiveTypeChecker.getErrorReporter;
exports.setErrorReporter = PrimitiveTypeChecker.setErrorReporter;
exports.REPORT_ALL = PrimitiveTypeChecker.REPORT_ALL;
exports.REPORT_NEVER = PrimitiveTypeChecker.REPORT_NEVER;
exports.REPORT_ONCE = PrimitiveTypeChecker.REPORT_ONCE;
exports.getGlobalReportingLevel = PrimitiveTypeChecker.getGlobalReportingLevel;
exports.setGlobalReportingLevel = PrimitiveTypeChecker.setGlobalReportingLevel;
exports.getReportingLevel = PrimitiveTypeChecker.getReportingLevel;
exports.setReportingLevel = PrimitiveTypeChecker.setReportingLevel;
exports.INDEX = INDEX;
exports.isIndexAccessTarget = isIndexAccessTarget;
exports.registerIndexBasedClass = registerIndexBasedClass;
exports.setIndexValueType = setIndexValueType;
exports.setIndexValueTypeBy = setIndexValueTypeBy;
exports.ExtendedTypeChecker = ExtendedTypeChecker;
exports.createExtendedTypeChecker = createExtendedTypeChecker;
exports.default = ExtendedTypeChecker;
//# sourceMappingURL=index.js.map
