import type { ChangeEvent } from 'react'

interface InputProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (
    event: ChangeEvent<HTMLInputElement>
  ) => void
}

function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Input