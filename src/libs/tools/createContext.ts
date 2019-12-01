/**
 * @file the context of react hook
 */
import { useCallback, useEffect } from 'react';
import { isFunction } from 'lodash';
import { hasProperty } from '../../utils/tools';

type TempZone = {
  [key: string]: any;
};

type Events = {
  [key: string]: Array<any>;
};

class ContextEvent {
  events: Events;
  tempZone: TempZone;

  constructor() {
    this.events = {};
    this.tempZone = {}; // temporary data for invoke the listener function
  }

  publish(name: string, data: any): void {
    const eventNames = Object.keys(this.events);
    if (eventNames.indexOf(name) !== -1 && this.events[name].length > 0) {
      this.events[name].forEach((fn) => {
        isFunction(fn) && fn(data);
      });
    } else {
      this.tempZone[name] = data;
    }
  }

  listener(name: string, cb: (value: any) => any) {
    if (hasProperty(this.tempZone, name)) {
      cb(this.tempZone[name]);
      delete this.tempZone[name];
    }

    const eventNames = Object.keys(this.events);
    if (eventNames.indexOf(name) !== -1) {
      this.events[name].shift();
      this.events[name].push(cb);
    } else {
      this.events[name] = [];
      this.events[name].push(cb);
    }
  }
}

function createContext() {
  const context = new ContextEvent();
  return {
    useSend(name: string, prop: any, deps?: Array<any>) {
      useEffect(() => {
        context.publish(name, prop);
      }, deps);
    },
    useReceive(name: string, callback: () => any): any {
      const events = useCallback((callback) => {
        context.listener(name, callback);
      }, []);
      return events(callback);
    }
  };
}

export default createContext;
