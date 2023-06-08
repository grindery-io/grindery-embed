import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CustomLabel from "../CustomLabel/CustomLabel";

export type CustomSelectOption = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  value: string;
  options: CustomSelectOption[];
  placeholder?: string;
  onChange: (event: SelectChangeEvent) => void;
};

const CustomSelect = (props: Props) => {
  const { name, label, value, placeholder, options, onChange } = props;
  return (
    <Box>
      <CustomLabel id={`${name}-label`}>{label}</CustomLabel>
      <FormControl fullWidth>
        <Select
          labelId={`${name}-label`}
          id={`${name}-select`}
          value={value}
          label=""
          onChange={onChange}
        >
          {placeholder && <MenuItem value={""}>{placeholder}</MenuItem>}

          {options.map((option: CustomSelectOption) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CustomSelect;
