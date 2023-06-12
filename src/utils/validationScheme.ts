import { Field } from "../types/Connector";

export const getValidationScheme = (inputFields: Field[]) => {
  const sanitizeType = (type: string) => {
    switch (type) {
      case "integer":
        return "number";
      case "text":
        return "string";
      case "datetime":
        return "date";
      case "file":
        return "string";
      case "password":
        return "string";
      case "copy":
        return "string";
      case "code":
        return "string";
      case "info":
        return "string";
      case "boolean":
        return "string";
      default:
        return type;
    }
  };
  const schema: any = {};
  inputFields.forEach((field: Field) => {
    schema[field.key] = {
      type: sanitizeType(field.type || ""),
      ...field.validation,
      optional: !field.required,
      empty: !field.required,
    };
    if (field.list) {
      schema[field.key].items = {
        type: sanitizeType(field.type || ""),
        empty: !field.required,
      };
      schema[field.key].type = "array";
    }
  });

  return schema;
};
