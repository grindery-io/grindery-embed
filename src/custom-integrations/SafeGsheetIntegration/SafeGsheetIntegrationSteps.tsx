import React from "react";
import { useSafeGsheetIntegrationContext } from "./SafeGsheetIntegrationContext";
import SafeGsheetIntegrationStep1 from "./SafeGsheetIntegrationStep1";
import SafeGsheetIntegrationStep2 from "./SafeGsheetIntegrationStep2";
import SafeGsheetIntegrationStep3 from "./SafeGsheetIntegrationStep3";

type Props = {};

const SafeGsheetIntegrationSteps = (props: Props) => {
  const { step } = useSafeGsheetIntegrationContext();

  switch (step) {
    case 0:
      return null;
    case 1:
      return <SafeGsheetIntegrationStep1 />;
    case 2:
      return <SafeGsheetIntegrationStep2 />;
    case 3:
      return <SafeGsheetIntegrationStep3 />;
    default:
      return null;
  }
};

export default SafeGsheetIntegrationSteps;
