/**
 * the rule of form input
 * todo: 后续的版本可以考虑将校验和组件组合在一起，成为校验型高阶组件
 */
import { useState, useCallback, useMemo } from 'react';
import Rules from '../../utils/verifyRules';
import { isType, getRuleFn } from '../../utils/tools';
import { error } from '../../utils/log';

interface Result {
  value: any;
  verify: (newValue: any, options?: Options) => void;
}

interface Options {
  success: () => any;
  fail: () => any;
}

function useRule(rule: any, initValue: any): Result {
  const [value, setValue] = useState(initValue || '');

  const verifyRule = useMemo(() => {
    return getRuleFn({ rule, Rules, error });
  }, []);

  const verify = useCallback((newValue: any, options?: Options) => {
    const effect: Options = options || { success: () => {}, fail: () => {} };
    // for number case
    const realVal = isType('object', newValue) ? newValue.val : newValue;
    const result = verifyRule(newValue);
    if (result) {
      effect.success && effect.success();
      setValue(realVal);
    } else {
      const isHideWhenError = effect.fail && effect.fail();
      if (isType('boolean', isHideWhenError)) {
        if (isHideWhenError || !realVal) {
          setValue('');
        }
      } else {
        setValue('');
      }
    }
    return { result };
  }, []);

  return { value, verify };
}

export default useRule;
