const primitive = require('@actualwave/primitive-type-checker');
const typeCheckers = require('@actualwave/type-checkers');
const extended = require('./index');

typeCheckers.setDefaultTypeChecker(new extended.ExtendedTypeChecker());

Object.assign(exports, primitive, extended, typeCheckers);
