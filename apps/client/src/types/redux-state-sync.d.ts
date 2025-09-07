declare module 'redux-state-sync' {
  import { Middleware, Store } from 'redux';

  interface Config {
    channel?: string;
    predicate?: (action: any) => boolean;
    blacklist?: string[];
    whitelist?: string[];
    broadcastChannelOption?: any;
    prepareState?: (state: any) => any;
  }

  export function createStateSyncMiddleware(config?: Config): Middleware;
  export function initMessageListener(store: Store): void;
  export function initStateWithPrevTab(store: Store): void;
}
