//@flow

import reduxEff from '../'

import * as Redux from 'redux'

type Store<State, Action> = {
    dispatch: (action:Action) => void,
    getState: () => State,
    subscribe: () => void
}

type State = {
    title: string
}

type Action  = 
    { type: 'SetTitle', title: string}
    | {type: 'AsyncSetTitle', title: string}

const reducer = (state:State, action:Action) => {
    switch (action.type) {
        case "SetTitle": 
            return [{...state, title: action.title}, null]
        case "AsyncSetTitle": 
            return [state, () => Promise.resolve({type: 'SetTitle', title: action.title})]
        default: 
            return [state, null]
    }
}
const init:State = {
    title: 'init'
}

const store:Store<State, Action> = Redux.createStore(reducer, init, reduxEff)


store.subscribe(() => console.log(store.getState()))
store.dispatch({type: 'AsyncSetTitle', title: 'title'})
