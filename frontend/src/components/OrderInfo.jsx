import React from 'react'
import { useNavigate } from 'react-router-dom'

const OrderInfo = (props) => {
  const navigate=useNavigate()
  return (
    <div className='orderinfo'>
      <div className="exit" onClick={()=>{navigate('/dashboard/orders')}}>x</div>
      <div className="orderdata">
        <div>Username :{props.data.username}</div>
        <div>Mobile :{props.data.mobile}</div>
        <div>Delivery Address :<br></br>{props.data.address}</div>
      </div>
      </div>
  )
}

export default OrderInfo