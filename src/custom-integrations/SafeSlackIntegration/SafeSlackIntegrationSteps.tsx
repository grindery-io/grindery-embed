import React from "react";
import { useSafeSlackIntegrationContext } from "./SafeSlackIntegrationContext";
import SafeSlackIntegrationStep1 from "./SafeSlackIntegrationStep1";

type Props = {};

const SafeSlackIntegrationSteps = (props: Props) => {
  const { step } = useSafeSlackIntegrationContext();

  switch (step) {
    case 0:
      return null;
    case 1:
      return <SafeSlackIntegrationStep1 />;
    case 2:
      return null;
    case 3:
      return null;
    default:
      return null;
  }
};

export default SafeSlackIntegrationSteps;
