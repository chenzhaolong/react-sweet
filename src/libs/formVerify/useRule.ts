/**
 * the rule of form input
 */
import { useState, useCallback, useMemo } from 'react';
import Rules from '../../utils/verifyRules';
import { isType } from '../../utils/tools';
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
    if (isType('function', rule)) {
      return rule;
    } else {
      const RulesKey = Object.keys(Rules);
      if (RulesKey.indexOf(rule) !== -1) {
        // @ts-ignore
        return Rules[rule];
      }
      if (!rule.test) {
        error('the rule must be function or special type or RegExp.');
      } else {
        return (value: any) => {
          return rule.test(value);
        };
      }
    }
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
    return result;
  }, []);

  return { value, verify };
}

export default useRule;
