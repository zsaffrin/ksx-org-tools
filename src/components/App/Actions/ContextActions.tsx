import { useState } from 'react';
import { useCurrentTab, useNav } from '../../../hooks';
import { Button } from '../../ui';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './ContextActions.css';

interface ContextActionsProps {
  params?: {
    baseUrl?: string | null,
    domain?: string | null,
    pageName?: string | null,
    pageType?: string | null,
    sObject?: string | null,
    recordId?: string | null,
    apexPage?: string | null,
    apexArgs?: { [key: string]: string | null } | null,
  }
}

interface LogCopyResult {
  type?: string,
  content?: string | null,
}

const ContextActions = ({ params }: ContextActionsProps) => {
  const currentTab = useCurrentTab();
  const { navigate } = useNav();
  const [logCopyResult, setLogCopyResult] = useState<LogCopyResult | null>(null);
  
  // Job Administration > Pending Jobs runner
  if (params?.apexPage?.includes('JobsPending')) {
    const args = {
      ...params.apexArgs,
      threads: 10,
    };
    
    return (
      <div>
        <Button
          title='threads=10'
          action={() => navigate({
            type: 'apex',
            page: 'KimbleOne__JobsPending',
            redirect: true
          }, args)}
        />
      </div>
    );
  }

  // Activity Assignment
  if (params?.sObject?.includes('ActivityAssignment__c') && params?.recordId) {
    return (
      <div>
        <Button
          title='Open Assignment Usage Pattern'
          action={() => navigate({
            type: 'apex',
            page: 'KimbleOne__ActivityAssignmentRates'
          }, { id: params.recordId || null })}
        />
      </div>
    );
  }

  // Delivery Engagement
  if (params?.sObject?.includes('DeliveryGroup__c') && params?.recordId) {
    return (
      <div>
        <Button
          title='Expense Forecasting'
          action={() => navigate({
            type: 'apex',
            page: 'KimbleOne__ActivityExpenseCategoryProfiles'
          }, { id: params.recordId || null })}
        />
      </div>
    );
  }

  // Setup pages
  if (params?.pageType == 'setup') {
    // Debug Log Detail
    if (params.pageName == 'ApexDebugLogDetail') {
      const getLogContent = () => {
        const frame = document.querySelector('iframe');
        if (frame) {
          try {
            const textContent = frame.contentWindow?.document.querySelector('pre.codeBlock')?.textContent;
            return ({
              type: 'success',
              content: textContent,
            });
          } catch (err) {
            return ({
              type: 'error',
              content: JSON.stringify(err) || '',
            });
          }
        } else {
          return ({
            type: 'error',
            content: 'No iframe found',
          });
        }
      };

      const triggerContentCopy = () => {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id || 0 },
          func: getLogContent,
        }).then((results) => {
          const result: LogCopyResult = results[0]?.result || {};
          if (result.type == 'success') {
            navigator.clipboard.writeText(result.content || '');
          }
          setLogCopyResult(result);
        });
      };

      let result;
      if (logCopyResult) {
        let classString = 'log-copy-result';
        let icon;
        let content = logCopyResult.content;
        if (logCopyResult.type == 'success') {
          classString += ' success';
          icon = <FaCheckCircle />;
          content = 'Log copied to clipboard';
        }
        if (logCopyResult.type == 'error') {
          classString += ' error';
          icon = <FaTimesCircle />;
        }
        result = (
          <div className={classString}>
            {icon}
            {content}
          </div>
        );
      }
      
      return (
        <div className='log-copy'>
          <Button
            title='Copy Log Content'
            action={triggerContentCopy}
          />
          {result}
        </div>
      );
    }
  }

  return null;
};

export default ContextActions;
