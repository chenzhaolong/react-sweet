/**
 * @file the context of react hook
 */
import { useCallback, useRef } from 'react';
import { isFunction, isEqual } from 'lodash';
import { hasProperty } from '../../utils/tools';

type TempZone = {
  [key: string]: any;
};

type Events = {
  [key: string]: Array<any>;
};

interface Result {
  useSend: (name: string, publishByDiffMessage: boolean) => (data: any) => void;
  useReceive: (name: string, callback: () => any) => void;
}

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

  listener(name: string, cb: (value: any) => any): void {
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

function createContext(): Result {
  const context = new ContextEvent();
  const historyMsg = {};
  const registerMsg = (name: string): void => {
    if (!historyMsg[name]) {
      historyMsg[name] = [];
    }
  };
  const hasSameHistoryMsg = (name: string, msg: any): boolean => {
    if (historyMsg[name].length > 0) {
      if (!isEqual(historyMsg[name][0], msg)) {
        historyMsg[name].shift();
        historyMsg[name].push(msg);
        return false;
      }
      return true;
    } else {
      historyMsg[name].push(msg);
      return false;
    }
  };
  return {
    useSend(name: string, publishByDiffMessage = false): (data: any) => void {
      publishByDiffMessage && registerMsg(name);
      const send = useCallback((data: any) => {
        if (publishByDiffMessage) {
          !hasSameHistoryMsg(name, data) && context.publish(name, data);
        } else {
          context.publish(name, data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return send;
    },
    useReceive(name: string, callback: () => any): void {
      const events = useCallback((callback) => {
        context.listener(name, callback);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      events(callback);
    }
  };
}

export default createContext;
