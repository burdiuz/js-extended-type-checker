import { createTypesStorage } from '@actualwave/type-checker-levels-storage';
import isFunction from '@actualwave/is-function';

import PrimitiveTypeChecker, {
  GET_PROPERTY,
  SET_PROPERTY,
} from '@actualwave/primitive-type-checker';

import { INDEX, isIndexAccessTarget } from './indexed';

const isOptionalFunction = (value, name) => {
  if (value !== undefined && !isFunction(value)) {
    throw new Error(`"${name}" must be a callable object, i.e. function.`);
  }
};

class ExtendedTypeChecker extends PrimitiveTypeChecker {
  constructor({
    collectTypesOnInit = true,
    enableGetChecker = true,
    areArrayElementsOfSameType = true,
    customTypeResolver = undefined,
    customTypeComparator = undefined,
  } = {}) {
    super(collectTypesOnInit, enableGetChecker);

    this.areArrayElementsOfSameType = areArrayElementsOfSameType;

    this.customTypeResolver = customTypeResolver;
    isOptionalFunction(this.customTypeResolver, 'customTypeResolver');

    this.customTypeComparator = customTypeComparator;
    isOptionalFunction(this.customTypeComparator, 'customTypeComparator');
  }

  getTypeValue(value) {
    if (this.customTypeResolver) {
      return this.customTypeResolver(value);
    }

    return super.getTypeValue(value);
  }

  isTypeCompatible(storage, key, type, target) {
    if (this.customTypeComparator) {
      return this.customTypeComparator((storage, key, type, target));
    }

    return super.isTypeCompatible(storage, key, type, target);
  }

  findIndexedType(target) {
    const { length } = target;

    for (let index = 0; index < length; index += 1) {
      const type = this.getTypeValue(target[index]);

      if (type) {
        return type;
      }
    }

    return '';
  }

  init(target, cachedStorage = null) {
    if (
      !cachedStorage &&
      this.collectTypesOnInit &&
      this.areArrayElementsOfSameType &&
      isIndexAccessTarget(target)
    ) {
      const storage = createTypesStorage();
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

    return super.getProperty(target, names, value, storage);
  }

  getIndexProperty(target, names, value, storage) {
    return this.checkType(GET_PROPERTY, storage, target, names, this.getTypeValue(value));
  }

  setProperty(target, names, newValue, storage) {
    if (this.areArrayElementsOfSameType && isIndexAccessTarget(target)) {
      return this.setIndexProperty(target, names, newValue, storage);
    }

    return super.setProperty(target, names, newValue, storage);
  }

  setIndexProperty(target, names, newValue, storage) {
    return this.checkType(SET_PROPERTY, storage, target, names, this.getTypeValue(newValue));
  }
}

export const createExtendedTypeChecker = (options) => new ExtendedTypeChecker(options);

export default ExtendedTypeChecker;
