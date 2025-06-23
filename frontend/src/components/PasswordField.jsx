import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
          onClick={() => setShow(!show)}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
    </div>
  );
};

export default PasswordField;
