export const sendPostMessage = (
  method: string,
  params?: any,
  targetOrigin: string = "*"
) => {
  if (window && window.parent) {
    const jsonrpc = {
      jsonrpc: "2.0",
      method: method,
      params: params || undefined,
      id: Date.now(),
    };
    if (!jsonrpc.params) {
      delete jsonrpc.params;
    }
    window.parent.postMessage(jsonrpc, targetOrigin);
  }
};
