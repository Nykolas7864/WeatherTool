interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
  darkMode?: boolean;
}

export function ErrorMessage({ message, onDismiss, darkMode = false }: ErrorMessageProps) {
  return (
    <div className={`rounded-2xl p-4 flex items-center justify-between backdrop-blur-md border transition-all duration-300 ${
      darkMode 
        ? 'bg-red-500/20 border-red-500/30' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${darkMode ? 'bg-red-500/30' : 'bg-red-100'}`}>
          <svg className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className={`p-2 rounded-full transition-all hover:scale-110 ${
          darkMode ? 'hover:bg-white/10' : 'hover:bg-red-100'
        }`}
      >
        <svg className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
