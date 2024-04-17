import React, { useEffect, useState } from 'react'
import { usecontext } from '../context/store';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'

const Orders = (props) => {
  const orders=props.data
  const navigate=useNavigate()
  const [Items,setItems]=useState([])
  const token=JSON.parse(localStorage.getItem('token'))
  const [userdata,setUserdata]=useState({})
  const [loading,setloading]=useState(false)
  const [loading2 ,setloading2]=useState(false)
  const [pop,setpop]=useState(false)
  const {setOrderinfo}=usecontext()
  useEffect(()=>{
    if(orders.length>0){
      setloading(true)
    }
    const items=[]
    for(let i=0;i<orders.length;i++) {
      const fetchdata=async()=>{
      const responce=await fetch('http://localhost:3000/getitemname',{
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({id:orders[i].itemId})
      })
      const res=await responce.json()
      items.push(res.data.itemData)
      console.log(items)
      if(items.length===orders.length){
        setItems(items)
        setloading(false)
      }
    }
    fetchdata()
    }
  },[])
  const handleclick=async(order)=>{
    setloading2(true)
    try {
      console.log(order)
      const responce=await fetch('http://localhost:3000/deleteadminorder',{
        method:'DELETE',
        headers:{'Content-Type':'Application/Json',
        'authorization':token.token},
        body:JSON.stringify({id:order})
      })
      const res=await responce.json()
      console.log(res)
      if(res){
        setloading2(false)
        setpop(true)
        setTimeout(() => {
          setpop(false)
        }, 2000);
      }
      setUserdata(res)
    } catch (error) {
      console.log(error)
    }
  }
  const handleclick2=async(userid)=>{
    try {
      const responce=await fetch('http://localhost:3000/getuserdata',{
        method:'POST',
        headers:{'Content-Type':'Application/Json'},
        body:JSON.stringify({userid:userid})
      })
      const res=await responce.json()
      if(res){
        if(res.success){
          setOrderinfo(res.data)
          navigate('/dashboard/orders/orderinfo')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  console.log(Items)
  if(loading){
    return <div className='order-container'><div className="loading">
    ...<ion-icon className='loading' name="cart-outline"></ion-icon></div></div>;
  }
else if(Items.length>0){
  return (
    <div className='order-container'>
      {loading2&&<div className="log-loading">
      <div className="load">
      ...<ion-icon className='logloading' name="cart-outline"></ion-icon></div>
    </div>}
    {
      pop && <div className="popmsg">updated successfully!</div>
    }
        <Outlet/>
      <h2 className='in'>Item Name</h2>
      <h2 className='q'>Quantity</h2>
      <div className="order-items">{
        Items.map((item)=>{
          return <h3 className='orders-each'>{item}</h3>
        })
      }</div>
      <div className="order-qty">
      {
        orders.map(order=>{
          return <h3 className='qty-each'>{order.qty}</h3>
        })
      }
      </div> 
      <div className="del-info">
        
        {
          orders.map((order)=>{
            return <div className='icon-hold'  onClick={()=>{handleclick2(order.userId)}} ><ion-icon name="information-circle-outline"></ion-icon></div>
          })
        }
      </div>
      <div className="del-btn">
        {
          orders.map((order)=>{
            return <button onClick={()=>{handleclick(order.itemId)}}>Delivered</button>
          })
        }
      </div> 
      <button onClick={()=>{
        navigate('/dashboard')
      }}>X</button>
    </div>
  )
}
else{
  return <div className="order-container"><div className="msg">No Orders found!</div>
  <button onClick={()=>{
        navigate('/dashboard')
      }}>X</button></div>
}
}
export default Orders