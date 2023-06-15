import React, { useState } from "react";
import WorkflowStep from "./WorkflowStep";
import { useWorkflowContext } from "./WorkflowContext";
import WorkflowStepContextProvider from "./WorkflowStepContext";
import WorkflowSave from "./WorkflowSave";
import { styled } from "styled-components";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Wrapper = styled.div`
  max-width: 816px;
  padding: 32px 20px 42px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  jsutify-content: flex-start;
  flex-wrap: nowrap;
  margin: 0 auto;
  padding: 0 0 16px;
  margin: 40px auto 0;
`;

type Props = {};

const WorkflowBuilder = (props: Props) => {
  const { workflow, saved } = useWorkflowContext();

  // workflow steps output
  const [outputFields, setOutputFields] = useState<any[]>([]);

  //const queryString = window.location.search;
  //const urlParams = new URLSearchParams(queryString);
  //  const triggerHidden = urlParams.get("trigger.hidden");

  return (
    <Wrapper>
      {!saved ? (
        <>
          <WorkflowStepContextProvider
            type="trigger"
            index={0}
            step={1}
            setOutputFields={setOutputFields}
          >
            <WorkflowStep outputFields={outputFields} />
          </WorkflowStepContextProvider>
          {workflow.actions.map((action, index) => (
            <WorkflowStepContextProvider
              key={`${action.connector}_${index}`}
              type="action"
              index={index}
              step={index + 2}
              setOutputFields={setOutputFields}
            >
              <WorkflowStep outputFields={outputFields} />
            </WorkflowStepContextProvider>
          ))}
          <WorkflowSave />
        </>
      ) : (
        <Box textAlign="center">
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: "42px", margin: "0 0 20px" }}
          />
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "18px",
              lineHeight: "120%",
              fontStyle: "normal",
            }}
          >
            Workflow saved
          </Typography>
        </Box>
      )}
    </Wrapper>
  );
};

export default WorkflowBuilder;
