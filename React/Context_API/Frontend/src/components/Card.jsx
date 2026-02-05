import React, { useState } from "react";

const Card = (props) => {
  const [NewName, setNewName] = useState('')
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-xs border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
      {/* Header Section with Accent */}
      <div className="relative bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-4 border-b-2 border-blue-200">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-100 rounded-full opacity-30"></div>
        <div className="relative z-10 flex  justify-between ">
          <div className="right_div">
            <h2 className="text-base font-bold text-gray-900">
              {props.res.Name}
            </h2>
            <p className="text-sm text-blue-700 font-semibold mt-1">
              {props.res.Occupation}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {props.res.MaritalStatus}
              </span>
              <span className="text-xs text-gray-600 font-medium">
                🎂 {props.res.Age} years
              </span>
            </div>
          </div>
          <div className="left_div ">
            <button className="bg-red-500 text-white text-sm px-3 py-1 border border-white rounded-3xl active:scale-90 hover:bg-red-600 hover:text-white  " onClick={()=>{
                props.DeleteAnCard(props.res._id)
            }} >Delete</button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-4 space-y-4">
        {/* Contact Section with Icons */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-blue-500 rounded"></div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Contact
            </p>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 group p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="text-blue-600 text-lg">✉</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-semibold">Email</p>
                <p className="text-xs text-gray-800 truncate group-hover:text-blue-700">
                  {props.res.Email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 group p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="text-blue-600 text-lg">📱</span>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold">Phone</p>
                <p className="text-xs text-gray-800 group-hover:text-blue-700">
                  {props.res.Phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 group p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="text-blue-600 text-lg mt-0.5">📍</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-semibold">Address</p>
                <p className="text-xs text-gray-800 truncate group-hover:text-blue-700">
                  {props.res.Address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-emerald-500 rounded"></div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Professional
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 group hover:shadow-md transition-shadow">
              <p className="text-xs text-emerald-700 font-bold">Education</p>
              <p className="text-xs text-gray-800 font-semibold mt-1 line-clamp-2 group-hover:text-emerald-900">
                {props.res.Education}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 group hover:shadow-md transition-shadow">
              <p className="text-xs text-amber-700 font-bold">Salary</p>
              <p className="text-xs text-gray-800 font-semibold mt-1 group-hover:text-amber-900">
                ₹{props.res.Salary?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-pink-500 rounded"></div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Personal Info
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-50 p-3 rounded-lg border border-pink-200 text-center group hover:shadow-md transition-shadow">
              <p className="text-2xl font-bold text-pink-600 group-hover:text-pink-700">
                {props.res.Age}
              </p>
              <p className="text-xs text-pink-700 font-bold mt-1">Years Old</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center group hover:shadow-md transition-shadow">
              <p className="text-2xl font-bold text-purple-600 group-hover:text-purple-700">
                {props.res.Children}
              </p>
              <p className="text-xs text-purple-700 font-bold mt-1">Children</p>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Interests
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {props.res.Hobbies &&
              props.res.Hobbies.slice(0, 3).map((hobby, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-300 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {hobby}
                </span>
              ))}
          </div>
        </div>
      </div>
      {/* Updata Name */}
      <div className="" >
              <form className="" onSubmit={(e)=>{
                props.UpdataCardName(props.res._id,NewName)
                setNewName('');
                e.preventDefault();
              }}>
                <label >
                  Update Name
                </label>
                <input type="text" name="Name" className="border border-black" value={NewName} onChange={(e)=>{
                  setNewName(e.target.value)
                }} />
                <button>Submit</button>
              </form>
      </div>
    </div>
  );
};

export default Card;
