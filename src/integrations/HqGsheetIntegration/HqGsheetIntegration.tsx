import HqGsheetIntegrationContextProvider from "./HqGsheetIntegrationContext";
import HqGsheetIntegrationSteps from "./HqGsheetIntegrationSteps";

const HqGsheetIntegration = () => {
  return (
    <HqGsheetIntegrationContextProvider>
      <HqGsheetIntegrationSteps />
    </HqGsheetIntegrationContextProvider>
  );
};

export default HqGsheetIntegration;
