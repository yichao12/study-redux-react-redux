

// 下面是支持数组的中间件
const arrThunk = ({getState,dispatch})=>next=>action=>{
  // console.log(action,typeof action)
  // 如果是数组的话，每个都dispatch一下
	if(Array.isArray(action)){
		return action.forEach(v=>{
      dispatch(v)
      // console.log("v:",v)
    })
	}
	// 如果不符合我们要求，直接调用下一个中间件，使用next
	// 如果符合我们的要求，需要重新dispatch，调用dispatch即可
	// 如果是函数，执行一下，参数是dispatch和getState
	if(typeof action == 'function'){
		return action(dispatch,getState)
	}
	// 默认状态，什么都没干
	return next(action)
}
export default arrThunk