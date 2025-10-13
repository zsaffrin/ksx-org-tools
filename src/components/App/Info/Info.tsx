// import { ReactNode } from 'react';
import { ReactNode } from 'react';
import { FaDatabase, FaFile } from 'react-icons/fa';
import { AiFillLayout } from 'react-icons/ai';
import { FaListUl } from 'react-icons/fa6';
import useUrlParams from '../../../hooks/useUrlParams';
import './Info.css';

interface InfoFact {
  icon?: ReactNode | null,
  title?: string | null,
  content?: string | ReactNode | null,
}

const Info = () => {
  const params = useUrlParams();

  const facts: InfoFact[] = [];

  // const facts: {
  //   label?: string | null,
  //   content?: string | ReactNode | null,
  // }[] = [
  //   { label: 'Page Type', content: params.pageType },
  // ];
  // if (params.pageType == 'object') {
  //   facts.push({ label: 'Object', content: params.sObject });
  // }
  // if (params.pageType == 'record') {
  //   facts.push({ label: 'Object', content: params.sObject });
  //   facts.push({ label: 'Record Id', content: params.recordId });
  // }
  // if (params.pageType == 'apex') {
  //   facts.push({ label: 'Apex Page', content: params.apexPage });
  //   facts.push({ label: 'Page Args', content: (
  //     <div className="info-subfacts">
  //       {params?.apexArgs && Object.keys(params.apexArgs).map((paramKey) => (
  //         <>
  //           <div className="info-subfact-label">{paramKey}</div>
  //           <div className="info-subfact-content">{params.apexArgs && params.apexArgs[paramKey]}</div>
  //         </>
  //       ))}
  //     </div>
  //   ) });
  // }

  // return (
  //   <div className="info-layout">
  //     <div className="info-facts">
  //     {facts.map(({ label, content }) => (
  //       <>
  //         <div className="info-fact-label">{label}</div>
  //         <div className="info-fact-content">{content}</div>
  //       </>
  //     ))}
  //     </div>
  //   </div>
  // );

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
      content: params.recordId,
    });
  }

  if (params.pageType == 'apex') {
    facts.push({
      icon: <AiFillLayout title='Apex Page' />,
      content: params.apexPage,
    });

    if (params.apexArgs && Object.keys(params.apexArgs).length > 0) {
      const pageArgNodes = Object.keys(params.apexArgs).reduce((acc, argKey) => (
        [
          ...acc,
          <div className='info-subfact-label'>{argKey}</div>,
          <div>{params.apexArgs?.[argKey]}</div>,
        ]
      ), [] as ReactNode[]);
  
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
