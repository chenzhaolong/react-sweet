export declare class Upload {
  static getMd5(file: File, useMd5: boolean): Promise<unknown>;
  static checkFileOverSize(fileSize: number, limitFileSize?: number): boolean;
  static getChunkNumber(file: File, chunkSize: number): number;
  static checkChunkOverNumber(chunkNumber: number, limitChunkNumber?: number): boolean;
  static computeChunkContent(file: File, baseSize: number, chunk: number): Blob;
  static getUploadParams(
    file: File,
    chunkNumber: number,
    chunkSize: number,
    md5Value: any
  ): {
    chunk: number;
    content: Blob;
    md5: any;
  }[];
  static checkFile(file: any): boolean;
  static checkFn(uploadFn: any, options: any): void;
  static checkUploadTimeOut(startTime: number, endTime: number, timeout: number): boolean;
}
