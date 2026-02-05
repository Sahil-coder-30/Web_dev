import React from 'react'
import axios from 'axios'
const App = () => {
  async function getdata(){
    const res =await axios.get("https://picsum.photos/v2/list?page=2&limit=100");
    console.log(res.data);
    
  }
  return (
    <>
    <div>
      <button onClick={getdata}>
        Click Here
      </button>
    </div>
    </>
  )
}

export default App
