import React from "react";
import { useHqGsheetIntegrationContext } from "./HqGsheetIntegrationContext";
import HqGsheetIntegrationStep1 from "./HqGsheetIntegrationStep1";
import HqGsheetIntegrationStep2 from "./HqGsheetIntegrationStep2";
import HqGsheetIntegrationStep3 from "./HqGsheetIntegrationStep3";

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
    case 3:
      return <HqGsheetIntegrationStep3 />;
    default:
      return null;
  }
};

export default HqGsheetIntegrationSteps;
