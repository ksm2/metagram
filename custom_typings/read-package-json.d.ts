declare module 'read-package-json' {
  function readPackageJson(file: string, cb: (err: Error | null, data: any) => void): void;

  export = readPackageJson;
}
