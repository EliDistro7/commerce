export const StatusAlert = ({ type, message, title }) => {
    const alertStyles = {
      error: {
        bg: "bg-red-50",
        icon: "text-red-400",
        title: "text-red-800",
        text: "text-red-700",
        path: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      },
      success: {
        bg: "bg-green-50",
        icon: "text-green-400",
        title: "text-green-800",
        text: "text-green-700",
        path: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      }
    };
  
    const style = alertStyles[type];
    
    if (!style || !message) return null;
  
    return (
      <div className={`${style.bg} p-4 rounded-md`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className={`h-5 w-5 ${style.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d={style.path} clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${style.title}`}>{title || (type === 'error' ? 'Error' : 'Success')}</h3>
            <div className={`mt-2 text-sm ${style.text}`}>
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };