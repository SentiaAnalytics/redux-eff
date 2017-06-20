import test from 'tape'
import sinon from 'sinon'
import {createStore} from 'redux'
import reduxEff from './redux-eff'


const init = {title: 'init'}

const asyncSetTitle = (title) => Promise.resolve({type:'SetTitle', title})
const asyncSetTitleFail = (title) => Promise.reject({type:'SetTitle', title})

const reducer = (state, action) => {
    switch (action.type) {
        case "SetTitle": 
            return [{title: action.title}, null]
        case "SetTitleFail": 
            return [state, () => asyncSetTitleFail(action.title)]
        case "SetTitleSuccess": 
            return [state, () => asyncSetTitle(action.title)]
        default: return [state, null]
    }
}

test('should create a redux store', t => {
    t.plan(2)
    const {dispatch, getState} = createStore(reducer, init, reduxEff);
    t.deepEqual(getState(), {title: 'init'})
    dispatch({type: 'SetTitle', title: 'new'})
    t.deepEqual(getState(), {title: 'new'})

})

test('should handle resolved effects', t => {
    t.plan(2)
    const {dispatch, getState} = createStore(reducer, init, reduxEff);
    t.deepEqual(getState(), {title: 'init'})
    dispatch({type: 'SetTitleSuccess', title: 'Success'})
    setTimeout(() => t.deepEqual(getState(), {title: 'Success'}), 100)

})

test('should handle rejected effects', t => {
    t.plan(2)
    const {dispatch, getState} = createStore(reducer, init, reduxEff);
    t.deepEqual(getState(), {title: 'init'})
    dispatch({type: 'SetTitleFail', title: 'Fail'})
    setTimeout(() => t.deepEqual(getState(), {title: 'Fail'}), 100)

})