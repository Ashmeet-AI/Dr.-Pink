import React from 'react';

// --- Colors & Utilities mapped to Props ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-full font-sans transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-pink disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-pink text-soft-charcoal hover:bg-primary-hover shadow-sm",
    secondary: "bg-soft-blush text-soft-charcoal hover:bg-opacity-80",
    ghost: "bg-transparent text-soft-text hover:bg-soft-beige/50",
    outline: "border border-soft-rose text-soft-charcoal hover:bg-warm-white"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base font-medium",
    lg: "px-8 py-3 text-lg font-medium"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/60 backdrop-blur-sm border border-soft-beige rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-500 ${className}`}>
    {children}
  </div>
);

export const EmotionBadge: React.FC<{ emotion: string; selected?: boolean; onClick?: () => void }> = ({ emotion, selected, onClick }) => {
  const colorMap: Record<string, string> = {
    Happy: 'bg-emotion-hopeful',
    Curious: 'bg-emotion-calm',
    Anxious: 'bg-emotion-tender',
    Tender: 'bg-emotion-tender',
    Heavy: 'bg-soft-rose',
    Excited: 'bg-emotion-hopeful',
    Unsure: 'bg-soft-beige',
    Calm: 'bg-emotion-calm',
  };

  const bg = colorMap[emotion] || 'bg-soft-beige';
  
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all
        ${bg} ${selected ? 'ring-2 ring-soft-charcoal ring-offset-1 scale-105' : 'opacity-80 hover:opacity-100'}
        text-soft-charcoal/80
      `}
    >
      {emotion}
    </button>
  );
};

export const Heading: React.FC<{ children: React.ReactNode; level?: 1 | 2 | 3; className?: string }> = ({ children, level = 1, className = '' }) => {
  if (level === 1) return <h1 className={`font-serif text-3xl md:text-4xl text-soft-charcoal leading-tight ${className}`}>{children}</h1>;
  if (level === 2) return <h2 className={`font-serif text-2xl text-soft-charcoal/90 ${className}`}>{children}</h2>;
  return <h3 className={`font-serif text-xl text-soft-charcoal/80 ${className}`}>{children}</h3>;
};

export const Text: React.FC<{ children: React.ReactNode; className?: string; variant?: 'body' | 'meta' }> = ({ children, className = '', variant = 'body' }) => {
  const styles = variant === 'body' 
    ? "font-sans text-base text-soft-charcoal leading-relaxed" 
    : "font-sans text-sm text-soft-text";
  return <p className={`${styles} ${className}`}>{children}</p>;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full bg-white/50 border border-soft-beige rounded-xl px-4 py-3 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition-all font-sans text-soft-charcoal placeholder:text-soft-text/60 ${className}`}
    {...props}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea 
    className={`w-full bg-white/50 border border-soft-beige rounded-xl px-4 py-3 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition-all font-sans text-soft-charcoal placeholder:text-soft-text/60 min-h-[120px] resize-none ${className}`}
    {...props}
  />
);