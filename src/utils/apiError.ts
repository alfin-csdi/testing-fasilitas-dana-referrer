interface ApiError {
    field: string;
    message: string;
  }
  
  export const formatApiErrors = (errors: ApiError[]): Record<string, string> => {
    const formattedErrors: Record<string, string> = {};
    
    errors.forEach((error) => {
      formattedErrors[error.field] = error.message;
    });
    
    return formattedErrors;
  };
  
  export const handleApiError = (error: any): ApiError[] => {
    if (error.response?.data) {
      return error.response.data;
    }
    return [{ field: 'general', message: 'An unexpected error occurred' }];
  };