import SafeSlackIntegrationSteps from "./SafeSlackIntegrationSteps";
import SafeSlackIntegrationContextProvider from "./SafeSlackIntegrationContext";

const SafeSlackIntegration = () => {
  return (
    <SafeSlackIntegrationContextProvider>
      <SafeSlackIntegrationSteps />
    </SafeSlackIntegrationContextProvider>
  );
};

export default SafeSlackIntegration;
