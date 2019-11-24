/**
 * @file the context of react hook
 */
import { useCallback, useEffect } from 'react';

class ContextEvent {
  events: object;
  constructor() {
    this.events = {};
  }

  publish(name: string, data: any): void {
    const eventNames = Object.keys(this.events);
    if (eventNames.indexOf(name) !== -1) {
      // @ts-ignore
      this.events[name].shift();
      // @ts-ignore
      this.events[name].push(data);
    } else {
      // @ts-ignore
      this.events[name] = [];
      // @ts-ignore
      this.events[name].push(data);
    }
  }
}

function createContext() {
  const context = new ContextEvent();
  return {
    useSend(name: string, prop: any) {
      useEffect(() => {
        context.publish(name, prop);
      }, [prop]);
    },
    useReceive(): any {
      const events = useCallback(() => {
        return context.events;
      }, []);
      return events();
    }
  };
}

export default createContext;
