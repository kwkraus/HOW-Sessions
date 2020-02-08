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
    };
}
