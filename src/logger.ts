/* logging utility to maintain logs throughout the system */

let getTimeStamp = () => {
  return new Date().toISOString();
};

let info = (namespace: string, message: string, object?: any) => {
  console.info(
    `[${getTimeStamp()}] [INFO] [${namespace}] [${message}]`,
    object || ""
  );
};

let warn = (namespace: string, message: string, object?: any) => {
  console.warn(
    `[${getTimeStamp()}] [WARN] [${namespace}] [${message}]`,
    object || ""
  );
};
let error = (namespace: string, message: string, object?: any) => {
  console.error(
    `[${getTimeStamp()}] [ERROR] [${namespace}] [${message}]`,
    object || ""
  );
};
let debug = (namespace: string, message: string, object?: any) => {
  console.debug(
    `[${getTimeStamp()}] [DEBUG] [${namespace}] [${message}]`,
    object || ""
  );
};

export default {
  info,
  warn,
  error,
  debug,
};
