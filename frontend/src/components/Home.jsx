import React from 'react'
import { useState,useEffect } from 'react'
import { usecontext } from '../context/store'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

export const Home = () => {
  const [items,setItems]=useState([])
  const {setItemdata,setCat}=usecontext()
  const categories=["Biriyani","Breakfasts","Rice","curries","Snacks","street Foods","cool drinks","fruits","fruit Juices","Sweets","Beverages"]
  const [filcat,setfilcat]=useState([])
  const [success,setSuccess]=useState(true)
  const navigate=useNavigate()
  useEffect(()=>{
    console.log('..')
    const fetchdata=async()=>{
      try {
        const responce=await fetch('http://localhost:3000/getproduct',{method:'GET'})
        const res=await responce.json()
        setSuccess(!res.success)
        let tempItems = [];
        for (let i = 0; i < res.data.length; i++) {
          tempItems=tempItems.concat(res.data[i].items);
        }
        setItems(tempItems)
        const filteredCat = categories.filter(cat => {
          return tempItems.some(item => item.category === cat);
        });
        setfilcat(filteredCat)
        setCat(filteredCat)
      } catch (error) {
        console.log(error)
      }
    }
    fetchdata()
  },[])
  useEffect(()=>{},[success])
  function arrayBufferToImage(buffer) {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  const links=['https://img.freepik.com/free-photo/gourmet-chicken-biryani-with-steamed-basmati-rice-generated-by-ai_188544-13480.jpg?t=st=1705593452~exp=1705597052~hmac=07b2cc059c2e29badbb12dd709b2dec61e5c4d5cd45f98578e6b798ffdc2f274&w=1060',
              'https://img.freepik.com/free-photo/healthy-rice-bowl-with-fresh-veggies-herbs-generated-by-ai_188544-25989.jpg?t=st=1705594555~exp=1705598155~hmac=1907fcd91fa1f21cbca54d357e1eeb0d262ab76c06031c34ad06116f721ead12&w=1060',
              'https://img.freepik.com/free-photo/freshly-baked-croissants-coffee-table-generated-by-ai_24640-81610.jpg?t=st=1705594727~exp=1705598327~hmac=07d97ed731be04184ee7cd30126303fd49694449194aadf7b13f5978412fc25c&w=1060',
            'https://img.freepik.com/free-photo/cold-coffee-with-ice-cream_1220-4092.jpg?w=996&t=st=1705596493~exp=1705597093~hmac=be8018e279aec006c74049c3e224ca9a4c9eb4d4bb496fcfd4208e51c4a2c442',
          'https://img.freepik.com/free-photo/samsa-samosas-with-meat_658428-360.jpg?w=996&t=st=1705596766~exp=1705597366~hmac=c7ec83bd2e6f7519c2b4650ca5502bb1380bf18dec08bf8edc5e3482995e80ae',
        'https://img.freepik.com/free-photo/front-view-delicious-meat-cheeseburgers-with-tomatoes-french-fries-dark_140725-153834.jpg?w=996&t=st=1705596833~exp=1705597433~hmac=124631bfca791cbd201e3134225dc3e88070b42f1b4a28ea8cdae9c7949215c1']
  const [class1,setclass1]=useState(['r2','r1','m','l1','l2'])
  const data=[[0,1,2,3,4],[1,2,3,4,0],[2,3,4,0,1],[3,4,0,1,2],[4,0,1,2,3]]
  const styles=[0,140,470,780,950]
  const [i,seti]=useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      seti(prevI => (prevI + 1 === 5 ? 0 : prevI + 1));
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className='homepage'>
      <Outlet/>
      <h3>It All Starts Here,</h3>
      <div className="slider" style={{ position: 'relative', height: '400px' }}>
        <img className={class1[data[i][0]]} src={links[0]} alt="" style={{left:styles[data[0][i]]+'px'}}/>
        <img src={links[1]} alt="" className={class1[data[i][1]]} style={{left:styles[data[1][i]]+'px'}}/>
        <img src={links[2]} alt="" className={class1[data[i][2]]} style={{left:styles[data[2][i]]+'px'}}/>
        <img src={links[3]} alt="" className={class1[data[i][3]]} style={{left:styles[data[3][i]]+'px'}}/>
        <img src={links[4]} alt="" className={class1[data[i][4]]} style={{left:styles[data[4][i]]+'px'}}/>
      </div>
      {success&&<div className='yorderpage'><div className="loading">
    ...<ion-icon className='loading' name="cart-outline"></ion-icon></div></div>}
      <div className="items">
        {filcat.map(cat => (
          <div key={cat} id={cat} className='row'>
            <h2>{cat+'>'}</h2>
            {items.map(item => {
              if (item.category === cat) {
                return (
                  <div key={item._id} className="item-card" onClick={()=>{
                    const data={...item,imageurl:arrayBufferToImage(item.image[0].data)}
                    setItemdata(data)
                    navigate('/itemdetails')}}>
                    <h2>{item.item_name}</h2>
                    <div className="cover"></div>
                    <img className='card-img'src={arrayBufferToImage(item.image[0].data)} />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        ))}
  </div>
    </div>
  )
}
