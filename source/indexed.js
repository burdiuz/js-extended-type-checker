import { getClass } from '@actualwave/get-class';
import { getTypeValue } from '@actualwave/primitive-type-checker';
import { getTypeCheckerData } from '@actualwave/type-checkers';

const indexBasedClasses = new Set([Array]);

export const INDEX = '(Index)';

export const isIndexAccessTarget = (target) => !!target && indexBasedClasses.has(getClass(target));

export const registerIndexBasedClass = (constructor) => {
  indexBasedClasses.add(constructor);
};

export const setIndexValueType = (target, type) => {
  const storage = getTypeCheckerData(target);

  if (storage && type) {
    storage.set(INDEX, new Set([type]));
  }
};

export const setIndexValueTypeBy = (target, value) => {
  setIndexValueType(target, getTypeValue(value));
};
