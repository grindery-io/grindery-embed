export const sendPostMessage = (
  method: string,
  params?: any,
  id?: string,
  targetOrigin: string = "*"
) => {
  if (window && window.parent) {
    const jsonrpc = {
      jsonrpc: "2.0",
      method: method,
      params: params || undefined,
      id: id || undefined,
    };
    if (!jsonrpc.params) {
      delete jsonrpc.params;
    }
    if (!jsonrpc.id) {
      delete jsonrpc.id;
    }
    window.parent.postMessage(jsonrpc, targetOrigin);
  }
};
