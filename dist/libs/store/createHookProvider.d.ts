/**
 * @file store of Component
 */
import { Component } from 'react';
interface Input {
  key: string;
  force?: boolean;
}
interface Output {
  Provider: Component;
  Consumer: Component;
}
declare function createHookProvider(options: Input): Output;
export default createHookProvider;
