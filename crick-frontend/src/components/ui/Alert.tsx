interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export const Alert = ({ children, variant = 'default' }: AlertProps) => {
  const styles = {
    default: 'bg-blue-100 border-blue-400 text-blue-700',
    destructive: 'bg-red-100 border-red-400 text-red-700'
  };

  return (
    <div className={`border px-4 py-3 rounded relative ${styles[variant]}`}>
      {children}
    </div>
  );
};