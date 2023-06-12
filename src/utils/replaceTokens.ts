import _ from "lodash";

const TOKEN_TRANSFORMERS = {
  //@ts-ignore
  urlencode: (s) => encodeURIComponent(String(s)),
  //@ts-ignore
  urldecode: (s) => decodeURIComponent(String(s)),
  //@ts-ignore
  json: (s) => JSON.stringify(s),
  //@ts-ignore
  "": (s) => String(s),
};

export function replaceTokens<T>(
  obj: T,
  context: { [key: string]: unknown }
): T {
  if (typeof obj === "string") {
    return obj.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_original, key) => {
      //@ts-ignore
      const parts = key.split("|");
      const transform =
        //@ts-ignore
        TOKEN_TRANSFORMERS[parts[1] ? parts[1].trim() : ""] ||
        TOKEN_TRANSFORMERS[""];
      const ret = transform(
        (_.get(context, parts[0].trim(), "") as string) ?? ""
      );
      return ret;
    }) as unknown as T;
  }
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceTokens(item, context)) as unknown as T;
    }
    //@ts-ignore
    return Object.entries(obj).reduce((acc, [key, value]) => {
      //@ts-ignore
      acc[key] = replaceTokens(value, context);
      return acc;
    }, {} as T);
  }
  return obj;
}
