/**
 * the rules of form input
 */
import { useCallback, useMemo, useState } from 'react';
import { getRuleFn, isType } from '../../utils/tools';
import { error } from '../../utils/log';
import { get } from 'lodash';
import Rules from '../../utils/verifyRules';

type Format = { [key: string]: any };

interface Options {
  [key: string]: any;
}

interface Options1 {
  success: () => any;
  fail: () => any;
}

interface Result {
  result: boolean;
  values: {
    [key: string]: any;
  };
  verify: (newValue: any, options?: Options) => void;
  logs: {
    [key: string]: boolean;
  };
}

function useRules(options: Options): Result {
  if (isType('object', options)) {
    error('the options of input params must be object');
  }

  const { targetRules, targetInitValues, targetLogs, targetKeys } = useMemo(() => {
    const targetKeys = Object.keys(options);
    const targetRules: Format = {},
      targetInitValues: Format = {},
      targetLogs: Format = {};

    targetKeys.forEach((key: string) => {
      targetRules[key] = get(options, `${key}.rule`, '');
      targetInitValues[key] = get(options, `${key}.initValue`, '');
      targetLogs[key] = false;
    });
    return { targetRules, targetInitValues, targetLogs, targetKeys };
  }, []);

  const [values, setValues] = useState(targetInitValues);

  const [logs, setLogs] = useState(targetLogs);

  const [result, setResult] = useState(false);

  const verifyRules = useMemo(() => {
    const fn: Format = {};
    targetKeys.forEach((key: string) => {
      fn[key] = getRuleFn({
        rule: targetRules[key],
        Rules: Rules,
        error: error
      });
    });
    return fn;
  }, []);

  const verify = useCallback((key: string, newValue: any, options?: Options1) => {
    if (!isType('string', key)) {
      error('key must be String type');
      return;
    }
    if (!isType('function', verifyRules[key])) {
      error(`the key ${key} has no rule function, please make sure register the rule function`);
      return;
    }
    // for number case
    const realVal = isType('object', newValue) ? newValue.val : newValue;
    const effect: Options = options || { success: () => {}, fail: () => {} };
    const temp: Format = values;
    const resForKey = verifyRules[key](newValue);
    if (resForKey) {
      effect.success && effect.success();
      temp[key] = realVal;
      const resForAllKey = targetKeys.every((key: string) => temp[key]);
      if (resForAllKey) {
        setResult(true);
      }
    } else {
      const isHideWhenError = effect.fail && effect.fail();
      if (isType('boolean', isHideWhenError)) {
        if (isHideWhenError || !realVal) {
          temp[key] = '';
        }
      } else {
        temp[key] = '';
      }
    }
    setValues({ ...temp });
    if (process.env.NODE_ENV === 'development') {
      const tempLogs: Format = logs;
      tempLogs[key] = resForKey;
      setLogs({ ...tempLogs });
    }
    return resForKey;
  }, []);

  return { values, verify, logs, result };
}

export default useRules;
