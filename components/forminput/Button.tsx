interface ButtonProps {
  type: "button" | "submit" | "reset";
  isDisabled: boolean;
  children: React.ReactNode;
}

export default function Button({
  type = "button",
  isDisabled,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "w-full py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition duration-300 flex items-center justify-center",
        isDisabled &&
          "disabled:border-gray-200 disabled:bg-gray-500 disabled:text-gray-100 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-300 dark:disabled:text-gray-600",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
