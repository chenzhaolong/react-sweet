/**
 * @file 验证规则
 */

interface Options {
  val: any;
  min: number;
  max: number;
}

export default {
  wordNum: (options: Options) => {
    const { val, min, max } = options;
    if (!val || min === max) {
      return false;
    }
    const minimum = min <= max ? min : max;
    const maximum = min <= max ? max : min;
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
    const str = /[!@#$%^&*()+?\\\/\-【】（ ）「」{}，]+/;
    const regExp = new RegExp(str, 'g');
    return !regExp.test(val);
  }
};
