/**
 * @file get the status of life cycle for functional component
 */
interface Value {
  status: string;
  updateTimes: number;
}
declare function useTrace(): Value;
export default useTrace;
