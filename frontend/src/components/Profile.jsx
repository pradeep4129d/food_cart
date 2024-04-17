import React, { useEffect, useState } from 'react'
import { usecontext } from '../context/store'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [data,setdata]=useState({})
  const {setclassname}=usecontext()
  const [pop,setpop]=useState(false)
  const [form,setform]=useState({mobile:'',address:''})
  const token=JSON.parse(localStorage.getItem('token'))
  const navigate=useNavigate()
  const handleclick=async()=>{
    const responce=await fetch('http://localhost:3000/updateUser',{
      method:"PUT",
      headers:{'authorization':token.token,'Content-Type': 'application/json'},
      body:JSON.stringify(form)
    })
    const res=await responce.json()
    if(res)
    if(res.success){
      setpop(true)
      setTimeout(() => {
        setpop(false)
      }, 2000);
    }
    (res.success)&&navigate('/Profile')
  }
  useEffect( ()=>{
    const fetchdata=async()=>{
      const token=JSON.parse(localStorage.getItem('token'))
      if(token){
      const response=await fetch('http://localhost:3000/getuser',{method:'GET',headers:{'Authorization':token.token}})
      const res=await response.json()
      console.log(res)
      setdata(res)
      setform({mobile:res.data.mobile,address:res.data.address})
      }
    }
    fetchdata()
  },[])
  useEffect(()=>{},[data])
  if(!data.success){
    return <div className='yorderpage'><div className="loading">
    ...<ion-icon className='loading' name="cart-outline"></ion-icon></div></div>;
  }
  else{
  return (
    <>
    {
      pop && <div className="popmsg">updated successfully !</div>
    }
    <div className='profile'>
      <button className='user-logout' onClick={()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        setclassname('click1')
        navigate('/')
        setLoginState('')
      }}>logout</button>
      <div className="profile-card">
        <div className="profile-logo">
        <ion-icon  name="cart-outline"></ion-icon>
        </div>
        <div className="user-data">
          <div className="data-con">
            <h3 className='name'>{data.data.username}</h3>
            <p><h3>cart Items: {data.data.cart_items.length}</h3><h3>Current orders: {data.data.your_orders.length}</h3></p>
            <div className="pro-form">
            <input value={form.mobile}type="number" name="mobile" id=""  placeholder='Mobile no' onChange={(e)=>{
              setform({...form,mobile:e.target.value})
            }}/>
            <input value={form.address} type="text" placeholder='Address' onChange={(e)=>{
              setform({...form,address:e.target.value})
            }}/>
          </div>
          <button className='pro-btn' onClick={()=>{handleclick()}}>Update profile</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}}
export default Profile