import React from "react";
import { useSafeSlackIntegrationContext } from "./SafeSlackIntegrationContext";
import SafeSlackIntegrationStep1 from "./SafeSlackIntegrationStep1";
import SafeSlackIntegrationStep2 from "./SafeSlackIntegrationStep2";
import SafeSlackIntegrationStep3 from "./SafeSlackIntegrationStep3";

type Props = {};

const SafeSlackIntegrationSteps = (props: Props) => {
  const { step } = useSafeSlackIntegrationContext();

  switch (step) {
    case 0:
      return null;
    case 1:
      return <SafeSlackIntegrationStep1 />;
    case 2:
      return <SafeSlackIntegrationStep2 />;
    case 3:
      return <SafeSlackIntegrationStep3 />;
    default:
      return null;
  }
};

export default SafeSlackIntegrationSteps;
