export const getUnixTimestamp = (jsTime?: number) =>
  jsTime ? Math.floor(jsTime / 1000) : Math.floor(Date.now() / 1000);