import HqGsheetIntegrationContextProvider from "./HqGsheetIntegrationContext";
import HqGsheetIntegrationStep1 from "./HqGsheetIntegrationStep1";

const HqGsheetIntegration = () => {
  return (
    <HqGsheetIntegrationContextProvider>
      <HqGsheetIntegrationStep1 />
    </HqGsheetIntegrationContextProvider>
  );
};

export default HqGsheetIntegration;
