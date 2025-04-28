
import { useEffect,useState } from "react";
function App() {
  const [backendData,setBackendData]=useState({});

  useEffect(()=>{

    // fetch("/api").then(
    //   res=>res.json()
    // ).then(data=>{
    //   setBackendData(data);
    // }).catch(e=>console.log("error while calling api"))

    const fetchData=async ()=>{
      try{
        const postData = {
          key1: 'value1 send',
          key2: 'value2 send',
        };

        const response=await fetch("http://localhost:5000/",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(postData)
        });
        
        const data=await response.json();
        console.log(data,"data from backend")
        setBackendData(data);
      }catch(error){
        console.log("error in useEffect ");
      }
    };
    fetchData();
  },[])

  return (
    <>
    app.js <br/>
    {backendData.users ? backendData.users[0]:"loading ..."}
    </>
  );
}

export default App;
