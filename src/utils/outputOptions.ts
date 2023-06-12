import _ from "lodash";
import {
  ActionOperation,
  Connector,
  TriggerOperation,
} from "../types/Connector";

export const getOutputOptions = (
  operation: TriggerOperation | ActionOperation,
  connector: Connector,
  type: string,
  index: number
) => {
  if (!operation) {
    return [];
  } else {
    return _.flatten(
      operation.outputFields &&
        operation.outputFields.map((outputField: any) => {
          if (outputField.list) {
            const sampleInput = operation.sample?.[outputField.key];
            return Array.isArray(sampleInput)
              ? sampleInput.map((sample: any, i: any) => ({
                  value: `{{${
                    type === "trigger" ? "trigger" : "step" + index
                  }.${outputField.key}[${i}]}}`,
                  label: `${outputField.label || outputField.key}[${i}]`,
                  reference: sample,
                  icon: connector.icon || "",
                  group: connector.name,
                }))
              : [];
          } else {
            return {
              value: `{{${type === "trigger" ? "trigger" : "step" + index}.${
                outputField.key
              }}}`,
              label: outputField.label || outputField.key,
              reference: operation.sample?.[outputField.key],
              icon: connector.icon || "",
              group: connector.name,
            };
          }
        })
    );
  }
};
