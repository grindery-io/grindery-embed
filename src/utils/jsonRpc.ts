export const jsonrpcObj = (method: string, params: object) => {
  return {
    jsonrpc: "2.0",
    method: method,
    id: new Date(),
    params,
  };
};
