import React, { useState } from 'react'
import "./Login.css"
import { usecontext } from '../context/store'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const navigate=useNavigate()
  const [loading ,setloading]=useState(false)
  const {exit ,setExit,setState,setLoginState,loginState,setclassname}=usecontext()
  const [data,setData]=useState({username:'',password:'',admin:'false',mobile:'',address:''})
  console.log(data)
  return (
    <>
    {loading && <div className="log-loading">
      <div className="load">
      ...<ion-icon className='logloading' name="cart-outline"></ion-icon></div>
    </div>}
    <div className={'login-container '+exit}>
      <form onSubmit={async (e)=>{
          e.preventDefault()
          setloading(true)
          const now = new Date();
          const expiryTime = new Date(now.getTime() + (1 * 60 * 60 * 1000));
          if(props.n!=='signup'){
            try {
              const response =await fetch('http://localhost:3000/signup',{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(data)
              })
              const res=await response.json()
              if (res){
              if(res.msg){
                setloading(false)
                ((res.admin)?setLoginState('adminlogin'):setLoginState('userlogin'))
                console.log(res.data.token)
                localStorage.setItem('token', JSON.stringify({token:res.data.token,admin:res.admin}));
                localStorage.setItem('tokenExpiry', expiryTime.getTime());
                setclassname('click1')
                navigate('/')
              }
              else{
                setloading(false)
                alert('Username already taken')
              }
              }
            } catch (error) {
              setloading(false)
              alert("Error Occured Please try again")
              console.log(error)
            }
          }
          else{
            try {
              const response =await fetch('http://localhost:3000/login',{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json'
              },
                body:JSON.stringify(data)
              })
              const res=await response.json()
              if (res)
              {
                console.log(res)
                if(res.msg){
                ((res.admin)?setLoginState('adminlogin'):setLoginState('userlogin'))
                localStorage.setItem('token', JSON.stringify({token:res.data.token,admin:res.admin}));
                localStorage.setItem('tokenExpiry', expiryTime.getTime());
                setloading(false)
                setclassname('click1')
                navigate('/')
              }
              else{
                setloading(false)
                alert('Invalid Credentials')
              }
              }
            } catch (error) {
              console.log(error)
            }
          }
      }}>
        <div className={"exit"} onClick={()=>{
            setExit('t')
        }}>X</div>
        <h2>{props.h}</h2>
        <div className="username">
          <label htmlFor="username">Username </label>
          <input type="text" id="username" name="username" required onChange={(e)=>{setData({...data,username:e.target.value})}}/>
        </div>
        <div className='password'>
          <label htmlFor="password">Password </label>
          <input type="password" id="password" name="password"  required onChange={(e)=>{setData({...data,password:e.target.value})}}/>
        </div>
        <button className='btn' type="submit">Submit</button>
        <p className='r'><input type="checkbox" value='true' name="r" id="ri" onClick={(e)=>{(data.admin==='false')?setData({...data,admin:'true'}):setData({...data,admin:'false'})}}/>Admin</p>
        <p className='s'>{props.t}<a onClick={()=>{
            setState(props.n)
        }}>{props.n}</a></p>
      </form>
    </div>
    </>
  )
}
export default Login