declare module '@adobe/aem-headless-client-js' {
  interface AEMHeadlessConfig {
    serviceURL: string;
    endpoint: string;
    auth?: string | [string, string] | null;
  }

  class AEMHeadless {
    constructor(config: AEMHeadlessConfig);
    runPersistedQuery(
      queryName: string,
      variables?: Record<string, unknown>
    ): Promise<{ data?: unknown }>;
  }

  export default AEMHeadless;
}
