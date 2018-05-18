import { ARGUMENTS, RETURN_VALUE } from '@actualwave/primitive-type-checker';

import { getTargetTypeCheckerConfig } from '@actualwave/type-checkers';

import { INDEX } from './indexed';

export const replacePropertyTypeCheck = (target, name, fn) => {
  const { types } = getTargetTypeCheckerConfig(target);
  delete types[name];

  if (fn) {
    types[name] = fn;
  }
};

export const replaceArgumentsTypeCheck = (target, fn) => {
  const { types } = getTargetTypeCheckerConfig(target);
  delete types[ARGUMENTS];

  if (fn) {
    types[ARGUMENTS] = fn;
  }
};

export const replaceReturnValueTypeCheck = (target, fn) => {
  const { types } = getTargetTypeCheckerConfig(target);
  delete types[RETURN_VALUE];

  if (fn) {
    types[RETURN_VALUE] = fn;
  }
};

export const replaceIndexedTypeCheck = (target, fn) => {
  const { types } = getTargetTypeCheckerConfig(target);
  delete types[INDEX];

  if (fn) {
    types[INDEX] = fn;
  }
};
