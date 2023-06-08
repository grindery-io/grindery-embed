import React from "react";
import { Route, Routes } from "react-router";
import { CUSTOMERS } from "../../config";

const CustomIntegrationPage = () => {
  return (
    <>
      <Routes>
        {Object.keys(CUSTOMERS).map((customerKey) => (
          <React.Fragment key={customerKey}>
            {Object.keys(CUSTOMERS[customerKey].integrations).map(
              (integrationKey) => {
                const Component =
                  CUSTOMERS[customerKey].integrations[integrationKey].Component;
                return (
                  <Route
                    key={`/${customerKey}/${integrationKey}`}
                    path={`/${customerKey}/${integrationKey}`}
                    element={<Component />}
                  />
                );
              }
            )}
          </React.Fragment>
        ))}
      </Routes>
    </>
  );
};

export default CustomIntegrationPage;
