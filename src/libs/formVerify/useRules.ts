/**
 * the rules of form input
 * todo:后续支持外部注册规则表，然后直接在rule填写外部规则名
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
  success?: () => any;
  fail?: () => any;
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
  if (!isType('object', options)) {
    error('the options of input params must be object');
  }

  const { targetRules, targetInitValues, targetLogs, targetKeys, targetCleanWhenError } = useMemo(() => {
    const targetKeys = Object.keys(options);
    const targetRules: Format = {};
    const targetInitValues: Format = {};
    const targetLogs: Format = {};
    const targetCleanWhenError = {};

    targetKeys.forEach((key: string) => {
      targetRules[key] = get(options, `${key}.rule`, '');
      targetInitValues[key] = get(options, `${key}.initValue`, '');
      targetLogs[key] = false;
      targetCleanWhenError[key] = get(options, `${key}.isCleanWhenError`, false);
    });
    return { targetRules, targetInitValues, targetLogs, targetKeys, targetCleanWhenError };
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

  const verify = useCallback((key: string, newValue: any, options1?: Options1) => {
    if (!isType('string', key)) {
      error('key must be String type');
      return;
    }
    if (!isType('function', verifyRules[key])) {
      error(`the key ${key} has no rule function, please make sure register the rule function`);
    }
    // for number case
    const realVal = isType('object', newValue) ? newValue.val : newValue;
    let effect: Options1 = {};
    if (isType('object', options1)) {
      // @ts-ignore
      effect = options1;
    } else if (isType('function', options1)) {
      // @ts-ignore
      effect = { success: options1 };
    }
    const temp: Format = values;
    const tempLogs: Format = logs;
    const resForKey = verifyRules[key](newValue);
    tempLogs[key] = resForKey;
    if (resForKey) {
      effect.success && effect.success();
      temp[key] = realVal;
    } else {
      effect.fail && effect.fail();
      if (targetCleanWhenError[key]) {
        temp[key] = '';
      } else {
        temp[key] = realVal;
      }
    }
    const resForAllKey = targetKeys.every((key: string) => tempLogs[key]);
    setResult(resForAllKey);
    setValues({ ...temp });
    setLogs({ ...tempLogs });
    return resForKey;
  }, []);

  return { values, verify, logs, result };
}

export default useRules;
