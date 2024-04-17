import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usecontext } from '../context/store'

const Cart = () => {
  const items=[]
  const {setclassname}=usecontext()
  const [userdata,setuserdata]=useState([])
  const [itemdata,setitemdata]=useState([])
  const [loading,setloading]=useState(true)
  const [pop,setpop]=useState(false)
  const [loading2,setloading2]=useState(false)
  const [success,setSuccess]=useState({state:false,itemid:null})
  const navigate=useNavigate()
  const token=JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    const token=JSON.parse(localStorage.getItem('token'))
    if(token){
      if(!token.admin){
        if(!userdata.length)
        {const fetchdata=async()=>{
          const responce=await fetch('http://localhost:3000/getuser',{method:'GET',headers:{'authorization':token.token}})
          const res=await responce.json()
          console.log(res)
          setuserdata(res.data)
        }
        fetchdata()
      }
      }
    }
  },[])
  useEffect(()=>{
      if(userdata){
        const fetchdata2=async()=>{
          for(let i=0;i<userdata.cart_items.length;i++){
            const responce=await fetch('http://localhost:3000/getitem',{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({id:userdata.cart_items[i].itemId})
            })
              const res=await responce.json()
              items.push(res.data)
              if(items.length===userdata.cart_items.length){
                setitemdata(items)
                setloading(false)
              }
          }
          setloading(false)
        }
        fetchdata2()
      }
  },[userdata])
  useEffect(()=>{
    const fetch3=async()=>{
      const responce=await fetch('http://localhost:3000/removeCart',{
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization':token.token
      },
      body:JSON.stringify({id:success.itemid})
    })
    const res= await responce.json()
  }
  if(success.state){fetch3()}
  },[success])
  function arrayBufferToImage(buffer) {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  if(!token){
    return <div className="cartpage"><div className="msg">Please Login to view cart items</div></div>
  }
  console.log(loading)
  if (token && loading) {
    return <div className='cartpage'><div className="loading">
      ...<ion-icon className='loading' name="cart-outline"></ion-icon></div></div>
  }
  if(token && itemdata.length===0 && !loading){
    return <div className="cartpage"><div className="msg"><pre>            No cart items</pre></div></div>
  }
  if(token && itemdata.length>0){
    return (
    <div className='cartpage'>
      {
      pop && <div className="popmsg">Item Placed successfully!</div>
    }
    {loading2 && <div className="log-loading">
      <div className="load">
      ...<ion-icon className='logloading' name="cart-outline"></ion-icon></div>
    </div>
    }
        {
          (itemdata.length>=0)&&(itemdata.map((item,index)=>{
            console.log(userdata._id)
            return (
              <div className="cart-card" key={index} >
                <img src={arrayBufferToImage(item.itemData.image[0].data)} alt="" />
                <div className="cart-data">
                <h3>{item.itemData.item_name}</h3>
                <h3>₹{item.itemData.cost}</h3>
                <h3>Deliver's in {item.itemData.delivery_time} min</h3>
                <h3>Type:{item.itemData.type}</h3>
                <h3>Quantity:{userdata.cart_items[index].qty}</h3>
                </div>
                <button className='place' onClick={async()=>{
                  setloading2(true)
                    const responce=await fetch('http://localhost:3000/placeOrder',
                    {method:"PUT",
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': token.token
                    }
                    ,body:JSON.stringify({adminId:item.adminId,userdata:userdata.cart_items[index],userId:userdata._id})}
                    )
                    const res=await responce.json()
                    console.log(res)
                    if(res){
                      if(res.success){
                        setloading2(false)
                        setpop(true)
                        setTimeout(() => {
                          setpop(false)
                        }, 2000);
                      }
                      (res.success)&&setSuccess({state:true,itemid:userdata.cart_items[index].itemId})
                    }
                }}>Place Order</button>
              </div>
            )
          }))
        }
    </div>
  )}
}

export default Cart