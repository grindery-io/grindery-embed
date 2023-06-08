import React from "react";
import { useHqGsheetIntegrationContext } from "./HqGsheetIntegrationContext";
import HqGsheetIntegrationStep1 from "./HqGsheetIntegrationStep1";
import HqGsheetIntegrationStep2 from "./HqGsheetIntegrationStep2";

type Props = {};

const HqGsheetIntegrationSteps = (props: Props) => {
  const { step } = useHqGsheetIntegrationContext();

  switch (step) {
    case 0:
      return null;
    case 1:
      return <HqGsheetIntegrationStep1 />;
    case 2:
      return <HqGsheetIntegrationStep2 />;
    default:
      return null;
  }
};

export default HqGsheetIntegrationSteps;
