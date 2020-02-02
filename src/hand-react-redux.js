import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from './hand-redux.js'


export class Provider extends React.Component{
  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext () {
    // console.log("this.store:", this.store)
    return { store: this.store }
  }

  constructor (props,context) {
    super(props,context)
    this.store = props.store
    // console.log("props:",props.store)
  }

  render () {
    return this.props.children
  }
}

// // 这个是下面的双箭头函数的普通形式
// export function connect(mapStateToProps,mapDispatchToProps){
//   return function(WrapComponent){
//     return class ConnectComponent extends React.Component{

//     }
//   }
// }
// 利用双箭头函数
export const connect = (
	mapStateToProps=state=>state,
	mapDispatchToProps={})=>(WrapComponent)=>{
	return class ConnectComponent extends React.Component{
		static contextTypes = {
			store:PropTypes.object
		}
		constructor(props,context){
			super(props,context)
			this.state={
				props:{}
			}
		}

		componentDidMount(){
      const {store} = this.context
      // console.log("store",this.context,store)
			store.subscribe(()=>this.update())
			this.update()
    }
    
    update(){
			const {store} = this.context
			const stateProps = mapStateToProps(store.getState())
			// 数据可以直接给，方法不能直接给
			// 直接执行addGun()没有意义要store.dispatch(addGun())才有意义
			// 因此需要用dispatch将actioncreator包裹一层
			const dispatchProps = bindActionCreators(mapDispatchToProps,store.dispatch)
			this.setState({
				// 下面这个顺序很重要，是要用下面的东西覆盖上面的东西
				props:{
					...this.state.props,
					...stateProps,
					...dispatchProps
				} 
			})
		}

		render(){
			return <WrapComponent {...this.state.props} ></WrapComponent>
		}
	}
}
