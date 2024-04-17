import { Home } from './components/Home'
import Cart from './components/Cart'
import { Yourorder } from './components/Yourorder'
import { Categories } from './components/Categories'
import { Route,Routes } from 'react-router-dom'
import DashBoard from './components/DashBoard'
import Orders from './components/Orders'
import { Add_item } from './components/Add_item'
import { usecontext } from './context/store'
import Profile from './components/Profile'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Item_card from './components/Item_card'
import { Link } from 'react-router-dom'
import OrderInfo from './components/OrderInfo'

function App() {
  const {loginState,setExit,setLoginState,itemdata,orders,orderinfo}=usecontext();
  const navigate=useNavigate()
  useEffect(()=>{
    const token = JSON.parse(localStorage.getItem('token'));
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (token&&tokenExpiry){
      const now = new Date().getTime();
      if (now > parseInt(tokenExpiry)) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          navigate('/')
      } else {
        (token.admin)?navigate('/dashboard'):navigate('/')
        setExit('t')
      }
  }
  else
  navigate('/')
},[loginState])
const categories=["Biriyani","Breakfasts","Rice","curries","Snacks","street Foods","cool drinks","fruits","fruit Juices","Sweets","Beverages"]
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route path='/itemdetails' element={<Item_card data={itemdata}/>}/>
        </Route>
        <Route path='/Cart' element={<Cart/>}/>
        <Route path='/Categories' element={<Categories/>}/>
        <Route path='/Yourorder' element={<Yourorder/>}/>
        <Route path="/profile" element={<Profile/>}/>
          <Route path='/dashboard' element={<DashBoard/>}>
            <Route path='/dashboard/orders' element={<Orders data={orders}/>}>
              <Route path='/dashboard/orders/orderinfo' element={<OrderInfo data={orderinfo}/>}/>
            </Route>
            <Route path='/dashboard/add' element={<Add_item/>}/>
          </Route>
      </Routes>
    </>
  )
}
export default App
