import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import {usecontext} from '../context/store'
import { useNavigate } from 'react-router-dom'

const DashBoard = () => {
  const {setclose,setLoginState}=usecontext()
  const [data,setdata]=useState([])
  const token=JSON.parse(localStorage.getItem('token'))
  const [Edit,setedit]=useState({class:'info-t',data:{item_name:''},image:''})
  const [image,setimage]=useState('')
  const {orders,setOrders}=usecontext()
  const [refresh,setRefresh]=useState(false)
  const [loading,setloading]=useState(false)
  const navigate=useNavigate()
  const [pop,setpop]=useState(false)
  useEffect(()=>{
    const token=JSON.parse(localStorage.getItem('token'))
    const fetchdata=async()=>{
      const responce = await fetch('http://localhost:3000/getadmin',
      {method: 'GET',
      headers:{'authorization':token.token}
    })
    const res=await responce.json()
    console.log(res)
    if(res){
      res.success && setloading(false)
    }
    setdata(res.data.items)
    setOrders(res.data.orders)
    }
    fetchdata()
  },[refresh])
  function arrayBufferToImage(buffer) {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  const handleclick=async(id)=>{
    setloading(true)
    try {
      const responce=await fetch('http://localhost:3000/deleteproduct',{
        method:'DELETE',
        headers:{
          'authorization':token.token,
          'Content-Type':'application/json'},
          body:JSON.stringify({Id:id})
      })
      const res=await responce.json()
      console.log(res)
      if(res){
        setloading(false)
        setpop(true)
        setTimeout(() => {
          setpop(false)
        }, 2000);
        setRefresh((refresh)?false:true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='dash'>
        <Outlet/>
        {loading && <div className="log-loading">
      <div className="load">
      ...<ion-icon className='logloading' name="cart-outline"></ion-icon></div>
    </div>
    }
    {
      pop && <div className="popmsg">Deleted successfully!</div>
    }
        <button className='logout' onClick={()=>{
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          setLoginState('')
          navigate('/')
        }}>Logout</button>
        <h1><hr/>DashBoard</h1>
        <h1 className='refresh' onClick={()=>{
          navigate('/dashboard')
          setloading(true)
          setRefresh((refresh)?false:true)}}><ion-icon name="reload-outline"></ion-icon></h1>
        <div className="dash-container">
          { (data)&&data.map(item =>(
              <div className="card">
              <h3>{item.item_name}</h3>
              <h3>State:{item.availability}</h3>
              <div className="buttons">
              <button className='edit' >
              <ion-icon name="information-circle-outline" onClick={()=>{setedit({class:'info',data:item,image:item.image[0].data})}}></ion-icon>
              </button>
              <button className='remove' id={item._id} onClick={()=>{handleclick(item._id)}}>
              <ion-icon name="trash-outline" className='remove-logo' ></ion-icon>
              </button>
              </div>
            </div>
          ))}
          <div className={Edit.class}>
            <div className="matter">
            <h3>Item name: {Edit.data.item_name}</h3>
            <h3>cost: {Edit.data.cost}</h3>
            <h3>delivery time: {Edit.data.delivery_time}min</h3>
            <h3>categories: {Edit.data.category}</h3>
            <h3>type: {Edit.data.type}</h3>
            </div>
            <img className='info-img'
              src={arrayBufferToImage(Edit.image)}
            />
            <button className='add to' onClick={()=>{setedit({...Edit,class:'info-t'})}}>close</button>
          </div>
        </div>
        <Link  onClick={()=>{
          setclose('')
        }}className="add" to='/dashboard/add'>Add item</Link>
        <Link className="orders" to='/dashboard/orders'>Orders <sup>({orders.length})</sup></Link>
    </div>
  )
}
export default DashBoard