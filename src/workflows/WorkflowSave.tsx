import React, { useState } from "react";
import { useParams } from "react-router";
import { useWorkflowContext } from "./WorkflowContext";
import { Box, Button, Snackbar, Stack } from "@mui/material";
import { useAppDispatch } from "../store";
import { userStoreActions } from "../store/slices/userSlice";

type Props = {};

const WorkflowSave = (props: Props) => {
  const dispatch = useAppDispatch();
  const { workflow, saveWorkflow, workflowReadyToSave, updateWorkflow } =
    useWorkflowContext();
  const editWorkflow = (a: any, b: any, c: any) => {};
  const { key } = useParams();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    opened: false,
    message: "",
    severity: "suscess",
  });

  const handleClick = async () => {
    if (key) {
      setLoading(true);
      const wf = { ...workflow };
      delete wf.signature;
      delete wf.system;

      editWorkflow(
        {
          ...wf,
          state: wf.state === "on" && workflowReadyToSave ? "on" : "off",
          signature: JSON.stringify(wf),
        },
        false,
        () => {
          setSnackbar({
            opened: true,
            message: "Workflow updated",
            severity: "success",
          });
          setLoading(false);
        }
      );
      updateWorkflow({
        state: wf.state === "on" && workflowReadyToSave ? "on" : "off",
      });
    } else {
      saveWorkflow();
    }
  };

  return (
    <>
      <Box height={16} />
      <Stack direction="row" alignItems="center" gap="16px">
        <Button
          sx={{
            margin: 0,
            background: "white",
            color: "black",
            cursor: "pointer",
            border: "1px solid black",
            "&:hover": {
              background: "white",
              color: "black",
            },
          }}
          color="secondary"
          onClick={() => {
            dispatch(userStoreActions.setCreate(false));
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{
            margin: 0,
            background: "black",
            color: "white",
            cursor: "pointer",
            border: "1px solid black",
            "&:hover": {
              background: "black",
              color: "white",
            },
            "&.Mui-disabled": {
              color: "white",
              opacity: "0.5",
              cursor: "not-allowed",
            },
          }}
          color="primary"
          disabled={!workflowReadyToSave || loading}
          onClick={handleClick}
        >
          Save workflow
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.opened}
        onClose={() => {
          setSnackbar({
            opened: false,
            message: "",
            severity: snackbar.severity,
          });
        }}
        message={snackbar.message}
        autoHideDuration={2000}
        //severity={snackbar.severity}
      />
    </>
  );
};

export default WorkflowSave;
