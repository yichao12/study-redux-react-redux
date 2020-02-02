

const thunk = ({dispatch,getState})=>next=>action=>{
	console.log(action,typeof action)
	// 如果是函数，则是异步类的操作。执行一下，参数是dispatch和getState
	if(typeof action == 'function'){
		return action(dispatch,getState)
	}
  // 默认状态，什么都没干。
  // 即action只是对象，因此不可能是异步类的操作，所以直接返回即可
	return next(action)
}
export default thunk
