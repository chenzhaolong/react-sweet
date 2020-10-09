/**
 * @file 验证规则
 */
import { warning } from './log';
import { isType } from './tools';

interface Options {
  val: any;
  min: any;
  max: any;
}

export default {
  wordNum: (options: Options) => {
    const { val, min, max } = options;
    if (!val) {
      return false;
    }
    // 识别0
    if (!(min + '') || !(max + '')) {
      warning('has no min and max in verify when the rule is wordNum.');
      return false;
    }
    const minimum = isType('string', min) ? parseInt(min) : min;
    const maximum = isType('string', max) ? parseInt(max) : max;
    if (minimum >= maximum) {
      warning('min can not large than or equal to max when the rule is wordNum.');
      return false;
    }
    const length = typeof val === 'number' ? val : val.length ? val.length : -1;
    return length >= minimum && length <= maximum;
  },

  number: (val: any) => {
    if (!val) {
      return false;
    }
    if (typeof val === 'string') {
      return parseFloat(val) + '' === val;
    }
    return typeof val === 'number';
  },

  noChinese: (val: any) => {
    const regExp = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    if (!val) {
      return false;
    }
    return !regExp.test(val);
  },

  specStr: (val: any) => {
    if (!val) {
      return false;
    }
    const str = /[!@#$%^&*()+?\\\/\-【】（ ）「」{}，,.。]+/;
    const regExp = new RegExp(str, 'g');
    return !regExp.test(val);
  }
};
