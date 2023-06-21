import React, { useState } from "react";
import GrinderyClient from "grindery-nexus-client";
import { useWorkflowContext } from "./WorkflowContext";
import { Box, Button, Snackbar, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { selectUserStore } from "../store/slices/userSlice";
import {
  configStoreActions,
  selecConfigStore,
} from "../store/slices/configSlice";

type Props = {};

const WorkflowSave = (props: Props) => {
  const dispatch = useAppDispatch();
  const { workflow, saveWorkflow, workflowReadyToSave } = useWorkflowContext();
  const { accessToken } = useAppSelector(selectUserStore);
  const { workflowKey: key } = useAppSelector(selecConfigStore);
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
      wf.signature = JSON.stringify(wf);
      if (wf.state === "on" && workflowReadyToSave) {
        wf.state = "on";
      } else {
        wf.state = "off";
      }
      const client = new GrinderyClient(accessToken);
      try {
        await client.workflow.update({ key: wf.key, workflow: wf });
        dispatch(configStoreActions.setWorkflowKey(""));
        dispatch(configStoreActions.setCreate(false));
      } catch (error) {
        console.error("workflow update error", error);
      }
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
            dispatch(configStoreActions.setCreate(false));
            dispatch(configStoreActions.setWorkflowKey(""));
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
          Save Integration
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
