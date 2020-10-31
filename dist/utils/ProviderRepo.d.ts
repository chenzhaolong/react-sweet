/**
 * @file the repo of Context Component
 */
export declare class ProviderRepo {
  static repos: {
    [key: string]: any;
  };
  static saveToRepo(key: string, Context: any, force?: boolean): void;
  static getFromRepo(key: string): any;
  static deleteFromRepo(key: string): void;
}
