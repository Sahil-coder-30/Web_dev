import React, { useState } from "react";
import Card from "./components/Card.jsx";

const App = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [discription, setdiscription] = useState("");
  const localData = JSON.parse(localStorage.getItem("All-Users")) || [];

  const [Allusers, setAllusers] = useState(localData);


  const submitHandler = (e) => {
    const oldusers = [...Allusers];
    oldusers.push({
      username,
      email,
      password,
      discription,
    });
    localStorage.setItem("All-Users", JSON.stringify(oldusers));
    setAllusers(oldusers);

    setusername("");
    setdiscription("");
    setemail("");
    setpassword("");
    e.preventDefault();
  };


  const deletehandler = (idx) => {

    let copyarray = [...Allusers];
    copyarray.splice(idx, 1);
    localStorage.setItem("All-Users", JSON.stringify(copyarray));
    setAllusers(copyarray);
  };

  return (
    <>
      <div className="bg-black w-full h-full text-2xl flex justify-center items-center flex-col ">

        <div className="w-full h-[50%] flex justify-center items-center ">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="flex flex-col w-full h-[20vw] items-center justify-center p-4 gap-3.5"
          >
            <div className="flex w-full justify-center items-center flex-wrap gap-4 ">
              <input
                type="text"
                className="text-white text-2xl p-2 border w-[45%] border-white "
                placeholder="Sahil Sharma"
                value={username}
                onChange={(e) => {
                  setusername(e.target.value);
                }}
              />
              <input
                type="password"
                className="text-white text-2xl p-2 border w-[45%] border-white "
                placeholder="passowrd"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                  
                }}
              />
              <input
                type="email"
                className="text-white text-2xl p-2 border w-[45%] border-white "
                placeholder="sahilsharma3043@gmail.com"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                  
                }}
              />
              <input
                type="text"
                className="text-white text-2xl p-2 border w-[45%] border-white "
                placeholder="hi there my name is sahil sharma . "
                value={discription}
                onChange={(e) => {
                  setdiscription(e.target.value);
                  
                }}
              />
            </div>

            <button className="py-2 px-8 w-fit cursor-pointer active:scale-75 bg-green-300 border border-white rounded-2xl text-black text-2xl">
              submit
            </button>
          </form>
        </div>

        <div className="w-full h-fit p-4 text-4xl text-white flex flex-wrap overflow-auto gap-3 justify-center items-center">
          {Allusers.map((e, idx) => {
            return (
              <div key={idx} className="text-white ">
                <Card
                  username={e.username}
                  email={e.email}
                  password={e.password}
                  description={e.discription}
                  idx={idx}
                  deleteHandler={deletehandler}
                />
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
};

export default App;
