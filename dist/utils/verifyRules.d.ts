interface Options {
  val: any;
  min: any;
  max: any;
}
declare const _default: {
  wordNum: (options: Options) => boolean;
  number: (val: any) => boolean;
  noChinese: (val: any) => boolean;
  specStr: (val: any) => boolean;
};
export default _default;
