/**
 * the rule of form input
 * todo: 后续的版本可以考虑将校验和组件组合在一起，成为校验型高阶组件
 * todo: 自定义的rule函数支持promise格式
 */
import { useState, useCallback, useMemo } from 'react';
import Rules from '../../utils/verifyRules';
import { isType, getRuleFn, isPromise } from '../../utils/tools';
import { error } from '../../utils/log';
import { isBoolean } from 'lodash';

interface Result {
  value: any;
  verify: (newValue: any, options?: Options) => void;
}

interface Options {
  success?: () => any;
  fail?: () => any;
}

function useRule(rule: any, initValue: any, isCleanWhenError = false, deps: Array<any> = []): Result {
  const [value, setValue] = useState(initValue || '');

  const verifyRule = useMemo(() => {
    return getRuleFn({ rule, Rules, error });
  }, []);

  const verify = useCallback((newValue: any, options: any) => {
    let effect: Options = {};
    if (isType('object', options)) {
      effect = options;
    } else if (isType('function', options)) {
      effect = { success: options };
    }

    // for number case
    const realVal = isType('object', newValue) ? newValue.val : newValue;

    const reaction = (result: boolean) => {
      if (isBoolean(result)) {
        if (result) {
          effect.success && effect.success();
          setValue(realVal);
        } else {
          effect.fail && effect.fail();
          if (isCleanWhenError) {
            setValue('');
          } else {
            setValue(realVal);
          }
        }
      } else {
        error('the result after verify must be boolean when use useRule.');
      }
    };

    const result = verifyRule(newValue);
    if (isPromise(result)) {
      return result
        .then((d: any) => {
          reaction(d);
          return d;
        })
        .catch((e: any) => {
          throw e;
        });
    } else {
      reaction(result);
      return result;
    }

    // if (isType('boolean', isHideWhenError)) {
    //   if (isHideWhenError || !realVal) {
    //     setValue('');
    //   } else {
    //     setValue(realVal);
    //   }
    // } else {
    //   setValue('');
    // }
  }, deps);

  return { value, verify };
}

export default useRule;
