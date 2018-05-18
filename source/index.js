import PrimitiveTypeChecker, {
  ARGUMENTS,
  GET_PROPERTY,
  RETURN_VALUE,
  SET_PROPERTY,
  AsIs,
  checkPrimitiveType,
} from '@actualwave/primitive-type-checker';

import {
  INDEX,
  isIndexAccessTarget,
  registerIndexBasedClass,
  setIndexValueType,
  setIndexValueTypeBy,
} from './indexed';

import {
  replaceArgumentsTypeCheck,
  replaceIndexedTypeCheck,
  replacePropertyTypeCheck,
  replaceReturnValueTypeCheck,
} from './replace';

class ExtendedTypeChecker extends PrimitiveTypeChecker {
  areArrayElementsOfSameType = true;
  replacePropertyTypeCheck = replacePropertyTypeCheck;
  replaceArgumentsTypeCheck = replaceArgumentsTypeCheck;
  replaceReturnValueTypeCheck = replaceReturnValueTypeCheck;
  replaceIndexedTypeCheck = replaceIndexedTypeCheck;
  isIndexAccessTarget = isIndexAccessTarget;
  registerIndexBasedClass = registerIndexBasedClass;
  setIndexValueType = setIndexValueType;
  setIndexValueTypeBy = setIndexValueTypeBy;

  init(target, errorReporter, cachedTypes = null) {
    const types = {};

    if (
      !cachedTypes &&
      this.collectTypesOnInit &&
      this.areArrayElementsOfSameType &&
      isIndexAccessTarget(target)
    ) {
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
      errorReporter,
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
      return typeFn(GET_PROPERTY, target, name, value, config, sequence);
    }

    const type = this.getTypeString(value);

    return checkPrimitiveType(
      GET_PROPERTY,
      types,
      AsIs(INDEX),
      type,
      errorReporter,
      sequence,
    );
  }

  getNamedProperty(target, name, value, config, sequence) {
    const typeFn = config.types[name];

    if (typeFn instanceof Function) {
      return typeFn(GET_PROPERTY, target, name, value, config, sequence);
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
      return typeFn(SET_PROPERTY, target, name, newValue, config, sequence);
    }

    const type = this.getTypeString(newValue);

    return checkPrimitiveType(
      SET_PROPERTY,
      types,
      AsIs(INDEX),
      type,
      errorReporter,
      sequence,
    );
  }

  setNamedProperty(target, name, newValue, config, sequence) {
    const typeFn = config.types[name];

    if (typeFn instanceof Function) {
      return typeFn(SET_PROPERTY, target, name, newValue, config, sequence);
    }

    return super.setProperty(target, name, newValue, config, sequence);
  }

  arguments(target, thisArg, args, config, sequence) {
    const typeFn = config.types[ARGUMENTS];

    if (typeFn instanceof Function) {
      return typeFn(ARGUMENTS, target, args, config, sequence);
    }

    return super.arguments(target, thisArg, args, config, sequence);
  }

  returnValue(target, thisArg, value, config, sequence) {
    const typeFn = config.types[RETURN_VALUE];

    if (typeFn instanceof Function) {
      return typeFn(RETURN_VALUE, target, value, config, sequence);
    }

    return super.returnValue(target, thisArg, value, config, sequence);
  }
}

export {
  isIndexAccessTarget,
  registerIndexBasedClass,
  setIndexValueType,
  setIndexValueTypeBy,
  replaceArgumentsTypeCheck,
  replaceIndexedTypeCheck,
  replacePropertyTypeCheck,
  replaceReturnValueTypeCheck,
  ExtendedTypeChecker,
};

export default ExtendedTypeChecker;
