import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export default function Section({ children, id, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-[--space-section] ${className}`}
      style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
    >
      {children}
    </section>
  );
}
