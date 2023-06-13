import SafeGsheetIntegrationContextProvider from "./SafeGsheetIntegrationContext";
import SafeGsheetIntegrationSteps from "./SafeGsheetIntegrationSteps";

const SafeGsheetIntegration = () => {
  return (
    <SafeGsheetIntegrationContextProvider>
      <SafeGsheetIntegrationSteps />
    </SafeGsheetIntegrationContextProvider>
  );
};

export default SafeGsheetIntegration;
