/**
 * @file store of Component
 */
import React, { Component } from 'react';
import { error } from '../../utils/log';
import { isString } from 'lodash';
import { ProviderRepo } from '../../utils/ProviderRepo';

interface Input {
  key: string;
  force?: boolean;
}

interface Output {
  Provider: Component;
  Consumer: Component;
}

function createHookProvider(options: Input): Output {
  const { key, force = false } = options;
  if (!isString(key)) {
    error('the params must exist key when invoke createHookProvider.');
  }
  // @ts-ignore
  const StoreContext: any = React.createContext();
  ProviderRepo.saveToRepo(key, StoreContext, force);
  return { Provider: StoreContext.Provider, Consumer: StoreContext.Consumer };
}

export default createHookProvider;
