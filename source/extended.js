import { createTypesStorage } from '@actualwave/type-checker-levels-storage';
import isFunction from '@actualwave/is-function';

import PrimitiveTypeChecker, {
  GET_PROPERTY,
  SET_PROPERTY,
} from '@actualwave/primitive-type-checker';

import { INDEX, isIndexAccessTarget } from './indexed';

class ExtendedTypeChecker extends PrimitiveTypeChecker {
  constructor({
    collectTypesOnInit = true,
    enableGetChecker = true,
    areArrayElementsOfSameType = true,
    customGetTypeValue = undefined,
  } = {}) {
    super(collectTypesOnInit, enableGetChecker);

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

    return this.getNamedProperty(target, names, value, storage);
  }

  getIndexProperty(target, names, value, storage) {
    return this.checkType(
      GET_PROPERTY,
      target,
      names.clone(INDEX),
      this.getTypeValue(value),
      storage,
    );
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

    return this.checkType(SET_PROPERTY, target, names, type, storage);
  }

  setNamedProperty = (target, names, newValue, storage) => {
    return super.setProperty(target, names, newValue, storage);
  };
}

export const createExtendedTypeChecker = (options) => new ExtendedTypeChecker(options);

export default ExtendedTypeChecker;
