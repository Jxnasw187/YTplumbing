import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 border-transparent",
    secondary: "bg-surface-highlight hover:bg-white/20 text-white border border-white/10",
    outline: "bg-transparent border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5 border-transparent",
    glass: "bg-white/10 backdrop-blur-md border-white/10 text-white hover:bg-white/20 shadow-lg",
};

const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-3",
};

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    startIcon: StartIcon,
    children,
    ...props
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
                "inline-flex items-center justify-center rounded-2xl font-semibold transition-colors border select-none",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-black",
                "disabled:opacity-50 disabled:pointer-events-none disabled:grayscale",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin mr-2 size-4" />
            ) : StartIcon ? (
                <StartIcon className="mr-2 size-4" />
            ) : null}
            {children}
        </motion.button>
    );
}
