import React from 'react'
import './Dashboard.css'
import { useState } from 'react'
import { usecontext } from '../context/store'
import { useNavigate } from 'react-router-dom'

export const Add_item = () => {
  const [pop,setpop]=useState(false)
  const formdata=new FormData;
  const [loading,setloading]=useState(false)
  const navigate=useNavigate()
  const [item_details,setItem_details]=useState({item_name:'',category:'Biriyani',cost:'',image:[],type:'veg',availability:'not available',delivery_time:''})
  const {close,setclose}=usecontext()
  const categories=["Biriyani's","Breakfasts","Rice","curries","Snacks","street Foods","cool drinks","fruits","fruit Juices","Sweets","Beverages"]
  console.log(item_details)
  for (let i = 0; i < item_details.image.length; i++) {
    formdata.append(`image${i}`, item_details.image[i]);
  }
  formdata.append('details',JSON.stringify(item_details))
  console.log(formdata)
  const handleSubmit = async () => {
    setloading(true)
    try {
      const token=JSON.parse(localStorage.getItem("token"))
      console.log(token.token)
      const response = await fetch('http://localhost:3000/add', {
        method: 'PUT',
        headers:{'authorization':token.token},
        body:formdata
      });
      const res=await response.json()
      console.log(res)
      if(res){
        setloading(false)
        setpop(true)
        setTimeout(() => {
          setpop(false)
        }, 2000);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };
  return (
    <div className={'add-container '+close}>
      {loading && <div className="log-loading">
      <div className="load">
      ...<ion-icon className='logloading' name="cart-outline"></ion-icon></div>
    </div>
    }
    {
      pop && <div className="popmsg">Item added successfully!</div>
    }
      <div className="close" onClick={()=>{setclose('yes')}}>X</div>
      <form onSubmit={(e)=>{
          e.preventDefault()
          handleSubmit()}}>
        <input type='text' className='add-1' name='item_name' id='text-in' placeholder='Item name' required onChange={(event)=>{setItem_details({...item_details,item_name:event.target.value})}}/>
        <input type="number" id='cost-in' className='add-1' name="cost" placeholder='Enter cost' required min='0' onChange={(event)=>{setItem_details({...item_details,cost:event.target.value})}} />
        <input type="number" id='time-in' className='add-1' name='time'placeholder='Delivery time' onChange={(event)=>{setItem_details({...item_details,delivery_time:event.target.value})}}/>
        <label htmlFor="time" id='time-label' className='addlabel'>min</label>
        <label htmlFor="category" id='cat-label' className='addlabel'>Select category:</label>
        <select name='category'id="category" onChange={(event)=>{setItem_details({...item_details,category:event.target.value})}} required>
            {
              categories.map(item=> (
                <option value={item}>{item}</option>
              ))
            }
        </select>
        <label htmlFor="type" id='select-label'>Select type:</label>
        <select name="type" id="type" required onChange={(event)=>{setItem_details({...item_details,type:event.target.value})}}>
          <option value="veg">veg</option>
          <option value="nonveg">non-veg</option>
        </select>
        <label htmlFor="availability" id='ava-label'  className='addlabel'>Availabile</label>
        <input type="checkbox" className='additem' name="availability" id="ava" value='available' onChange={(event)=>{setItem_details({...item_details,availability:event.target.value})}}/>
        <div className="upload"><label htmlFor="image" id='img-label' className='addlabel'>Upload images</label>
        <input type="file" className='additem' multiple={false} typeof='svg,png' onChange={(event)=>{setItem_details({...item_details,image:event.target.files})}}/>
        <button type='submit'id='add-sub' >Submit</button>
        </div>
      </form>
    </div>
  )
}
