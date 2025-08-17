declare module '*/package.json' {
  const value: {
    name: string;
    version: string;
    private: boolean;
    [key: string]: any;
  };
  export default value;
}
