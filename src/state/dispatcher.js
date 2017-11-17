import isFunction from 'lodash.isfunction';
import isUndefined from 'lodash.isundefined';
import access from 'safe-access';
import $store from './store';

function getNSClassNamespace(str) {
  const lastIndex = str.lastIndexOf('.');
  return str.substring(0, lastIndex);
}

function getNSMethodName(str) {
  const lastIndex = str.lastIndexOf('.');
  return str.substring(lastIndex + 1, str.length);
}

function getRealClassName(ns, store) {
  const className = getNSClassNamespace(ns);
  const $class = access(store, className);
  if (isUndefined($class)) throw new Error(`The Store ${className} does not exist!`);
  return $class.constructor.name;
}

export function dispatch(namespace, ...opt) {
  const store = $store.get();
  const fn = access(store, namespace);
  const className = getRealClassName(namespace, store);
  const methodName = getNSMethodName(namespace);

  if (isFunction(fn)) {
    const args = Array.isArray(opt) ? opt : [opt];
    return access(store, [namespace, '()'].join(''), args);
  }

  throw new Error(`${methodName} is not an action of ${className}`);
}
