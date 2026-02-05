const Card = ({ username, email, password, description, idx, deleteHandler }) => {
  return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">User Card</h2>
        
        <div className="space-y-4">
          {/* Username */}
          <div>
            <p className="text-sm font-medium text-gray-600">Username</p>
            <p className="text-lg text-gray-800">{username}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-lg text-gray-800">{email}</p>
          </div>

          {/* Password */}
          <div>
            <p className="text-sm font-medium text-gray-600">Password</p>
            <p className="text-lg text-gray-800">{password}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium text-gray-600">Description</p>
            <p className="text-lg text-gray-800">{description}</p>
          </div>
        </div>
        <button 
          onClick={() => deleteHandler(idx)}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Remove
        </button>
      </div>
   
  )
}

export default Card
