'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var typeCheckers = require('@actualwave/type-checkers');
var PrimitiveTypeChecker = require('@actualwave/primitive-type-checker');
var PrimitiveTypeChecker__default = _interopDefault(PrimitiveTypeChecker);

const indexBasedClasses = [Array];

const INDEX = '(Index)';

const isIndexAccessTarget = target => target && indexBasedClasses.indexOf(target.constructor) >= 0;

const registerIndexBasedClass = constructor => {
  indexBasedClasses.push(constructor);
};

const setIndexValueType = (target, type) => {
  const config = typeCheckers.getTargetTypeCheckerConfig(target);

  if (config) {
    config.types[INDEX] = type || '';
  }
};

const setIndexValueTypeBy = (target, value) => {
  setIndexValueType(target, typeCheckers.getTargetTypeChecker(target).getTypeString(value));
};

const replacePropertyTypeCheck = (target, name, fn) => {
  const { types } = typeCheckers.getTargetTypeCheckerConfig(target);
  delete types[name];

  if (fn) {
    types[name] = fn;
  }
};

const replaceArgumentsTypeCheck = (target, fn) => {
  const { types } = typeCheckers.getTargetTypeCheckerConfig(target);
  delete types[PrimitiveTypeChecker.ARGUMENTS];

  if (fn) {
    types[PrimitiveTypeChecker.ARGUMENTS] = fn;
  }
};

const replaceReturnValueTypeCheck = (target, fn) => {
  const { types } = typeCheckers.getTargetTypeCheckerConfig(target);
  delete types[PrimitiveTypeChecker.RETURN_VALUE];

  if (fn) {
    types[PrimitiveTypeChecker.RETURN_VALUE] = fn;
  }
};

const replaceIndexedTypeCheck = (target, fn) => {
  const { types } = typeCheckers.getTargetTypeCheckerConfig(target);
  delete types[INDEX];

  if (fn) {
    types[INDEX] = fn;
  }
};

class ExtendedTypeChecker extends PrimitiveTypeChecker__default {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.areArrayElementsOfSameType = true, this.replacePropertyTypeCheck = replacePropertyTypeCheck, this.replaceArgumentsTypeCheck = replaceArgumentsTypeCheck, this.replaceReturnValueTypeCheck = replaceReturnValueTypeCheck, this.replaceIndexedTypeCheck = replaceIndexedTypeCheck, this.isIndexAccessTarget = isIndexAccessTarget, this.registerIndexBasedClass = registerIndexBasedClass, this.setIndexValueType = setIndexValueType, this.setIndexValueTypeBy = setIndexValueTypeBy, _temp;
  }

  init(target, errorReporter, cachedTypes = null) {
    const types = {};

    if (!cachedTypes && this.collectTypesOnInit && this.areArrayElementsOfSameType && isIndexAccessTarget(target)) {
      const { length } = target;

      for (let index = 0; index < length; index += 1) {
        const type = this.getTypeString(target[index]);

        if (type) {
          types[INDEX] = type;
          break;
        }
      }
    } else {
      return super.init(target, errorReporter, cachedTypes);
    }

    return {
      types,
      errorReporter
    };
  }

  getProperty(target, name, value, config, sequence) {
    if (this.areArrayElementsOfSameType && isIndexAccessTarget(target)) {
      return this.getIndexProperty(target, INDEX, value, config, sequence);
    }

    return this.getNamedProperty(target, name, value, config, sequence);
  }

  getIndexProperty(target, name, value, config, sequence) {
    const { types, errorReporter } = config;
    const typeFn = types[name];

    if (typeFn instanceof Function) {
      return typeFn(PrimitiveTypeChecker.GET_PROPERTY, target, name, value, config, sequence);
    }

    const type = this.getTypeString(value);

    return PrimitiveTypeChecker.checkPrimitiveType(PrimitiveTypeChecker.GET_PROPERTY, types, PrimitiveTypeChecker.AsIs(INDEX), type, errorReporter, sequence);
  }

  getNamedProperty(target, name, value, config, sequence) {
    const typeFn = config.types[name];

    if (typeFn instanceof Function) {
      return typeFn(PrimitiveTypeChecker.GET_PROPERTY, target, name, value, config, sequence);
    }

    return super.getProperty(target, name, value, config, sequence);
  }

  setProperty(target, name, newValue, config, sequence) {
    if (this.areArrayElementsOfSameType && isIndexAccessTarget(target)) {
      return this.setIndexProperty(target, INDEX, newValue, config, sequence);
    }

    return this.setNamedProperty(target, name, newValue, config, sequence);
  }

  setIndexProperty(target, name, newValue, config, sequence) {
    const { types, errorReporter } = config;
    const typeFn = types[name];

    if (typeFn instanceof Function) {
      return typeFn(PrimitiveTypeChecker.SET_PROPERTY, target, name, newValue, config, sequence);
    }

    const type = this.getTypeString(newValue);

    return PrimitiveTypeChecker.checkPrimitiveType(PrimitiveTypeChecker.SET_PROPERTY, types, PrimitiveTypeChecker.AsIs(INDEX), type, errorReporter, sequence);
  }

  setNamedProperty(target, name, newValue, config, sequence) {
    const typeFn = config.types[name];

    if (typeFn instanceof Function) {
      return typeFn(PrimitiveTypeChecker.SET_PROPERTY, target, name, newValue, config, sequence);
    }

    return super.setProperty(target, name, newValue, config, sequence);
  }

  arguments(target, thisArg, args, config, sequence) {
    const typeFn = config.types[PrimitiveTypeChecker.ARGUMENTS];

    if (typeFn instanceof Function) {
      return typeFn(PrimitiveTypeChecker.ARGUMENTS, target, args, config, sequence);
    }

    return super.arguments(target, thisArg, args, config, sequence);
  }

  returnValue(target, thisArg, value, config, sequence) {
    const typeFn = config.types[PrimitiveTypeChecker.RETURN_VALUE];

    if (typeFn instanceof Function) {
      return typeFn(PrimitiveTypeChecker.RETURN_VALUE, target, value, config, sequence);
    }

    return super.returnValue(target, thisArg, value, config, sequence);
  }
}

exports.isIndexAccessTarget = isIndexAccessTarget;
exports.registerIndexBasedClass = registerIndexBasedClass;
exports.setIndexValueType = setIndexValueType;
exports.setIndexValueTypeBy = setIndexValueTypeBy;
exports.replaceArgumentsTypeCheck = replaceArgumentsTypeCheck;
exports.replaceIndexedTypeCheck = replaceIndexedTypeCheck;
exports.replacePropertyTypeCheck = replacePropertyTypeCheck;
exports.replaceReturnValueTypeCheck = replaceReturnValueTypeCheck;
exports.ExtendedTypeChecker = ExtendedTypeChecker;
exports.default = ExtendedTypeChecker;
//# sourceMappingURL=extended-type-checker.js.map
