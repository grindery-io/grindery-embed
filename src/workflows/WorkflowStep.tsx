import React from "react";
import styled from "styled-components";
import StepHeader from "./StepHeader";
import StepsDivider from "./StepsDivider";
import StepApp from "./StepApp";
import StepOperation from "./StepOperation";
import StepAuthentication from "./StepAuthentication";
import StepInput from "./StepInput";
//import StepTest from "./StepTest";
import { useWorkflowStepContext } from "./WorkflowStepContext";
import { useWorkflowContext } from "./WorkflowContext";
import { Box } from "@mui/material";

const Container = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  width: 100%;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 10px 40px -3px rgba(0, 0, 0, 0.04) !important;
  }
`;

const Containerinner = styled.div`
  border-radius: 16px;
`;

type Props = {
  outputFields: any[];
};

const WorkflowStep = ({ outputFields }: Props) => {
  const { type, step, operation, operationIsAuthenticated } =
    useWorkflowStepContext();
  const { activeStep } = useWorkflowContext();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const actionParam = urlParams.get("action");
  const triggerParam = urlParams.get("trigger");
  const triggerHidden = urlParams.get("trigger.hidden");
  const actionHidden = urlParams.get("action.hidden");
  return (
    <>
      <Container
        style={{
          boxShadow:
            activeStep === step
              ? "0px 10px 40px -3px rgba(0, 0, 0, 0.04)"
              : "none",
        }}
      >
        <Containerinner>
          <StepHeader />
          <StepApp />
          {activeStep === step && (
            <>
              {((type === "action" && !actionParam) ||
                (type === "trigger" && !triggerParam)) && <StepOperation />}
              {operation && <StepAuthentication />}

              {operation && operationIsAuthenticated && (
                <>
                  {((type === "trigger" && triggerHidden !== "1") ||
                    (type === "action" && actionHidden !== "1")) && (
                    <StepInput outputFields={outputFields} />
                  )}
                </>
              )}
              {/*<StepTest outputFields={outputFields} />*/}
            </>
          )}
        </Containerinner>
      </Container>
      {type === "action" ? <Box height={16} /> : <StepsDivider height={32} />}
    </>
  );
};

export default WorkflowStep;
