/**
 * the rules of form input
 */
type Fn1 = (result: boolean, value: any) => void;

interface Result {
  value: any;
  verify: (cb?: Fn1) => boolean | void;
}

function useRules(): Result {
  return {
    value: '',
    verify: () => {}
  };
}

export default useRules;
