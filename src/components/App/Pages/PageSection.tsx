import { ReactNode } from 'react';
import './PageSection.css';

interface PageSectionProps {
  title: string | null,
  content: ReactNode[] | null,
}

const PageSection = ({ title, content }: PageSectionProps) => {
  return (
    <div>
      <div className='section-title'>{title}</div>
      <div className='two-column-grid'>
        {content}
      </div>
    </div>
  );
};

export default PageSection;
