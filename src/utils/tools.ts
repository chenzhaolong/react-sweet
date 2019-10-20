/**
 * @file tools for react-sweet
 */
export function hasProperty(target: object, property: string, type?: string): boolean {
  if (typeof target !== 'object' || !property) {
    return false;
  }
  if (target.hasOwnProperty(property)) {
    if (type) {
      // @ts-ignore
      return typeof target[property] === type;
    }
    return true;
  } else {
    return false;
  }
}
