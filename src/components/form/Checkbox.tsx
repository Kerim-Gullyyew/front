import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  isChecked: boolean;
  onCheckboxChange: (label: string) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, isChecked, onCheckboxChange }) => {
  return (
    <label className="inline-flex items-center mt-3">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={() => onCheckboxChange(label)}
        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <span className="ml-2 text-gray-700">{label}</span>
    </label>

  );
};
export default Checkbox;