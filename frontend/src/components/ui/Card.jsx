import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Card({ className, children, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "rounded-3xl border border-white/10 bg-[#1c1c1e]/60 backdrop-blur-md shadow-xl overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({ className, children }) {
    return <div className={cn("p-8 pb-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
    return <h3 className={cn("text-xl font-bold text-white leading-none tracking-tight", className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
    return <p className={cn("text-sm text-white/50 mt-2 font-medium", className)}>{children}</p>;
}

export function CardContent({ className, children }) {
    return <div className={cn("p-8 pt-2", className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
    return <div className={cn("p-8 pt-0 flex items-center", className)}>{children}</div>;
}
