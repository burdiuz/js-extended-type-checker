import {
  MERGE,
  ARGUMENTS,
  GET_PROPERTY,
  RETURN_VALUE,
  SET_PROPERTY,

  getErrorReporter,
  setErrorReporter,

  REPORT_ALL,
  REPORT_NEVER,
  REPORT_ONCE,
  getGlobalReportingLevel,
  setGlobalReportingLevel,
  getReportingLevel,
  setReportingLevel,
} from '@actualwave/primitive-type-checker';

import {
  INDEX,
  isIndexAccessTarget,
  registerIndexBasedClass,
  setIndexValueType,
  setIndexValueTypeBy,
} from './indexed';

import ExtendedTypeChecker, { createExtendedTypeChecker } from './extended';

export {
  INDEX,
  isIndexAccessTarget,
  registerIndexBasedClass,
  setIndexValueType,
  setIndexValueTypeBy,
  ExtendedTypeChecker,
  createExtendedTypeChecker,

  MERGE,
  ARGUMENTS,
  GET_PROPERTY,
  RETURN_VALUE,
  SET_PROPERTY,

  getErrorReporter,
  setErrorReporter,

  REPORT_ALL,
  REPORT_NEVER,
  REPORT_ONCE,
  getGlobalReportingLevel,
  setGlobalReportingLevel,
  getReportingLevel,
  setReportingLevel,
};

export default ExtendedTypeChecker;
