/**
 * the rules of form input
 * todo:后续支持外部注册规则表，然后直接在rule填写外部规则名
 */
import { useCallback, useMemo, useState } from 'react';
import { getRuleFn, isType, isPromise } from '../../utils/tools';
import { error } from '../../utils/log';
import { get, isBoolean } from 'lodash';
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

function useRules(options: Options, deps: Array<any> = []): Result {
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
      targetLogs[key] = '';
      targetCleanWhenError[key] = get(options, `${key}.isCleanWhenError`, false);
    });
    return { targetRules, targetInitValues, targetLogs, targetKeys, targetCleanWhenError };
  }, deps);

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
  }, deps);

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

    const resForKey = verifyRules[key](newValue);

    const reaction = (resForKey1: boolean, updateValues = true) => {
      if (!isBoolean(resForKey1)) {
        error('the result after verify must be boolean when use useRules.');
      }

      const temp: Format = values;
      const tempLogs: Format = logs;
      tempLogs[key] = resForKey1;

      if (resForKey1) {
        effect.success && effect.success();
        temp[key] = realVal;
      } else {
        effect.fail && effect.fail();
        if (targetCleanWhenError[key]) {
          updateValues = true;
          temp[key] = '';
        } else {
          temp[key] = realVal;
        }
      }

      const resForAllKey = targetKeys.every((key: string) => tempLogs[key] && true);
      setResult(resForAllKey);
      updateValues && setValues({ ...temp });
      setLogs({ ...tempLogs });
    };

    // 存在校验函数是异步
    if (isPromise(resForKey)) {
      // 由于promise异步关系，先更新输入框，避免出现输入框卡顿现象。
      const temp: Format = values;
      temp[key] = realVal;
      setValues({ ...temp });
      return resForKey
        .then((d: any) => {
          reaction(d, false);
          return d;
        })
        .catch(() => {
          reaction(false, false);
          return false;
        });
    } else {
      reaction(resForKey);
      return resForKey;
    }
  }, deps);

  return { values, verify, logs, result };
}

export default useRules;
