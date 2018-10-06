(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ExtendedTypeChecker = {})));
}(this, (function (exports) { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var typeCheckerSimpleReporting = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	/* eslint-disable import/prefer-default-export */

	const constructErrorString = (action, name, required, received) => `${action}Error on "${name}" instead of "${required}" received "${received}"`;

	/* eslint-disable no-console */

	const ConsoleErrorReporter = (action, name, requiredTypeString, actualTypeString) => console.error(constructErrorString(action, name, requiredTypeString, actualTypeString));

	const ConsoleWarnReporter = (action, name, requiredTypeString, actualTypeString) => console.warn(constructErrorString(action, name, requiredTypeString, actualTypeString));

	/* eslint-disable import/prefer-default-export */

	const ThrowErrorReporter = (action, name, requiredTypeString, receivedTypeString) => {
	  throw new Error(constructErrorString(action, name, requiredTypeString, receivedTypeString));
	};

	exports.ConsoleErrorReporter = ConsoleErrorReporter;
	exports.ConsoleWarnReporter = ConsoleWarnReporter;
	exports.ThrowErrorReporter = ThrowErrorReporter;

	});

	unwrapExports(typeCheckerSimpleReporting);
	var typeCheckerSimpleReporting_1 = typeCheckerSimpleReporting.ConsoleErrorReporter;
	var typeCheckerSimpleReporting_2 = typeCheckerSimpleReporting.ConsoleWarnReporter;
	var typeCheckerSimpleReporting_3 = typeCheckerSimpleReporting.ThrowErrorReporter;

	var hasOwn_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const hasOwn = (
	  (has) =>
	  (target, property) =>
	  Boolean(target && has.call(target, property))
	)(Object.prototype.hasOwnProperty);

	exports.hasOwn = hasOwn;
	exports.default = hasOwn;
	});

	unwrapExports(hasOwn_1);
	var hasOwn_2 = hasOwn_1.hasOwn;

	var mapOfSets = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	class MapOfSets {
	  constructor() {
	    this.storage = new Map();
	  }
	  /**
	   * Check if key exists
	   * @param {*} key
	   */


	  has(key) {
	    const values = this.storage.get(key);
	    return values && values.size;
	  }
	  /**
	   * Check if value exists for key
	   * @param {*} key
	   * @param {*} value
	   */


	  hasValue(key, value) {
	    const values = this.storage.get(key);
	    return values && values.has(value);
	  }
	  /**
	   * Get Set of values for key
	   * @param {*} key
	   */


	  get(key) {
	    return this.storage.get(key);
	  }
	  /**
	   * List values for key, returns empty array if no key nor values stored
	   * @param {*} key
	   */


	  list(key) {
	    const values = this.storage.get(key);
	    return values ? Array.from(values) : [];
	  }
	  /**
	   * Call callback for each value of each key
	   *  callback (value:*, key:*, storage:*):void
	   * @param {Function} callback
	   */


	  forEach(callback) {
	    this.storage.forEach((values, key) => values.forEach(value => callback(value, key, this)));
	  }
	  /**
	   * Call callback function for each value of specified key
	   *  callback (value:*, key:*, storage:*):void
	   * @param {*} key
	   * @param {Function} callback
	   */


	  eachValue(key, callback) {
	    const values = this.storage.get(key);

	    if (values) {
	      values.forEach(value => callback(value, key, this));
	    }
	  }
	  /**
	   * Add to new value to key.
	   * @param {*} key
	   * @param {*} value
	   */


	  add(key, value) {
	    if (!value) return;
	    const values = this.storage.get(key);

	    if (values) {
	      values.add(value);
	    } else {
	      this.storage.set(key, new Set([value]));
	    }
	  }
	  /**
	   * Replace all values for key
	   * @param {*} key
	   * @param {Set} types
	   */


	  set(key, values) {
	    if (!values || values.size === 0) {
	      this.remove(key);
	      return;
	    }

	    this.storage.set(key, new Set(values));
	  }
	  /**
	   * Remove all values for key
	   * @param {*} key
	   */


	  remove(key) {
	    this.storage.delete(key);
	  }
	  /**
	   * Remove single value from key
	   * @param {*} key
	   * @param {*} value
	   */


	  removeValue(key, value) {
	    const values = this.storage.get(key);

	    if (values) {
	      values.delete(value);

	      if (!values.size) {
	        this.remove(key);
	      }
	    }
	  }
	  /**
	   * Clone all key-value stores
	   */


	  clone() {
	    const target = new MapOfSets();
	    this.storage.forEach((values, key) => target.set(key, new Set(values)));
	    return target;
	  }

	}
	const createMapOfSets = () => new MapOfSets();

	exports.MapOfSets = MapOfSets;
	exports.createMapOfSets = createMapOfSets;
	exports.default = MapOfSets;

	});

	unwrapExports(mapOfSets);
	var mapOfSets_1 = mapOfSets.MapOfSets;
	var mapOfSets_2 = mapOfSets.createMapOfSets;

	var typeCheckerLevelsStorage = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

	var hasOwn = _interopDefault(hasOwn_1);
	var MapOfSets = _interopDefault(mapOfSets);

	/**
	 * Do not check or report type inconsistency
	 */
	const REPORT_NEVER = 'never';
	/**
	 * Report type inconsistency once, i.e. record all types and report new
	 */
	const REPORT_ONCE = 'once';
	/**
	 * Report whenever type is inconsistent with initial
	 */
	const REPORT_ALL = 'all';

	const REPORT_KEY = Symbol('type-checkers:report-level');
	const PROPERTY_REPORT_KEY = Symbol('type-checkers:property-report-level');

	let globalReportingLevel = REPORT_ALL;

	const validateReportingLevel = level => {
	  switch (level) {
	    case REPORT_NEVER:
	    case REPORT_ONCE:
	      return level;
	    default:
	      return REPORT_ALL;
	  }
	};

	const setGlobalReportingLevel = level => {
	  globalReportingLevel = validateReportingLevel(level);
	};

	const getGlobalReportingLevel = () => globalReportingLevel;

	const setTargetGeneralReportingLevel = (target, level) => {
	  if (level) {
	    target[REPORT_KEY] = validateReportingLevel(level);
	  } else {
	    delete target[REPORT_KEY];
	  }
	};

	const setTargetPropertyReportingLevel = (target, perPropertyLevels) => {
	  if (!perPropertyLevels) {
	    delete target[PROPERTY_REPORT_KEY];
	    return;
	  }

	  target[PROPERTY_REPORT_KEY] = Object.keys(perPropertyLevels).reduce((levels, prop) => {
	    levels[prop] = validateReportingLevel(perPropertyLevels[prop]);
	    return levels;
	  }, {});
	};

	const setReportingLevel = (target, generalLevel, perPropertyLevels) => {
	  setTargetGeneralReportingLevel(target, generalLevel);
	  setTargetPropertyReportingLevel(target, perPropertyLevels);
	};

	const getTargetReportingLevel = (target, key) => {
	  if (hasOwn(target[PROPERTY_REPORT_KEY], key)) {
	    return target[PROPERTY_REPORT_KEY][key];
	  }

	  return target[REPORT_KEY];
	};

	const getReportingLevel = (target, key) => {
	  let level = getTargetReportingLevel(target, key);

	  if (!level) {
	    level = getTargetReportingLevel(target.constructor, key);
	  }

	  return level || getGlobalReportingLevel();
	};

	/**
	 *
	 * @param {any} key
	 * @param {Set} target
	 * @param {Set} source
	 */
	const defaultMergeStrategy = (key, target, source) => {
	  source.forEach(type => {
	    if (!target.has(type)) {
	      target.add(type);
	    }
	  });

	  return target;
	};

	class TypeInfoStorage extends MapOfSets {
	  /**
	   * Add to type information for specified key.
	   * @param {*} key
	   * @param {*} type
	   * @param {Number} level
	   */
	  add(key, type, level) {
	    if (!type) return;

	    switch (level) {
	      case REPORT_NEVER:
	        this.remove(key);
	        break;
	      case REPORT_ONCE:
	        super.add(key, type);
	        break;
	      case REPORT_ALL:
	      default:
	        {
	          const types = this.storage.get(key);

	          if (!types || !types.size) {
	            this.storage.set(key, new Set([type]));
	          }
	        }
	        break;
	    }
	  }

	  addFor(key, type, target) {
	    this.add(key, type, getReportingLevel(target, key));
	  }

	  /**
	   * Replace types information for specific key
	   * @param {*} key
	   * @param {Set} types
	   * @param {Number} level
	   */
	  set(key, types, level) {
	    if (!types || types.size === 0 || level === REPORT_NEVER) {
	      this.remove(key);
	      return;
	    }

	    super.set(key, types);
	  }

	  /**
	   *
	   * @param {*} key
	   * @param {Set} types
	   * @param {Object} target
	   */
	  setFor(key, types, target) {
	    return this.set(key, types, getReportingLevel(target, key));
	  }

	  clone() {
	    const target = new TypeInfoStorage();
	    this.storage.forEach((types, key) => target.set(key, new Set(types)));

	    return target;
	  }

	  /**
	   * Copy types from current storage to storage passed as first argument.
	   * @param {Map} storage
	   * @param {Object} [target]
	   * @param {Function} [mergeStrategy]
	   */
	  copyTo(storage, target, mergeStrategy = defaultMergeStrategy) {
	    this.storage.forEach((types, key) => {
	      const level = validateReportingLevel(target && getReportingLevel(target, key));

	      switch (level) {
	        case REPORT_ALL:
	        case REPORT_ONCE:
	          if (storage.has(key)) {
	            storage.set(key, mergeStrategy(key, storage.get(key), types, level), level);
	          } else {
	            storage.set(key, new Set(types));
	          }
	          break;
	        case REPORT_NEVER:
	        default:
	          break;
	      }
	    });

	    return storage;
	  }
	}

	const createTypesStorage = () => new TypeInfoStorage();

	exports.REPORT_ALL = REPORT_ALL;
	exports.REPORT_NEVER = REPORT_NEVER;
	exports.REPORT_ONCE = REPORT_ONCE;
	exports.createTypesStorage = createTypesStorage;
	exports.defaultMergeStrategy = defaultMergeStrategy;
	exports.getGlobalReportingLevel = getGlobalReportingLevel;
	exports.setGlobalReportingLevel = setGlobalReportingLevel;
	exports.getReportingLevel = getReportingLevel;
	exports.setReportingLevel = setReportingLevel;

	});

	unwrapExports(typeCheckerLevelsStorage);
	var typeCheckerLevelsStorage_1 = typeCheckerLevelsStorage.REPORT_ALL;
	var typeCheckerLevelsStorage_2 = typeCheckerLevelsStorage.REPORT_NEVER;
	var typeCheckerLevelsStorage_3 = typeCheckerLevelsStorage.REPORT_ONCE;
	var typeCheckerLevelsStorage_4 = typeCheckerLevelsStorage.createTypesStorage;
	var typeCheckerLevelsStorage_5 = typeCheckerLevelsStorage.defaultMergeStrategy;
	var typeCheckerLevelsStorage_6 = typeCheckerLevelsStorage.getGlobalReportingLevel;
	var typeCheckerLevelsStorage_7 = typeCheckerLevelsStorage.setGlobalReportingLevel;
	var typeCheckerLevelsStorage_8 = typeCheckerLevelsStorage.getReportingLevel;
	var typeCheckerLevelsStorage_9 = typeCheckerLevelsStorage.setReportingLevel;

	var primitiveTypeChecker = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });




	let errorReporter = typeCheckerSimpleReporting.ConsoleErrorReporter;
	const getErrorReporter = () => errorReporter;
	const setErrorReporter = value => {
	  errorReporter = value;
	};

	const MERGE = '(Merge)';
	const GET_PROPERTY = '(GetProperty)';
	const SET_PROPERTY = '(SetProperty)';
	const ARGUMENTS = '(Arguments)';
	const RETURN_VALUE = '(ReturnValue)';
	const checkPrimitiveType = (action, storage, target, names, type) => {
	  if (!type) {
	    return true;
	  }

	  const {
	    lastName
	  } = names;
	  const missingType = storage.has(lastName) && !storage.hasValue(lastName, type);

	  if (missingType) {
	    const errorReporter = getErrorReporter();
	    errorReporter(action, names.toString(), storage.list(lastName).join(', '), type);
	  }

	  storage.addFor(lastName, type, target);
	  return !missingType;
	};
	const getTypeValue = value => {
	  if (value === undefined) {
	    return '';
	  }

	  const type = typeof value;

	  if (type === 'object' && value instanceof Array) {
	    return 'array';
	  }

	  return type;
	};

	/* eslint-disable class-methods-use-this */

	class PrimitiveTypeChecker {
	  constructor(collectTypesOnInit = true, enableGetChecker = true) {
	    this.collectTypesOnInit = collectTypesOnInit;
	    this.enableGetChecker = enableGetChecker;
	  }

	  init(target, cachedStorage = null) {
	    let storage;

	    if (cachedStorage) {
	      storage = cachedStorage;
	    } else if (this.collectTypesOnInit) {
	      storage = typeCheckerLevelsStorage.createTypesStorage();
	      Object.keys(target).forEach(key => storage.addFor(key, this.getTypeValue(target[key]), target));
	    }

	    return storage;
	  }

	  getTypeValue(value) {
	    return getTypeValue(value);
	  }

	  checkType(action, storage, target, names, type) {
	    return checkPrimitiveType(action, storage, target, names, type);
	  }
	  /**
	   * FIXME add function to @actualwave/type-checker-levels-storage to merge configs
	   * this function should accept storages and merge strategy callback which will
	   * receive type info and decide what should be merged and what not
	   */


	  mergeConfigs(storage, sourceStorage, names) {
	    const errorReporter = getErrorReporter();
	    sourceStorage.copyTo(storage, null, (key, target, source) => {
	      const targetFirstValue = target.values().next().value;
	      source.forEach(sourceType => {
	        if (!target.has(sourceType)) {
	          target.add(sourceType);

	          if (targetFirstValue) {
	            errorReporter(MERGE, names, targetFirstValue, sourceType);
	          }
	        }
	      });
	      return target;
	    });
	  }

	  getProperty(target, names, value, storage) {
	    if (!this.enableGetChecker) {
	      return true;
	    }

	    const type = this.getTypeValue(value);
	    return this.checkType(GET_PROPERTY, storage, target, names, type);
	  }

	  setProperty(target, names, value, storage) {
	    const type = this.getTypeValue(value);
	    return this.checkType(SET_PROPERTY, storage, target, names, type);
	  }

	  arguments(target, names, args, storage) {
	    const {
	      length
	    } = args;
	    let valid = true;

	    for (let index = 0; index < length; index++) {
	      const type = this.getTypeValue(args[index]);
	      const agrValid = this.checkType(ARGUMENTS, storage, target, names.clone(index), type);
	      valid = agrValid && valid;
	    }

	    return valid;
	  }

	  returnValue(target, names, value, storage) {
	    const type = this.getTypeValue(value);
	    const callNames = names.clone();
	    callNames.appendCustomValue(RETURN_VALUE);
	    return this.checkType(RETURN_VALUE, storage, target, callNames, type);
	  }

	}

	const createPrimitiveTypeChecker = (collectTypesOnInit = true, enableGetChecker = true) => new PrimitiveTypeChecker(collectTypesOnInit, enableGetChecker);

	exports.REPORT_ALL = typeCheckerLevelsStorage.REPORT_ALL;
	exports.REPORT_NEVER = typeCheckerLevelsStorage.REPORT_NEVER;
	exports.REPORT_ONCE = typeCheckerLevelsStorage.REPORT_ONCE;
	exports.getGlobalReportingLevel = typeCheckerLevelsStorage.getGlobalReportingLevel;
	exports.setGlobalReportingLevel = typeCheckerLevelsStorage.setGlobalReportingLevel;
	exports.getReportingLevel = typeCheckerLevelsStorage.getReportingLevel;
	exports.setReportingLevel = typeCheckerLevelsStorage.setReportingLevel;
	exports.MERGE = MERGE;
	exports.ARGUMENTS = ARGUMENTS;
	exports.GET_PROPERTY = GET_PROPERTY;
	exports.RETURN_VALUE = RETURN_VALUE;
	exports.SET_PROPERTY = SET_PROPERTY;
	exports.checkPrimitiveType = checkPrimitiveType;
	exports.getTypeValue = getTypeValue;
	exports.PrimitiveTypeChecker = PrimitiveTypeChecker;
	exports.createPrimitiveTypeChecker = createPrimitiveTypeChecker;
	exports.getErrorReporter = getErrorReporter;
	exports.setErrorReporter = setErrorReporter;

	});

	var PrimitiveTypeChecker = unwrapExports(primitiveTypeChecker);
	var primitiveTypeChecker_1 = primitiveTypeChecker.REPORT_ALL;
	var primitiveTypeChecker_2 = primitiveTypeChecker.REPORT_NEVER;
	var primitiveTypeChecker_3 = primitiveTypeChecker.REPORT_ONCE;
	var primitiveTypeChecker_4 = primitiveTypeChecker.getGlobalReportingLevel;
	var primitiveTypeChecker_5 = primitiveTypeChecker.setGlobalReportingLevel;
	var primitiveTypeChecker_6 = primitiveTypeChecker.getReportingLevel;
	var primitiveTypeChecker_7 = primitiveTypeChecker.setReportingLevel;
	var primitiveTypeChecker_8 = primitiveTypeChecker.MERGE;
	var primitiveTypeChecker_9 = primitiveTypeChecker.ARGUMENTS;
	var primitiveTypeChecker_10 = primitiveTypeChecker.GET_PROPERTY;
	var primitiveTypeChecker_11 = primitiveTypeChecker.RETURN_VALUE;
	var primitiveTypeChecker_12 = primitiveTypeChecker.SET_PROPERTY;
	var primitiveTypeChecker_13 = primitiveTypeChecker.checkPrimitiveType;
	var primitiveTypeChecker_14 = primitiveTypeChecker.getTypeValue;
	var primitiveTypeChecker_15 = primitiveTypeChecker.PrimitiveTypeChecker;
	var primitiveTypeChecker_16 = primitiveTypeChecker.createPrimitiveTypeChecker;
	var primitiveTypeChecker_17 = primitiveTypeChecker.getErrorReporter;
	var primitiveTypeChecker_18 = primitiveTypeChecker.setErrorReporter;

	var getClass_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const getClass = (target) => {
	  if(target === null || target === undefined) {
	    return undefined;
	  }
	  
	  const proto = Object.getPrototypeOf(target);
	  
	  if (typeof proto === 'object') {
	    return proto.constructor;
	  }

	  return proto;
	};

	const getParentClass = (target) => {
	  const def = getClass(target);
	  
	  return def && Object.getPrototypeOf(def);
	};

	const getClassName = (value) => {
	  if (!value) return '';

	  const match = String(getClass(value)).match(
	    /^(?:[^\(\{\s]*)(?:class|function)\s+([\w\d_$]+)(?:\s*\(|\s*\{|\s+extends)/,
	  );

	  return match ? match[1] : '';
	};

	exports.getClassName = getClassName;
	exports.getParentClass = getParentClass;
	exports.getClass = getClass;
	exports.default = getClass;
	});

	unwrapExports(getClass_1);
	var getClass_2 = getClass_1.getClassName;
	var getClass_3 = getClass_1.getParentClass;
	var getClass_4 = getClass_1.getClass;

	var closureValue = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const singleValueFactory = (defaultValue = null, valueFormatter = (value) => value) => {
	  let value = defaultValue;

	  return {
	    getDefault: () => defaultValue,
	    get: () => value,
	    set: (newValue = defaultValue) => {
	      value = valueFormatter(newValue);
	    },
	  };
	};

	const valuesMapFactory = (defaults = new Map(), valueFormatter = (key, value) => value) => {
	  const defaultValues = new Map(defaults);
	  const getDefault = () => new Map(defaultValues);

	  const values = getDefault();

	  return {
	    values,
	    getDefault,
	    copy: () => new Map(values),
	    delete: (key) => values.delete(key),
	    has: (key) => values.has(key),
	    set: (key, value) => values.set(key, valueFormatter(key, value)),
	    get: (key) => values.get(key),
	  };
	};

	const valuesSetFactory = (defaults = new Set(), valueFormatter = (value) => value) => {
	  const defaultValues = new Set(defaults);
	  const getDefault = () => new Set(defaultValues);

	  const values = getDefault();

	  return {
	    values,
	    getDefault,
	    get: () => new Set(values),
	    delete: (value) => values.delete(value),
	    has: (value) => values.has(value),
	    add: (value) => values.add(valueFormatter(value)),
	  };
	};

	exports.singleValueFactory = singleValueFactory;
	exports.valuesMapFactory = valuesMapFactory;
	exports.valuesSetFactory = valuesSetFactory;
	});

	unwrapExports(closureValue);
	var closureValue_1 = closureValue.singleValueFactory;
	var closureValue_2 = closureValue.valuesMapFactory;
	var closureValue_3 = closureValue.valuesSetFactory;

	var pathSequenceToString = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	/**
	 * Wrap any value with AsIs() to pass it to string as is without ant wrapping
	 * or dot prior to name.
	 * @param {*} value
	 */
	function AsIs(value) {
	  if (this instanceof AsIs) {
	    this.value = value;
	  } else {
	    return new AsIs(value);
	  }
	}

	function asIs() {
	  return this.value;
	}

	AsIs.prototype.toString = asIs;
	AsIs.prototype.valueOf = asIs;
	AsIs.prototype[Symbol.toPrimitive] = asIs;

	/**
	 *
	 * @param {String} str
	 * @param {String|AsIs|Number} name
	 */
	const appendPathNameToString = (str, name) => {
	  const string = String(str) || '';

	  if (name instanceof AsIs) {
	    return `${string}${name}`;
	  }

	  if (typeof name === 'symbol') {
	    return `${string}[${String(name)}]`;
	  }

	  if (String(parseInt(name, 10)) === name) {
	    return `${string}[${name}]`;
	  }

	  if (/^[a-z_$][\w\d$_]*$/i.test(name)) {
	    return string ? `${string}.${name}` : name;
	  }

	  return `${string}["${name}"]`;
	};

	class PathSequence {
	  constructor(value) {
	    this.value = value ? String(value) : '';
	    this.lastName = undefined;
	  }

	  append(name) {
	    this.value = appendPathNameToString(this.value, name);
	    this.lastName = name;
	  }

	  appendCustomValue(customString) {
	    this.value = appendPathNameToString(this.value, AsIs(customString));
	    this.lastName = customString;
	  }

	  clone(nextName = undefined) {
	    const sequence = new PathSequence(this.value);

	    if (nextName === undefined) {
	      sequence.lastName = this.lastName;
	    } else {
	      sequence.append(nextName);
	    }

	    return sequence;
	  }

	  getLastName() {
	    return this.lastName;
	  }

	  toString() {
	    return this.value;
	  }

	  valueOf() {
	    return this.value;
	  }
	}

	/**
	 *
	 * @returns {Array<String|Number|AsIs>}
	 */
	const createPathSequence = value => new PathSequence(value);

	exports.createPathSequence = createPathSequence;
	exports.default = PathSequence;

	});

	unwrapExports(pathSequenceToString);
	var pathSequenceToString_1 = pathSequenceToString.createPathSequence;

	var isFunction_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const isFunction = (target) => (typeof target === 'function');

	exports.isFunction = isFunction;
	exports.default = isFunction;
	});

	var isFunction = unwrapExports(isFunction_1);
	var isFunction_2 = isFunction_1.isFunction;

	var withProxy_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const { isFunction } = isFunction_1;

	const withProxy = (handlers) => {
	  /*
	   have problems with using rest operator here, when in node_modules without additional 
	   configurations, so using old style code
	  */
	  const { apply, construct } = handlers;

	  delete handlers.apply;
	  delete handlers.construct;

	  const functionHandlers = { ...handlers, construct, apply };

	  return (target) => new Proxy(target, isFunction(target) ? functionHandlers : handlers);
	};

	exports.withProxy = withProxy;
	exports.default = withProxy;
	});

	unwrapExports(withProxy_1);
	var withProxy_2 = withProxy_1.withProxy;

	var typeCheckers = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }



	var hasOwn = _interopDefault(hasOwn_1);

	var isFunction = _interopDefault(isFunction_1);
	var withProxy = _interopDefault(withProxy_1);

	const {
	  get: getDefaultTypeChecker,
	  set: setDefaultTypeChecker
	} = closureValue.singleValueFactory();

	const {
	  get: isEnabled,
	  set: setEnabled
	} = closureValue.singleValueFactory(true, value => !!value);

	/*
	 When ignoring class, its instances will never be wrapped.
	*/

	const constructors = new Set();
	const addIgnoredClasses = (...classes) => {
	  classes.forEach(constructor => {
	    if (constructor && !constructors.has(constructor)) {
	      constructors.add(constructor);
	    }
	  });
	};
	const removeIgnoredClasses = (...classes) => {
	  classes.forEach(constructor => constructors.delete(constructor));
	};
	const isIgnoredClass = constructor => constructors.has(constructor);
	const isValueOfIgnoredClass = value => constructors.has(getClass_1.getClass(value));
	/**
	 * Number, String, Boolean and Symbol will not pass
	 *
	 *  typeof === 'object' || typeof === 'function'
	 *
	 * check, so not need to add them.
	 */

	addIgnoredClasses(Map, Set, Date, Error);

	const WRAP_FUNCTION_RETURN_VALUES = 'wrapFunctionReturnValues';
	const WRAP_FUNCTION_ARGUMENTS = 'wrapFunctionArguments';
	const WRAP_SET_PROPERTY_VALUES = 'wrapSetPropertyValues';
	const WRAP_IGNORE_PROTOTYPE_METHODS = 'ignorePrototypeMethods';
	const {
	  getDefault: getDefaultWrapConfig,
	  set: setWrapConfigValue,
	  get
	} = closureValue.valuesMapFactory([[WRAP_FUNCTION_RETURN_VALUES, true], [WRAP_FUNCTION_ARGUMENTS, false], [WRAP_SET_PROPERTY_VALUES, false], [WRAP_IGNORE_PROTOTYPE_METHODS, false]], (key, value) => !!value);
	const getWrapConfigValue = (name, target) => {
	  let value;

	  if (target) {
	    value = target[name];
	  }

	  return value === undefined ? get(name) : value;
	};

	/*
	  I have had to apply custom key instead of name as is to
	  fix "construtor" issue. Since ordinary object has some
	  properties with values from start, these properties were
	  mustakenly returned as child info objects, for example, if
	  requesting hild info for "constructor" function of the target,
	  it returned class constructor which caused errors later,
	  when accesing info properties.

	  Converts Symbols and Numbers to String.

	  FIXME: Map might be fitting better.
	 */

	const getChildInfoKey = name => `@${String(name)}`;

	class ChildrenCache {
	  constructor(children) {
	    if (children) {
	      this.cache = { ...children.cache
	      };
	    } else {
	      this.cache = {};
	    }
	  }

	  store(name, childInfo) {
	    const key = getChildInfoKey(name);

	    if (childInfo) {
	      this.cache[key] = childInfo;
	    } else {
	      delete this.cache[key];
	    }
	  }

	  get(name) {
	    return this.cache[getChildInfoKey(name)];
	  }

	  has(name) {
	    return !!this.cache[getChildInfoKey(name)];
	  }

	  remove(cache, name) {
	    return delete this.cache[getChildInfoKey(name)];
	  }

	  copy({
	    cache: sourceCache
	  }) {
	    Object.keys(sourceCache).forEach(key => {
	      if (hasOwn(this.cache, key)) {
	        this.cache[key].copy(sourceCache[key]);
	      } else {
	        this.cache[key] = sourceCache[key];
	      }
	    });
	    return this;
	  }

	}

	const createChildrenCache = children => new ChildrenCache(children);

	const INFO_KEY = Symbol('type-checkers::info');
	const getTargetInfo = target => target ? target[INFO_KEY] : undefined;
	const setTargetInfo = (target, info) => {
	  if (target && info) {
	    target[INFO_KEY] = info;
	  }
	};
	const removeTargetInfo = target => delete target[INFO_KEY];

	class TargetInfo {
	  constructor(checker, data = null, deep = true, names = pathSequenceToString.createPathSequence(), children = createChildrenCache()) {
	    this.checker = checker;
	    this.data = data;
	    this.deep = deep;
	    this.names = names;
	    this.children = children;
	  }

	  getChild(name) {
	    return this.children.get(name);
	  }

	  storeChildFrom(name, child) {
	    const info = getTargetInfo(child);

	    if (info) {
	      this.children.store(name, info);
	    }
	  }

	  createChildWithNames(names, value, data = null) {
	    const childInfo = new TargetInfo(this.checker, this.checker.init(value, data), this.deep, names);
	    this.children.store(names.lastName, childInfo);
	    return childInfo;
	  }

	  createChild(name, value, data = null) {
	    return this.createChildWithNames(this.names.clone(name), value, data);
	  }

	  copy({
	    deep,
	    checker,
	    children,
	    data,
	    names
	  }) {
	    if (this.checker === checker) {
	      this.deep = this.deep || deep;
	      this.children.copy(children);
	      this.data = checker.mergeConfigs(this.data, data, names);
	    } else {
	      console.error('TypeChecked objects can be merged only if using exactly same instance of type checker.');
	    }

	    return this;
	  }

	}

	const createTargetInfo = (checker, data, deep, names, children) => new TargetInfo(checker, data, deep, names, children);

	const getTypeChecker = target => {
	  if (target) {
	    const info = target[INFO_KEY];
	    return info && info.checker || undefined;
	  }

	  return undefined;
	};
	const getTypeCheckerData = target => {
	  if (target) {
	    const info = target[INFO_KEY];
	    return info && info.data || undefined;
	  }

	  return undefined;
	};

	const TARGET_KEY = Symbol('type-checkers::target');
	const isSymbol = value => typeof value === 'symbol';
	const isOfWrappableType = target => {
	  const type = typeof target;
	  return Boolean(target) && (type === 'function' || type === 'object') && !isValueOfIgnoredClass(target);
	};
	const isWrapped = target => Boolean(target && target[TARGET_KEY]);
	const isWrappable = target => isOfWrappableType(target) && !isWrapped(target);
	const unwrap = target => target && target[TARGET_KEY] || target;
	const setWrapConfigTo = (target, key, value) => {
	  if (!isWrapped(target)) {
	    return false;
	  }

	  const info = getTargetInfo(target);

	  switch (key) {
	    case WRAP_FUNCTION_RETURN_VALUES:
	    case WRAP_FUNCTION_ARGUMENTS:
	    case WRAP_SET_PROPERTY_VALUES:
	    case WRAP_IGNORE_PROTOTYPE_METHODS:
	      info[key] = !!value;
	      return true;

	    default:
	      return false;
	  }
	};

	const getTargetProperty = (wrapFn, target, names, value) => {
	  const info = getTargetInfo(target);
	  const {
	    deep
	  } = info;

	  if (deep || isFunction(value)) {
	    const {
	      lastName: property
	    } = names;
	    const childInfo = info.getChild(property);

	    if (childInfo) {
	      return wrapFn(value, childInfo);
	    }

	    return wrapFn(value, info.createChildWithNames(names, value));
	  }

	  return value;
	};
	/**
	 * Skips prototype methods if they are ignored by config
	 */


	const isIgnoredProperty = (target, info, property, value) => {
	  if (isFunction(value) && !hasOwn(target, property) && getWrapConfigValue(WRAP_IGNORE_PROTOTYPE_METHODS, info)) {
	    return true;
	  }

	  return false;
	};

	const getPropertyFactory = wrapFn => (target, property) => {
	  const value = target[property];

	  if (property === INFO_KEY) {
	    return value;
	    /*
	    target[TARGET_KEY] is a virtual property accessing which indicates
	    if object is wrapped with type checked proxy or not.
	    Also it allows "unwrapping" target.
	    */
	  }

	  if (property === TARGET_KEY) {
	    return target;
	  }

	  if (isSymbol(property)) {
	    return target[property];
	  }

	  const info = getTargetInfo(target);
	  const {
	    names,
	    data,
	    checker
	  } = info;
	  const nextNames = names.clone(property);

	  if (checker.getProperty) {
	    checker.getProperty(target, nextNames, value, data);
	  }

	  if (!isWrappable(value) || isIgnoredProperty(target, info, property, value)) {
	    return value;
	  }

	  return getTargetProperty(wrapFn, target, nextNames, value);
	};

	const setNonTargetProperty = (target, property, value) => {
	  const {
	    names,
	    data,
	    checker
	  } = getTargetInfo(target);

	  if (checker.setProperty) {
	    checker.setProperty(target, names.clone(property), value, data);
	  }

	  target[property] = value;
	  return true;
	};

	const setTargetProperty = (wrapFn, target, property, value) => {
	  const info = getTargetInfo(target);
	  const {
	    names,
	    checker,
	    data
	  } = info;
	  const childInfo = info.getChild(property);
	  const nextNames = childInfo ? childInfo.names : names.clone(property);

	  if (checker.setProperty) {
	    checker.setProperty(target, nextNames, value, data);
	  }

	  if (childInfo) {
	    value = wrapFn(value, childInfo);
	  } else {
	    value = wrapFn(value, info.createChildWithNames(nextNames, value));
	  }

	  target[property] = value;
	  return true;
	};

	const updateTargetInfo = (target, value) => {
	  let info = getTargetInfo(target);

	  if (info && value && info !== value) {
	    info.copy(value);
	  } else {
	    info = value;
	  }

	  target[INFO_KEY] = info;
	  return true;
	};

	const setPropertyFactory = wrapFn => (target, property, value) => {
	  if (property === TARGET_KEY) {
	    throw new Error(`"${TARGET_KEY}" is a virtual property and cannot be set`);
	  }

	  if (property === INFO_KEY) {
	    return updateTargetInfo(target, value);
	  }

	  if (isSymbol(property)) {
	    return updateTargetInfo(target, value);
	  }

	  const info = getTargetInfo(target);

	  if (isWrappable(value) && getWrapConfigValue(WRAP_SET_PROPERTY_VALUES, info)) {
	    return setTargetProperty(wrapFn, target, property, value);
	  }

	  return setNonTargetProperty(target, property, value);
	};

	const getTypeCheckedChild = (wrapFn, info, name, value) => {
	  if (!isWrappable(value)) {
	    return value;
	  }

	  const childInfo = info.getChild(name);

	  if (childInfo) {
	    return wrapFn(value, childInfo);
	  }

	  return wrapFn(value, info.createChild(name, value));
	};
	const getTargetArguments = (wrapFn, info, argumentsList) => {
	  if (getWrapConfigValue(WRAP_FUNCTION_ARGUMENTS, info)) {
	    const {
	      length
	    } = argumentsList;

	    for (let index = 0; index < length; index++) {
	      argumentsList[index] = getTypeCheckedChild(wrapFn, info, String(index), argumentsList[index]);
	    }
	  }

	  return argumentsList;
	};

	const applyFunctionFactory = wrapFn => (target, thisArg, argumentsList) => {
	  const info = getTargetInfo(target);
	  const {
	    names,
	    data,
	    checker
	  } = info;

	  if (checker.arguments) {
	    checker.arguments(target, names, argumentsList, data, thisArg);
	  }

	  if (getWrapConfigValue(WRAP_FUNCTION_ARGUMENTS, info)) {
	    argumentsList = getTargetArguments(wrapFn, info, argumentsList);
	  }

	  let result = target.apply(thisArg, argumentsList);

	  if (checker.returnValue) {
	    checker.returnValue(target, names, result, data, thisArg);
	  }

	  if (getWrapConfigValue(WRAP_FUNCTION_RETURN_VALUES, info)) {
	    result = getTypeCheckedChild(wrapFn, info, 'returnValue', result);
	  }

	  return result;
	};

	const constructFactory = wrapFn => (Target, argumentsList) => {
	  const info = getTargetInfo(Target);
	  const {
	    names,
	    data,
	    checker
	  } = info;

	  if (checker.arguments) {
	    checker.arguments(Target, names, argumentsList, data);
	  }

	  if (getWrapConfigValue(WRAP_FUNCTION_ARGUMENTS, info)) {
	    argumentsList = getTargetArguments(wrapFn, info, argumentsList);
	  }

	  let result = new Target(...argumentsList);

	  if (checker.returnValue) {
	    checker.returnValue(Target, names, result, data);
	  }

	  if (getWrapConfigValue(WRAP_FUNCTION_RETURN_VALUES, info)) {
	    result = getTypeCheckedChild(wrapFn, info, 'returnValue', result);
	  }

	  return result;
	};

	const deletePropertyFactory = () => (target, property) => {
	  if (property === INFO_KEY) {
	    return delete target[property];
	  }

	  if (property === TARGET_KEY) {
	    return false;
	  }

	  if (isSymbol(property)) {
	    return delete target[property];
	  }

	  const info = getTargetInfo(target);
	  const {
	    names,
	    data,
	    checker
	  } = info;
	  checker.deleteProperty(target, names.clone(property), data);
	  return delete target[property];
	};

	/* eslint-disable import/prefer-default-export */
	const createInfoFromOptions = (target, {
	  checker = getDefaultTypeChecker(),
	  deep,
	  name,
	  data,
	  children,
	  info = null // exclusive option, if set other options being ignored

	} = {}) => info || createTargetInfo(checker, checker.init(target, data), deep, pathSequenceToString.createPathSequence(name), children);

	const generateHandlers = (create, config = null) => ({
	  get: (!config || config.get) && getPropertyFactory(create),
	  set: (!config || config.set) && setPropertyFactory(create),
	  apply: (!config || config.apply) && applyFunctionFactory(create),
	  construct: (!config || config.construct) && constructFactory(create),
	  deleteProperty: (!config || config.deleteProperty) && deletePropertyFactory(create)
	});

	const createWrapFactory = proxyConfig => {
	  let wrapInternal;

	  const assignInfoAndWrap = (target, info) => {
	    setTargetInfo(target, info);
	    return wrapInternal(target);
	  };

	  const handlers = generateHandlers(assignInfoAndWrap, proxyConfig);
	  wrapInternal = withProxy(handlers);
	  return assignInfoAndWrap;
	};
	const wrap = (target, options = null, proxyConfig = null) => {
	  if (!isWrappable(target) || !isEnabled()) {
	    return target;
	  }

	  const wrapInternal = createWrapFactory(proxyConfig);
	  const info = createInfoFromOptions(target, options || undefined);
	  return wrapInternal(target, info);
	};

	/* eslint-disable import/prefer-default-export */

	const deepInitializer = (target, info) => {
	  const {
	    names,
	    checker,
	    data
	  } = info;
	  Object.keys(target).forEach(name => {
	    const value = target[name];
	    const nextNames = names.clone(name);

	    if (checker.getProperty) {
	      checker.getProperty(target, nextNames, value, data);
	    }

	    if (isWrappable(value)) {
	      let childInfo = info.getChild(name);

	      if (!childInfo) {
	        childInfo = info.createChildWithNames(nextNames, value);
	      }

	      deepInitializer(value, childInfo);
	    }
	  });
	  setTargetInfo(target, info);
	  return info;
	};

	const wrapDeep = (target, options, proxyConfig = null) => {
	  if (!isWrappable(target) || typeof target !== 'object' || !isEnabled()) {
	    return target;
	  }

	  const wrapInternal = createWrapFactory(proxyConfig);
	  const info = createInfoFromOptions(target, options);
	  deepInitializer(target, info);
	  return wrapInternal(target, info);
	};

	const findWrapped = list => list.find(isWrapped);
	/**
	 * Merge all objects and return new. If any of source objects were wrapped,
	 * resulting object will be wrapped.
	 * @param  {...any} sources
	 */


	const merge = (...sources) => {
	  const wrapped = findWrapped(sources);

	  if (!wrapped) {
	    return Object.assign({}, ...sources);
	  }

	  const info = getTargetInfo(wrapped);
	  return Object.assign(wrap({}, {
	    info
	  }), ...sources);
	};
	/**
	 * Calls merge() and forces wrapped result.
	 * @param {*} options
	 * @param  {...Object} sources
	 */

	merge.options = (options, ...sources) => merge(wrap({}, options), ...sources);
	/**
	 * Assign properties from source objects to target. If target or any of sources
	 * were wrapped, resulting object will be wrapped.
	 * @param {*} target
	 * @param  {...any} sources
	 */


	const assign = (target, ...sources) => {
	  if (isWrapped(target)) {
	    return Object.assign(target, ...sources);
	  }

	  const wrapped = findWrapped(sources);

	  if (!wrapped) {
	    return Object.assign(target, ...sources);
	  }

	  const info = getTargetInfo(wrapped);
	  return Object.assign(wrap(target, {
	    info
	  }), ...sources);
	};
	/**
	 * calls assign() and forces wrapped result.
	 * @param {*} options
	 * @param {Object} target
	 * @param  {...Object} sources
	 */

	assign.options = (options, target, ...sources) => assign(wrap(target, options), ...sources);

	exports.getDefaultTypeChecker = getDefaultTypeChecker;
	exports.setDefaultTypeChecker = setDefaultTypeChecker;
	exports.isEnabled = isEnabled;
	exports.setEnabled = setEnabled;
	exports.addIgnoredClasses = addIgnoredClasses;
	exports.isIgnoredClass = isIgnoredClass;
	exports.isValueOfIgnoredClass = isValueOfIgnoredClass;
	exports.removeIgnoredClasses = removeIgnoredClasses;
	exports.setWrapConfigValue = setWrapConfigValue;
	exports.getWrapConfigValue = getWrapConfigValue;
	exports.getTargetInfo = getTargetInfo;
	exports.getTypeChecker = getTypeChecker;
	exports.getTypeCheckerData = getTypeCheckerData;
	exports.removeTargetInfo = removeTargetInfo;
	exports.wrap = wrap;
	exports.wrapDeep = wrapDeep;
	exports.isWrappable = isWrappable;
	exports.isWrapped = isWrapped;
	exports.unwrap = unwrap;
	exports.setWrapConfigTo = setWrapConfigTo;
	exports.assign = assign;
	exports.merge = merge;

	});

	unwrapExports(typeCheckers);
	var typeCheckers_1 = typeCheckers.getDefaultTypeChecker;
	var typeCheckers_2 = typeCheckers.setDefaultTypeChecker;
	var typeCheckers_3 = typeCheckers.isEnabled;
	var typeCheckers_4 = typeCheckers.setEnabled;
	var typeCheckers_5 = typeCheckers.addIgnoredClasses;
	var typeCheckers_6 = typeCheckers.isIgnoredClass;
	var typeCheckers_7 = typeCheckers.isValueOfIgnoredClass;
	var typeCheckers_8 = typeCheckers.removeIgnoredClasses;
	var typeCheckers_9 = typeCheckers.setWrapConfigValue;
	var typeCheckers_10 = typeCheckers.getWrapConfigValue;
	var typeCheckers_11 = typeCheckers.getTargetInfo;
	var typeCheckers_12 = typeCheckers.getTypeChecker;
	var typeCheckers_13 = typeCheckers.getTypeCheckerData;
	var typeCheckers_14 = typeCheckers.removeTargetInfo;
	var typeCheckers_15 = typeCheckers.wrap;
	var typeCheckers_16 = typeCheckers.wrapDeep;
	var typeCheckers_17 = typeCheckers.isWrappable;
	var typeCheckers_18 = typeCheckers.isWrapped;
	var typeCheckers_19 = typeCheckers.unwrap;
	var typeCheckers_20 = typeCheckers.setWrapConfigTo;
	var typeCheckers_21 = typeCheckers.assign;
	var typeCheckers_22 = typeCheckers.merge;

	const indexBasedClasses = new Set([Array]);
	const INDEX = '(Index)';
	const isIndexAccessTarget = target => !!target && indexBasedClasses.has(getClass_4(target));
	const registerIndexBasedClass = constructor => {
	  indexBasedClasses.add(constructor);
	};
	const setIndexValueType = (target, type) => {
	  const storage = typeCheckers_13(target);

	  if (storage && type) {
	    storage.set(INDEX, new Set([type]));
	  }
	};
	const setIndexValueTypeBy = (target, value) => {
	  setIndexValueType(target, primitiveTypeChecker_14(value));
	};

	class ExtendedTypeChecker extends PrimitiveTypeChecker {
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
	      const storage = typeCheckerLevelsStorage_4();
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
	    return this.checkType(primitiveTypeChecker_10, target, names.clone(INDEX), this.getTypeValue(value), storage);
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
	    return this.checkType(primitiveTypeChecker_12, target, names, type, storage);
	  }

	}

	const createExtendedTypeChecker = (collectTypesOnInit = true, enableGetChecker = true, areArrayElementsOfSameType = true) => new ExtendedTypeChecker(collectTypesOnInit, enableGetChecker, areArrayElementsOfSameType);

	exports.INDEX = INDEX;
	exports.isIndexAccessTarget = isIndexAccessTarget;
	exports.registerIndexBasedClass = registerIndexBasedClass;
	exports.setIndexValueType = setIndexValueType;
	exports.setIndexValueTypeBy = setIndexValueTypeBy;
	exports.ExtendedTypeChecker = ExtendedTypeChecker;
	exports.createExtendedTypeChecker = createExtendedTypeChecker;
	exports.MERGE = primitiveTypeChecker_8;
	exports.ARGUMENTS = primitiveTypeChecker_9;
	exports.GET_PROPERTY = primitiveTypeChecker_10;
	exports.RETURN_VALUE = primitiveTypeChecker_11;
	exports.SET_PROPERTY = primitiveTypeChecker_12;
	exports.getErrorReporter = primitiveTypeChecker_17;
	exports.setErrorReporter = primitiveTypeChecker_18;
	exports.REPORT_ALL = primitiveTypeChecker_1;
	exports.REPORT_NEVER = primitiveTypeChecker_2;
	exports.REPORT_ONCE = primitiveTypeChecker_3;
	exports.getGlobalReportingLevel = primitiveTypeChecker_4;
	exports.setGlobalReportingLevel = primitiveTypeChecker_5;
	exports.getReportingLevel = primitiveTypeChecker_6;
	exports.setReportingLevel = primitiveTypeChecker_7;
	exports.default = ExtendedTypeChecker;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=extended-type-checker.js.map
