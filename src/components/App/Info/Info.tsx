import { ReactNode } from 'react';
import useUrlParams from '../../../hooks/useUrlParams';
import './Info.css';

const Info = () => {
  const params = useUrlParams();

  const facts: {
    label?: string | null,
    content?: string | ReactNode | null,
  }[] = [
    { label: 'Page Type', content: params.pageType },
  ];
  if (params.pageType == 'object') {
    facts.push({ label: 'Object', content: params.sObject });
  }
  if (params.pageType == 'record') {
    facts.push({ label: 'Object', content: params.sObject });
    facts.push({ label: 'Record Id', content: params.recordId });
  }
  if (params.pageType == 'apex') {
    facts.push({ label: 'Apex Page', content: params.apexPage });
    facts.push({ label: 'Page Args', content: (
      <div className="info-subfacts">
        {params?.apexArgs && Object.keys(params.apexArgs).map((paramKey) => (
          <>
            <div className="info-subfact-label">{paramKey}</div>
            <div className="info-subfact-content">{params.apexArgs && params.apexArgs[paramKey]}</div>
          </>
        ))}
      </div>
    ) });
  }

  return (
    <div className="info-layout">
      {facts.map(({ label, content }) => (
        <div className="info-facts">
          <div className="info-fact-label">{label}</div>
          <div className="info-fact-content">{content}</div>
        </div>
      ))}
    </div>
  );
};

export default Info;
