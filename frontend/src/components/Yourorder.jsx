import React, { useEffect, useState } from 'react'
import { usecontext } from '../context/store';

export const Yourorder = () => {
  const token=JSON.parse(localStorage.getItem('token'))
  const [orderIds,setOrderIds]=useState([])
  const [Items,setItems]=useState([])
  const [loading,setloading]=useState(false)
  useEffect(()=>{
    const fetchdata=async()=>{
      const response=await fetch('http://localhost:3000/getOrders',
      {
        method:'GET',
        headers:{'authorization':token.token}
      })
      const res=await response.json()
      setOrderIds(res.data)
    }
    fetchdata()
  },[])
useEffect(()=>{
    if(orderIds.length > 0){
      setloading(true)
      const items=[]
      for(let i=0;i<orderIds.length;i++){
        const fetch3=async()=>{
          const responce=await fetch('http://localhost:3000/getitem',{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({ id:orderIds[i].itemId})
          })
          const res=await responce.json()
          items.push(res.data.itemData)
          if(items.length===orderIds.length){
            setItems(items)
            setloading(false)
        }
        }
        fetch3() 
    }}
    else{
      setloading(false)
    }
  },[orderIds])
  function arrayBufferToImage(buffer) {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  if(!token){
    return <div className="yorderpage"><div className="msg">Please Login to view your orders</div></div>
  }
  if(token && loading){
    return <div className='yorderpage'><div className="loading">
    ...<ion-icon className='loading' name="cart-outline"></ion-icon></div></div>;
  }
if(token && !loading && Items.length===0){
  return <div className="yorderpage"><div className="msg"><pre>              No items</pre></div></div>
}
  if(token && Items.length>0){
    return (
    <div className='yorderpage'>
        {
          (Items.length>=0)&&(Items.map((item,index)=>{
            return (
              <div className="cart-card" key={index} >
                <img src={arrayBufferToImage(item.image[0].data)} alt="" />
                <div className="cart-data">
                <h3>{item.item_name}</h3>
                <h3>₹{item.cost}</h3>
                <h3>delivery:On the way</h3>
                <h3>Type:{item.type}</h3>
                <h3>Quantity:{orderIds[index].qty}</h3>
                </div>
              </div>
            )
          }))
        }
    </div>
  )}
}
