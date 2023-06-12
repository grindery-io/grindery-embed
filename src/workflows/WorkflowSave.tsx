import React, { useState } from "react";
import { useParams } from "react-router";
import { useWorkflowContext } from "./WorkflowContext";
import { Button, Snackbar } from "@mui/material";

type Props = {};

const WorkflowSave = (props: Props) => {
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
      <Button color="primary" disabled={loading} onClick={handleClick}>
        Save workflow
      </Button>
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
