/**
 * the rules of form input
 */
import { useRule } from './useRule';

interface Options {
  [key: string]: any;
}

function useRules(options: Options) {
  return {
    value: '',
    verify: () => {}
  };
}

export default useRules;
