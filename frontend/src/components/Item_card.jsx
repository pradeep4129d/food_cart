import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usecontext } from '../context/store'

const Item_card = (props) => {
  const navigate=useNavigate()
  const token=JSON.parse(localStorage.getItem('token'))
  const {loginState}=usecontext()
  const [loading,setloading]=useState(false)
  const [cartitem,setcartitem]=useState({})
  const [Qty,setqty]=useState('1')
  const [pop,setpop]=useState(false)
  console.log(loading)
  return (
    <>
    <div className="view-container">
    {loading && <div className="log-loading">
      <div className="load">
      ...<ion-icon className='logloading' name="cart-outline"></ion-icon></div>
    </div>
    }
    {
      pop && <div className="popmsg">Item added successfully !</div>
    }
      <div className='view-card'>
        <img src={props.data.imageurl} alt="" />
        <div className="data">
          <h3>{props.data.item_name}</h3>
          <h3>₹{props.data.cost}</h3>
          <h3>Deliver's in {props.data.delivery_time} min</h3>
          <h3>Type:{props.data.type}</h3>
          <label htmlFor="qty"><h3>select quantity</h3></label>
          <select name="qty" id="" onChange={(e)=>{
            setqty(e.target.value)
          }}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <button className='cart-btn' onClick={()=>{
          setloading(true)
          if(token){
            const item={itemId:props.data._id,qty:Qty}
            if(!token.admin)
            {
              const fetchdata=async()=>{
                  const responce =await fetch('http://localhost:3000/addTocart',{
                    method:'PUT',
                    headers :{'authorization':token.token,'Content-Type':'application/json'},
                    body:JSON.stringify(item)
                  })
                  const res=await responce.json()
                  if(res){
                    if(res.success){
                      setloading(false)
                      setpop(true)
                      setTimeout(() => {
                        setpop(false)
                      }, 2000);
                    }
                  }
                  console.log(res)
                }
              fetchdata()
            }
          }
          else{
            setloading(false)
            alert('please login to add item')
          }
        }}>Add to Cart</button>
        <div className="x" onClick={()=>{navigate('/')}}>X</div>
      </div>
    </div>
    </>
  )
}

export default Item_card