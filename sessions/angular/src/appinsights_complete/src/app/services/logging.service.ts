import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
import { AppConfig } from '../app.config';
import { SeverityLevel } from '../models/logging.models';

@Injectable({ providedIn: 'root'})
export class LoggingService {

    logPageView(name?: string, url?: string, properties?: any, measurements?: any, duration?: number) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackPageView(name, url, properties, measurements, duration);
        }
    }

    // Log non-exception type errors, e.g. invalid API request
    logError(error: any, severityLevel?: SeverityLevel) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(error, severityLevel);
        }
    }

    logEvent(name: string, properties?: any, measurements?: any) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackEvent(name, properties, measurements);
        }
    }

    logMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number,
            properties?: any) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackMetric(name, average, sampleCount, min, max, properties);
        }
    }

    logException(exception: Error, severityLevel?: SeverityLevel, handledAt?: string,
        properties?:any, measurements?: any) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(exception, severityLevel);
        }
        if (AppConfig.settings && AppConfig.settings.logging && 
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackException(exception, handledAt, properties, measurements, <AI.SeverityLevel>severityLevel);
        }
    }

    logTrace(message: string, properties?: any) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackTrace(message, properties);
        }
    }

    private sendToConsole(error: any, severityLevel: SeverityLevel = SeverityLevel.Error) {

        switch (severityLevel) {
            case SeverityLevel.Critical:
            case SeverityLevel.Error:
                (<any>console).group('Demo Error:');
                console.error(error);
                if (error.message) {
                    console.error(error.message);
                }
                if (error.stack) {
                    console.error(error.stack);
                }
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Warning:
                (<any>console).group('Demo Error:');
                console.warn(error);
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Information:
                (<any>console).group('Demo Error:');
                console.log(error);
                (<any>console).groupEnd();
                break;
        }
    }
}
