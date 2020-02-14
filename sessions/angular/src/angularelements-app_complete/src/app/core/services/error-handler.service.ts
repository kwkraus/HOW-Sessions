import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root'})
export class ErrorHandlerService extends ErrorHandler {

    constructor(private loggingService: LoggingService) {
        super();
    }

    handleError(error: Error) {
        this.loggingService.logException(error); // Manually log exception
        const originalError = this.getOriginalError(error);
        if (originalError !== error) {
            this.loggingService.logException(originalError); // Manually log original exception
        }
    }

    private getOriginalError(error: any) {
        while (error && error.originalError) {
            error = error.originalError;
        }
        return (error);
    }
}
