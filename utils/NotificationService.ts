import { toast, ToastOptions } from 'react-hot-toast';

class NotificationService {
  // Define default options that can be overridden by each method
  private defaultOptions: ToastOptions = {
    duration: 4000,
    position: 'top-right',
  };

  // Method to show a success notification
  public success(message: string, options?: ToastOptions) {
    toast.success(message, { ...this.defaultOptions, ...options });
  }

  // Method to show an error notification
  public error(message: string, options?: ToastOptions) {
    toast.error(message, { ...this.defaultOptions, ...options });
  }

  public errors(errorMessages: string[], options?: ToastOptions) {
    const errorMessagesHtml = errorMessages.join('\n');
    toast.error(errorMessagesHtml, { ...this.defaultOptions, ...options });
  }

  // Method to show a custom notification
  public custom(message: string, options?: ToastOptions) {
    toast(message, { ...this.defaultOptions, ...options });
  }

  // Method to show a loading notification
  public loading(message: string, options?: ToastOptions) {
    toast.loading(message, { ...this.defaultOptions, ...options });
  }

  // Method to dismiss all notifications
  public dismiss() {
    toast.dismiss();
  }
}

// Export an instance of the NotificationService
const notificationService = new NotificationService();
export default notificationService;