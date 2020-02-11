export interface IAppConfig {
    logging: {
        console: boolean;
        appInsights: boolean;
    };
    appInsights: {
        instrumentationKey: string;
    };
    apiServer: {
        books: string;
        metadata: string;
    };
    aad: {
        requireAuth: boolean;
        tenant: string;
        resource: string;
        clientId: string;
        endpoints: { [key: string]: string };
    };
}
