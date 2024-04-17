import { useContext,createContext,useState } from "react";
const Contextprovider=createContext();
const Context=({children})=>{
    const[exit,setexit]=useState('t');
    const [user,setuser]=useState(null)
    const [state,setstate]=useState('login')
    const [close,setColse]=useState('')
    const [loginState,setloginState]=useState('')
    const [itemdata,setitemdata]=useState({})
    const [cat,setcat]=useState([])
    const [classname,setClassname]=useState('')
    const [orders,setorders]=useState([])
    const [orderinfo,setorderinfo]=useState({})
    const setOrderinfo=(data)=>{
        setorderinfo(data)
    }
    const setOrders=(data)=>{
        setorders(data)
    }
    const setclassname=(data)=>{
        setClassname(data)
    }
    const setclose=(data)=>{
        setColse(data)
    }
    const setUser=(data)=>{
        setuser(data)
    }
    const setExit=(data)=>{
        setexit(data)
    }
    const setState=(data)=>{
        setstate(data)
    }
    const setLoginState=(data)=>{
        setloginState(data)
    }
    const setCat=(data)=>{
        setcat(data)
    }
    const setItemdata=(data)=>{
        setitemdata(data)
    }
    return(
        <Contextprovider.Provider value={{exit,setExit,user,setUser,state,setState,close,setclose,loginState,setLoginState,cat,setCat,setItemdata,itemdata,classname,setclassname,orders,setOrders,orderinfo,setOrderinfo}}>
            {children}
        </Contextprovider.Provider>
    )
}
export const usecontext=()=>{
    return useContext(Contextprovider)
}
export default Context;