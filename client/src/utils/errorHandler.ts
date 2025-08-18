import { NavigateFunction } from 'react-router-dom';

export class ErrorHandler {
  private static navigate: NavigateFunction | null = null;

  static setNavigate(navigate: NavigateFunction) {
    ErrorHandler.navigate = navigate;
  }

  static redirectToError(errorCode: 403 | 404 | 503) {
    if (ErrorHandler.navigate) {
      switch (errorCode) {
        case 403:
          ErrorHandler.navigate('/error/403');
          break;
        case 503:
          ErrorHandler.navigate('/error/503');
          break;
        case 404:
        default:
          ErrorHandler.navigate('/error/404');
          break;
      }
    } else {
      // Fallback to window.location if navigate is not available
      switch (errorCode) {
        case 403:
          window.location.href = '/#/error/403';
          break;
        case 503:
          window.location.href = '/#/error/503';
          break;
        case 404:
        default:
          window.location.href = '/#/error/404';
          break;
      }
    }
  }

  static handleApiError(status: number) {
    switch (status) {
      case 403:
        this.redirectToError(403);
        break;
      case 503:
        this.redirectToError(503);
        break;
      case 404:
        this.redirectToError(404);
        break;
      default:
        // For other errors, you might want to show a toast or handle differently
        console.error(`API Error: ${status}`);
        break;
    }
  }
}

// Export individual functions for easier use
export const redirectTo403 = () => ErrorHandler.redirectToError(403);
export const redirectTo404 = () => ErrorHandler.redirectToError(404);
export const redirectTo503 = () => ErrorHandler.redirectToError(503);
export const handleApiError = (status: number) => ErrorHandler.handleApiError(status); 