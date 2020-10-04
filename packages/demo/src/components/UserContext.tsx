import { createContext, useEffect, useState } from 'react';

export interface InfiniteAny {
  [key: string]: any; //eslint-disable-line @typescript-eslint/no-explicit-any
}

export type IUserContext = {
  name: string;
} & InfiniteAny;

export const UserContext = createContext<IUserContext>({ name: '' });

type UpdateHandler = (value: IUserContext) => void;

class ContextGlobalStore {
  private _value: IUserContext;
  private _handlers: UpdateHandler[];

  constructor() {
    this._value = { name: '' };
    this._handlers = [];
  }

  get value() {
    return this._value;
  }

  set value(v: IUserContext) {
    this._value = v;
    this._handlers.forEach((h) => h(this._value));
  }

  attach(handler: (value: IUserContext) => void) {
    this._handlers.push(handler);
  }
}

const rootStore = new ContextGlobalStore();

export const setContextValue = (value: IUserContext): void => {
  rootStore.value = value;
};

export const getContextValue = (): IUserContext => rootStore.value;

export const useContextValue = (): IUserContext => {
  const [state, setState] = useState(rootStore.value);

  useEffect(() => {
    rootStore.attach(setState);
  }, [setState]);

  return state;
};
