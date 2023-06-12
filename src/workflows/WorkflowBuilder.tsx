import React, { useState } from "react";
import WorkflowStep from "./WorkflowStep";
import { useWorkflowContext } from "./WorkflowContext";
import WorkflowStepContextProvider from "./WorkflowStepContext";
import WorkflowSave from "./WorkflowSave";
import { styled } from "styled-components";

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
  const { workflow } = useWorkflowContext();

  // workflow steps output
  const [outputFields, setOutputFields] = useState<any[]>([]);

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default WorkflowBuilder;
