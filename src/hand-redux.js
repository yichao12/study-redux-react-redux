// redux中的createStore函数、bindActionCreators函数（该函数，给react-redux使用）

// enhancer是中间件的参数，先对createStore进行一次扩展
export function createStore(reducer, enhancer){
	if(enhancer){
    // 对createStore进行扩展，用enhancer里面包一下
		return enhancer(createStore)(reducer)
	}
	let currentState = {}
	let currentListeners = []
	function getState(){
		return currentState
	}
	function subscribe(listener){
		currentListeners.push(listener)
	}
	function dispatch(action){
		currentState= reducer(currentState, action)
		currentListeners.forEach(v=>v()) 
		return action
	}
	// 为了使其一开始就具有初始状态，因此……，type具有随机值
  dispatch({type:'@hand-redux-WaYiCh'})
  // console.log("store三个接口:",{getState, subscribe, dispatch})
	return {getState, subscribe, dispatch}
}


function bindActionCreator(creator,dispatch){
  return (...args)=>dispatch(creator(...args))
}
export function bindActionCreators(creators,dispatch){
  // let bound = {}
  // Object.keys(creators).forEach(v=>{
  // 	let creator = creators[v]
  // 	bound[v] = bindActionCreator(creator,dispatch)
  // })
  // return bound

  // 遍历之后"累加"有一个通用的方法reduce
  // reduce第一个参数是累加逻辑：为一个函数(其第一个参数ret是累加结果的初始值参数)
  // reduce第二个参数是结果的初始值:{}
  return Object.keys(creators).reduce((ret,item)=>{
    ret[item] = bindActionCreator(creators[item],dispatch) 
    return ret 
  },{})
}



// //单个中间件
// // 该函数时redux的函数，下面为实现细节，下面为单个中间件
// // 经过测试可以使用
// export function applyMiddleware(middleware){
// 	return createStore=>(...args)=>{
// 		const store = createStore(...args)
// 		let dispatch = store.dispatch

// 		const midApi = {
// 			getState:store.getState,
// 			dispatch:(...args)=>dispatch(...args)
// 		}

// 		dispatch = middleware(midApi)(store.dispatch)
// 		return {
// 			...store,
// 			dispatch
// 		}
// 	}
// }


// 如果是多个中间件*******
export function applyMiddleware(...middlewares){
  // 对应上面的enhancer的使用方式
	return createStore=>(...args)=>{
    // 取得原始的store
		const store = createStore(...args)
		let dispatch = store.dispatch

		const midApi = {
			getState:store.getState,
			dispatch:(...args)=>dispatch(...args)
		}
		const middlewareChain = middlewares.map(middleware=>middleware(midApi))
		dispatch = compose(...middlewareChain)(store.dispatch)
		return {
      ...store,
      dispatch
		}
	}
}

// compose的作用
// compose(fn1,fn2,fn3)   // 返回:fn1(fn2(fn3))，将其变成嵌套的形式依次调用
export function compose(...funcs){
	if(funcs.length==0){
		return arg=>arg
	}
	if(funcs.length==1){
		return funcs[0]
	}
	return funcs.reduce((ret,item)=>(...args)=>ret(item(...args)))
}

// // 下面是支持数组的中间件
// const arrThunk = ({getState,getState})=>next=>action=>{
// 	// console.log(action,typeof action)
// 	if(Array.isArray(action)){
// 		return action.forEach(v=>dispatch(v))
// 	}
// 	// 如果不符合我们要求，直接调用下一个中间件，使用next
// 	// 如果符合我们的要求，需要重新dispatch，调用dispatch即可
// 	// 如果是函数，执行一下，参数是dispatch和getState
// 	if(typeof action == 'function'){
// 		return action(dispatch,getState)
// 	}
// 	// 默认状态，什么都没干
// 	return next(action)
// }
// export default arrThunk
