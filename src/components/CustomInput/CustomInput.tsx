import { Box, FormControl, OutlinedInput } from "@mui/material";
import CustomLabel from "../CustomLabel/CustomLabel";

type Props = {
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput = (props: Props) => {
  const { name, label, value, placeholder, onChange } = props;
  return (
    <Box>
      <CustomLabel id={`${name}-label`}>{label}</CustomLabel>
      <FormControl fullWidth>
        <OutlinedInput
          id={`${name}-input`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </FormControl>
    </Box>
  );
};

export default CustomInput;
