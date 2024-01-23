import React from 'react'

interface RadioProps {
  value: string;
  checked: boolean;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Radio: React.FC<RadioProps> = ({ value, name,  checked, onChange }) => {
  return (
    <label className="inline-flex items-center mt-3">
    <input
      type="radio"
      name={name}
      className="form-radio h-5 w-5 text-blue-600"
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <span className="ml-2 text-gray-700">{value}</span>
  </label>
  )
}

export default Radio