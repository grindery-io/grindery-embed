import React, { useState } from "react";
import WorkflowStep from "./WorkflowStep";
import { useWorkflowContext } from "./WorkflowContext";
import WorkflowStepContextProvider from "./WorkflowStepContext";
import WorkflowSave from "./WorkflowSave";
import { styled } from "styled-components";
import { useAppSelector } from "../store";
import { selecConfigStore } from "../store/slices/configSlice";

const Wrapper = styled.div`
  max-width: 816px;
  padding: 40px 16px 40px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  jsutify-content: flex-start;
  flex-wrap: nowrap;
  margin: 0 auto;
`;

type Props = {};

const WorkflowBuilder = (props: Props) => {
  const { workflow } = useWorkflowContext();
  const { hideTrigger } = useAppSelector(selecConfigStore);

  // workflow steps output
  const [outputFields, setOutputFields] = useState<any[]>([]);

  return (
    <Wrapper>
      <>
        <WorkflowStepContextProvider
          type="trigger"
          index={0}
          step={1}
          setOutputFields={setOutputFields}
        >
          {!hideTrigger && <WorkflowStep outputFields={outputFields} />}
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
    </Wrapper>
  );
};

export default WorkflowBuilder;
