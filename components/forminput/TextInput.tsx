"use client";

interface TextInputProps {
  name: string;
  label: string;
  type: string;
  error: boolean;
  touched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  helperText?: string;
  value: string;
}

export default function TextInput({
  name,
  label,
  type = "text",
  error,
  touched,
  onChange,
  onBlur,
  autoComplete,
  helperText,
  value,
}: TextInputProps) {
  return (
    <>
      <input
        type={type}
        name={name}
        placeholder={label}
        className={[
          "w-full px-4 py-3 rounded-lg border text-sm bg-gray-100 transition dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2",
          error && touched
            ? "border-red-500 ring-2 ring-red-500 focus:ring-red-500"
            : "focus:ring-cyan-400",
        ].join(" ")}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={!!(error && touched)}
      />

      {error && touched && (
        <label className="text-sm text-red-500">{helperText}</label>
      )}
    </>
  );
}
