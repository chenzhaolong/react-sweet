interface Result {
  useSend: (name: string, publishByDiffMessage: boolean) => (data: any) => void;
  useReceive: (name: string, callback: (msg: any) => void) => any;
}
declare function createContext(): Result;
export default createContext;
