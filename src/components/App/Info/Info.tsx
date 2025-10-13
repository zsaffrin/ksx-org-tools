import { ReactNode } from 'react';
import { FaDatabase, FaFile } from 'react-icons/fa';
import { AiFillLayout } from 'react-icons/ai';
import { FaListUl } from 'react-icons/fa6';
import useUrlParams from '../../../hooks/useUrlParams';
import { isSalesforceRecordId } from '../../../utilities';
import { RecordId } from '../../ui';
import './Info.css';

interface InfoFact {
  icon?: ReactNode | null,
  title?: string | null,
  content?: string | ReactNode | null,
}

const Info = () => {
  const params = useUrlParams();

  const facts: InfoFact[] = [];

  if (params.pageType == 'object') {
    facts.push({
      icon: <FaDatabase title='Object' />,
      content: params.sObject,
    });
  }

  if (params.pageType == 'record') {
    facts.push({
      icon: <FaDatabase title='Object' />,
      content: params.sObject,
    });
    facts.push({
      icon: <FaFile title='Record' />,
      content: <RecordId sObject={params.sObject} recordId={params.recordId} />,
    });
  }

  if (params.pageType == 'apex') {
    facts.push({
      icon: <AiFillLayout title='Apex Page' />,
      content: params.apexPage,
    });

    if (params.apexArgs && Object.keys(params.apexArgs).length > 0) {
      const pageArgNodes = Object.keys(params.apexArgs).reduce((acc, argKey) => {
        const argVal = params.apexArgs?.[argKey] || null;
        const isSalesforceId = isSalesforceRecordId(argVal);

        return (
          [
            ...acc,
            <div className='info-subfact-label'>{argKey}</div>,
            <div>
              {isSalesforceId 
                ? <RecordId recordId={argVal} />
                : argVal
              }
            </div>,
          ]
        );
      }, [] as ReactNode[]);
  
      facts.push({
        icon: <FaListUl title='Page Args' />,
        content: (
          <div className='info-subfacts'>
            {pageArgNodes}
          </div>
        )
      });
    }
  }

  const factNodes = facts.reduce((acc, fact) => (
    [
      ...acc,
      <div className='info-fact-label'>
        {fact.icon}
        {fact.title}
      </div>,
      <div>
        {fact.content}
      </div>
    ]
  ), [] as ReactNode[]);

  return (
    <div className='info-layout'>
      <div className='info-facts'>
        {factNodes}
      </div>
    </div>
  );
};

export default Info;
