/**
 * @file store of Component
 */
import React, { Component } from 'react';
import { error } from '../../utils/log';
import { isString } from 'lodash';
import { ProviderRepo } from '../../utils/ProviderRepo';

interface Input {
  key: string;
  initState: object;
  force?: boolean;
}

interface Output {
  Provider: Component;
  Consumer: Component;
}

function createHookProvider(options: Input): Output {
  const { key, initState, force = false } = options;
  if (!isString(key)) {
    error('the first params must exist when invoke createHookProvider.');
  }
  const initState1 = initState || {};
  const StoreContext: any = React.createContext(initState1);
  ProviderRepo.saveToRepo(key, StoreContext, force);
  return { Provider: StoreContext.Provider, Consumer: StoreContext.Consumer };
}

export default createHookProvider;
