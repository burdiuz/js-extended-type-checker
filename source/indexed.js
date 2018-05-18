import {
  getTargetTypeChecker,
  getTargetTypeCheckerConfig,
} from '@actualwave/type-checkers';

const indexBasedClasses = [Array];

export const INDEX = '(Index)';

export const isIndexAccessTarget = (target) =>
  target && indexBasedClasses.indexOf(target.constructor) >= 0;

export const registerIndexBasedClass = (constructor) => {
  indexBasedClasses.push(constructor);
};

export const setIndexValueType = (target, type) => {
  const config = getTargetTypeCheckerConfig(target);

  if (config) {
    config.types[INDEX] = type || '';
  }
};

export const setIndexValueTypeBy = (target, value) => {
  setIndexValueType(target, getTargetTypeChecker(target).getTypeString(value));
};
