/**
 * the rule of form input for single rule
 * todo: 后续的版本可以考虑将校验和组件组合在一起，成为校验型高阶组件
 */
import { useState, useCallback, useMemo } from 'react';
import Rules from '../../utils/verifyRules';
import { isType, getRuleFn, isPromise } from '../../utils/tools';
import { error } from '../../utils/log';
import { isBoolean } from 'lodash';

interface Result {
  value: any;
  isPass: any;
  verify: (newValue: any, options?: Options) => void;
}

interface Options {
  success?: () => any;
  fail?: () => any;
}

function useRule(rule: any, initValue: any, isCleanWhenError = false, deps: Array<any> = []): Result {
  const [value, setValue] = useState(initValue || '');
  const [isPass, setPass] = useState('');

  const verifyRule = useMemo(() => {
    return getRuleFn({ rule, Rules, error });
  }, deps);

  const verify = useCallback((newValue: any, options: any) => {
    let effect: Options = {};
    if (isType('object', options)) {
      effect = options;
    } else if (isType('function', options)) {
      effect = { success: options };
    }

    // for number case
    const realVal = isType('object', newValue) ? newValue.val : newValue;

    const reaction = (result: boolean, updateValues = true) => {
      if (isBoolean(result)) {
        if (result) {
          effect.success && effect.success();
          updateValues && setValue(realVal);
          // @ts-ignore
          setPass(true);
        } else {
          effect.fail && effect.fail();
          // @ts-ignore
          setPass(false);
          if (isCleanWhenError) {
            setValue('');
          } else {
            updateValues && setValue(realVal);
          }
        }
      } else {
        error('the result after verify must be boolean when use useRule.');
      }
    };

    const result = verifyRule(newValue);
    // 存在校验函数是异步
    if (isPromise(result)) {
      // 由于promise异步关系，先更新输入框，避免出现输入框卡顿现象。
      setValue(realVal);
      return result
        .then((d: any) => {
          reaction(d, false);
          return d;
        })
        .catch(() => {
          reaction(false, false);
          return false;
        });
    } else {
      reaction(result);
      return result;
    }
  }, deps);

  return { value, verify, isPass };
}

export default useRule;
