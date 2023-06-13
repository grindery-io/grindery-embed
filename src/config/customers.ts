import {
  HqGsheetIntegration,
  SafeGsheetIntegration,
} from "../custom-integrations";
import SafeSlackIntegration from "../custom-integrations/SafeSlackIntegration/SafeSlackIntegration";

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
  safe: {
    name: "Safe",
    integrations: {
      gsheet: {
        Component: SafeGsheetIntegration,
      },
      slack: {
        Component: SafeSlackIntegration,
      },
    },
  },
};
