//@flow
type Effect<Action> = () => Promise<Action>
type Reducer<State, Action> = (state:State, action:Action) => State
type EffectReducer<State, Action> = (state:State, action:Action) => [State, ?Effect<Action>]
type Store <State, Action> = {
    dispatch: (action:Action) => void,
    getState: () => State,
    subscribe: (f: () => any) => void
}
type Enhancer<State,Action> = (reducer:Reducer<State, Action>, init:State, enhancer: ?Enhancer<State, Action>) => Store<State, Action>


export default <State, Action>(createStore:Enhancer<State, Action>) => (reducer:EffectReducer<State, Action>, init:State, enhancer:?Enhancer<State, Action>) => {
    let store;
    const liftReducer = reducer => (state, action) => {
        const [nextState, eff] = reducer(state, action)
        if (eff) eff()
            .then(store.dispatch, store.dispatch)
        return nextState
    }
    store = createStore(liftReducer(reducer), init, enhancer)
    return store
}