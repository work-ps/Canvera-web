import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
