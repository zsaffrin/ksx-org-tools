import type { ReactNode } from 'react';
import './ContextActionSection.css';

interface ContextActionSectionProps {
  title: string,
  content: ReactNode,
}

const ContextActionSection = ({ title, content }: ContextActionSectionProps) => {
  return (
    <div className='context-action-section'>
      <div className='section-title'>{title}</div>
      <div className='section-content'>{content}</div>
    </div>
  );
};

export default ContextActionSection;
