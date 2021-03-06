/**
 * @file entry file
 */

/* lifeCycle */
export { default as useMount } from './libs/lifeCycle/useMount';
export { default as useUpdate } from './libs/lifeCycle/useUpdate';
export { default as useUpdates } from './libs/lifeCycle/useUpdates';
export { default as useDestroy } from './libs/lifeCycle/useDestroy';
export { default as useTrace } from './libs/lifeCycle/useTrace';
export { default as useTraces } from './libs/lifeCycle/useTraces';
export { default as useLifeCycle } from './libs/lifeCycle/useLifeCycle';

/* tools */
export { default as useTitle } from './libs/tools/useTitle';
export { default as useComputed } from './libs/tools/useComputed';
export { default as useSwitch } from './libs/tools/useSwitch';
export { default as useFor } from './libs/tools/useFor';
export { default as useData } from './libs/tools/useData';
export { default as createContext } from './libs/tools/createContext';
export { default as useCondition } from './libs/tools/useCondition';
export { default as useMethod } from './libs/tools/useMethod';

/* native */
export { default as useFn } from './libs/native/useFn';
export { default as useResize } from './libs/native/useResize';
export { default as useAwait } from './libs/native/useAwait';
export { default as useOffset } from './libs/native/useOffset';

/* async */
// export { default as useFetchForMount } from './libs/async/useFetchForMount';
export { default as useAutoFetch } from './libs/async/useAutoFetch';
export { default as usePolling } from './libs/async/usePolling';
export { default as useFetch } from './libs/async/useFetch';
export { default as useRelyFetch } from './libs/async/useRelyFetch';
export { default as useUploadFile } from './libs/async/useUploadFile';

/* form verify */
export { default as useRules } from './libs/formVerify/useRules';
export { default as useRule } from './libs/formVerify/useRule';
// export { default as useInputChange } from './libs/formVerify/useInputChange';

/* store */
export { default as useStore } from './libs/store/useStore';
export { default as createHookProvider } from './libs/store/createHookProvider';
export { default as useConnect } from './libs/store/useConnect';

/* commonBiz */
// export { default as useLazyLoad } from './libs/commonBiz/useLazyLoad';
// export { default as useImageLoad } from './libs/commonBiz/useImageLoad';
