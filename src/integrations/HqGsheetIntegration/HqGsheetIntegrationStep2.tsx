import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  HQ_FIELDS,
  useHqGsheetIntegrationContext,
} from "./HqGsheetIntegrationContext";
import { StepHeader } from "../../components";

const HqGsheetIntegrationStep2 = () => {
  const {
    isAuthenticated,
    trigger,
    hqFieldsInput,
    handleBackButtonClick,
    handleImportButtonClick,
  } = useHqGsheetIntegrationContext();
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  return isAuthenticated && trigger ? (
    <>
      <StepHeader
        title="Google Sheets Preview"
        subtitle={`Select the rows you would like to import (${selected.length}/${rows.length} rows selected)`}
      />
      <Box
        sx={{
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <TableContainer sx={{ maxHeight: "450px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      "aria-label": "select all",
                    }}
                  />
                </TableCell>
                {HQ_FIELDS.map((hqField: any) => (
                  <TableCell key={hqField.key}>{hqField.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: string) => (
                <TableRow
                  key={row}
                  onClick={() => {
                    if (selected.includes(row)) {
                      setSelected(selected.filter((r) => r !== row));
                    } else {
                      setSelected([...selected, row]);
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selected.includes(row)}
                    />
                  </TableCell>
                  {HQ_FIELDS.map((hqField: any) => (
                    <TableCell key={hqField.key + row}>
                      {trigger?.operation?.sample?.[hqFieldsInput[hqField.key]]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap="30px"
        sx={{ padding: "32px" }}
      >
        <Button
          variant="contained"
          onClick={handleBackButtonClick}
          color="secondary"
        >
          Back
        </Button>
        <Button variant="contained" fullWidth onClick={handleImportButtonClick}>
          Import
        </Button>
      </Stack>
    </>
  ) : null;
};

export default HqGsheetIntegrationStep2;
