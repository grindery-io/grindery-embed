import { HqGsheetIntegration } from "../integrations";

export const CUSTOMERS: {
  [key: string]: {
    name: string;
    integrations: {
      [key: string]: {
        Component: React.FC<any>;
      };
    };
  };
} = {
  hq: {
    name: "HQ",
    integrations: {
      gsheet: {
        Component: HqGsheetIntegration,
      },
    },
  },
};
