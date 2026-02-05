import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./components/Card";
import { API_BASE_URL } from "./config";

const App = () => {
  const [Data, setData] = useState([]);
  const [Name, setName] = useState("");
  const [Age, setAge] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Children, setChildren] = useState("");
  const [Hobbies, setHobbies] = useState([]);
  const [MaritalStatus, setMaritalStatus] = useState("");
  const [Occupation, setOccupation] = useState("");
  const [Salary, setSalary] = useState("");
  const [Education, setEducation] = useState("");

  const SubmitHandeler = (e) => {
    e.preventDefault();
  };

  const valueReset =async () => {
    await CreateNewCard();
    GetData();

    setName("");
    setEmail("");
    setEducation("");
    setPhone("");
    setAddress("");
    setSalary("");
    setChildren("");
    setMaritalStatus("");
    setOccupation("");
    setHobbies([]);
    setAge("");
    // console.log(NewData);
  };

  const GetData = async () => {
    const data = await axios.get(`${API_BASE_URL}/data`);
    setData(data.data.data);
    console.log(Data);
    
  };

  const CreateNewCard = async () => {
    await axios
      .post(`${API_BASE_URL}/data`, {
        Name: Name,
        Age: Age,
        Email: Email,
        Phone: Phone,
        Address: Address,
        Occupation: Occupation,
        Salary: Salary,
        MaritalStatus: MaritalStatus,
        Children: Children,
        Hobbies: Hobbies,
        Education: Education
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  const DeleteAnCard = async (CardId)=>{
    await axios.delete(`${API_BASE_URL}/data` + CardId)
    .then(res =>{
      console.log(res.data);
      GetData();
      
    })
  }

  const UpdataCardName = async (CardId,UpdatedName ) =>{
    console.log(Name);
    await axios.patch(`${API_BASE_URL}/data` + CardId , {Name:UpdatedName})
    .then(res => {
      console.log(res);
      GetData();
    })
  }

  useEffect(() => {
    GetData();
  },[]);

  useEffect(()=>{
    console.log(Data);
    
  },[Data])
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Form Section */}
      <div className="w-full bg-white shadow-2xl">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Add New Profile
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to create a new profile
          </p>

          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            onSubmit={SubmitHandeler}
          >
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                name="Name"
                type="text"
                placeholder="Sahil Sharma"
                value={Name}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Occupation
              </label>
              <input
                onChange={(e) => {
                  setOccupation(e.target.value);
                }}
                name="Occupation"
                type="text"
                placeholder="Software Developer"
                value={Occupation}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Marital Status
              </label>
              <input
                onChange={(e) => {
                  setMaritalStatus(e.target.value);
                }}
                name="MaritalStatus"
                type="text"
                placeholder="Single"
                value={MaritalStatus}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Age
              </label>
              <input
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                name="Age"
                type="number"
                placeholder="20"
                value={Age}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                name="Email"
                type="email"
                placeholder="sahilsharma3043@gmail.com"
                value={Email}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                name="Phone"
                type="number"
                placeholder="123456789"
                value={Phone}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                name="Address"
                type="text"
                placeholder="15/13 noida up.."
                value={Address}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Education
              </label>
              <input
                onChange={(e) => {
                  setEducation(e.target.value);
                }}
                name="Education"
                type="text"
                placeholder="Graduate"
                value={Education}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Salary
              </label>
              <input
                onChange={(e) => {
                  setSalary(e.target.value);
                }}
                name="Salary"
                type="number"
                placeholder="50000"
                value={Salary}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Children
              </label>
              <input
                onChange={(e) => {
                  setChildren(e.target.value);
                }}
                name="Children"
                type="number"
                placeholder="2"
                value={Children}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Hobbies
              </label>
              <input
                onChange={(e) => {
                  setHobbies(e.target.value.split(","));
                }}
                name="Hobbies"
                type="text"
                placeholder="Gaming,Reading,coding"
                value={Hobbies}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              onClick={() => {
                valueReset();
              }}
              className="lg:col-span-3 mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">All Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Data.map((res, idx) => {
            return (
              <div key={idx}>
                <Card res={res} DeleteAnCard = {DeleteAnCard} UpdataCardName={UpdataCardName} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
