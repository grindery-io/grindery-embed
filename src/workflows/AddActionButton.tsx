import React from "react";
//import styled from "styled-components";
import { Box } from "@mui/material";
//import { useWorkflowContext } from "./WorkflowContext";
//import AddStep from "../components/icons/AddStep";

/*const Button = styled.button`
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  & svg {
    width: 32px;
    height: 32px;
    display: block;

    & path,
    & rect {
      transition: all 0.1s ease-in-out;
    }
  }

  &:hover svg path {
    fill: #8c30f5 !important;
  }

  &:hover svg rect {
    stroke: #8c30f5 !important;
  }
`;*/

type Props = {
  prevStep: number;
};

const AddActionButton = (props: Props) => {
  //const { prevStep } = props;
  //const { workflow, setActiveStep, setWorkflow } = useWorkflowContext();

  //const newIndex = prevStep - 1;

  /*const handleClick = () => {
    const currentWorkflow = { ...workflow };
    const currentActions = currentWorkflow.actions;
    const newActions = [
      ...currentActions.slice(0, newIndex),
      {
        type: "action",
        connector: "",
        operation: "",
        input: {},
      },
      ...currentActions.slice(newIndex),
    ];
    setWorkflow({ ...currentWorkflow, actions: newActions });
    setActiveStep(prevStep + 1);
  };*/

  return (
    <>
      <Box height="16px" />
      {/*<Button onClick={handleClick}>
        <AddStep />
  </Button>*/}
    </>
  );
};

export default AddActionButton;
