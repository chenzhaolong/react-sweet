/**
 * @file the repo of Context Component
 */

export class ProviderRepo {
  static repos: { [key: string]: any } = {};

  static saveToRepo(key: string, Context: any, force = false) {
    const keys = Object.keys(ProviderRepo.repos);
    if (keys.indexOf(key) === -1 || force) {
      if (keys.indexOf(key) !== -1) {
        delete ProviderRepo.repos[key];
      }
      ProviderRepo.repos[key] = Context;
    }
  }

  static getFromRepo(key: string) {
    if (Object.keys(ProviderRepo.repos).indexOf(key) !== -1) {
      return ProviderRepo[key];
    }
    return '';
  }

  static deleteFromRepo(key: string) {
    if (Object.keys(ProviderRepo.repos).indexOf(key) !== -1) {
      delete ProviderRepo[key];
    }
  }
}
