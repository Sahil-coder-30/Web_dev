import React from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, incrementByAmount } from "./redux/features/counterSlice";
const App = () => {
  const dispatch = useDispatch();
  const count = useSelector((state)=>state.counter.value);
  return (
    <div className="alpha">
      <h1>{count}</h1>
      <div>
        <button onClick={()=>{
          dispatch(increment())
        }}> Increment </button>
        <button onClick={()=>{
          dispatch(decrement())
        }}> Decrement </button>
        <button onClick={()=>{
          dispatch(incrementByAmount(50))
        }}> Increment by amount </button>
      </div>
    </div>
  );
};

export default App;
