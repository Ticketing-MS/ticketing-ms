const labelOptions = [
  { value: "backlog", label: "Backlog", color: "#9CA3AF" },
  { value: "review", label: "Review", color: "#8B5CF6" },
  { value: "wip", label: "Work In Progress", color: "#3B82F6" },
];

const customStyles = {
  multiValue: (styles: any, { data }: any) => ({
    ...styles,
    backgroundColor: data.color,
    color: "white",
  }),
  multiValueLabel: (styles: any) => ({
    ...styles,
    color: "white",
    fontWeight: 500,
  }),
  option: (styles: any, { data, isFocused }: any) => ({
    ...styles,
    backgroundColor: isFocused ? "#F3F4F6" : "white",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 500,
  }),
};

export { labelOptions, customStyles };
