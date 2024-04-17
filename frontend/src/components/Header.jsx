import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import { useState } from 'react'
import Login from './Login'
import { usecontext } from '../context/store'

const Header = () => {
  const {classname,setclassname}=usecontext()
  const {exit ,setExit,state,loginState,cat}=usecontext()
  const token = JSON.parse(localStorage.getItem('token'));
  const [catclass,setcatclass]=useState('')
  const categories=["Biriyani","Breakfasts","Rice","curries","Snacks","street Foods","cool drinks","fruits","fruit Juices","Sweets","Beverages"]
  useEffect(()=>{
    const token = JSON.parse(localStorage.getItem('token'));
  })
  const navigate=useNavigate()
  return (
    <>
    <div className="container"></div>
    <div className='Header'>
      <div className="logo">
        <h1>Food</h1>
        <ion-icon className='icon' name="cart-outline"></ion-icon>
      </div>
      <div id='search'></div>
      <div className={"con "+classname}></div>
      {(!token)&&<Link className='login' onClick={()=>{setExit('f')}}>Login</Link>}
      {(token)&&((!token.admin)&&<Link className='prof' to='/Profile'onClick={()=>{setclassname('click5')}}>Profile</Link>)}
      <nav className='nav'>
        <Link to='/' onClick={()=>{
          setclassname('click1')
        }}>Home</Link>
        <Link className="cat-tag" >Categories</Link>
        <nav className={`categ`}>
        {
          cat.map(cate=>{
            return <a href={`#${cate}`}>{cate}</a>
          })
        }
      </nav>
        <Link to='/Cart'onClick={()=>{
          setclassname('click3')
        }}>Cart</Link>
        <Link to='/Yourorder'onClick={()=>{
          setclassname('click4')
        }}>YourOrders</Link>
      </nav>
      {(exit==='f')&&((state==='login')?<Login h='login' t='Dont you have account?' n='signup'/>:<Login h='Signup' t='Already have an account?' n='login'/>)}
    </div>
    </>
  )
}
export default Header