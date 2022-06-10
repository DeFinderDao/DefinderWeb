import { useMemo } from 'react'
import { createStore, applyMiddleware, Store, Action } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import reducers, { AppState } from './reducers'
import {Actions} from './types/index'

let store : Store<AppState, Actions> | undefined;

function initStore(initialState: AppState) {
  return createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}

export const initializeStore = (preloadedState: AppState) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: AppState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}

export type AppDispatch = Store<AppState, Actions>["dispatch"]

