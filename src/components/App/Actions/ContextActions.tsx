import { useState } from 'react';
import type { ReactNode } from 'react';
import { useCurrentTab, useNav, useSOQLBuilder } from '../../../hooks';
import { Button } from '../../ui';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ContextActionSection from './ContextActionSection';
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
  const SOQLBuilder = useSOQLBuilder();
  const [logCopyResult, setLogCopyResult] = useState<LogCopyResult | null>(null);

  const actionItems: ReactNode[] = [];
  const pageItems: ReactNode[] = [];
  const queryItems: ReactNode[] = [];
  
  // Job Administration > Pending Jobs runner
  if (params?.apexPage?.includes('JobsPending')) {
    const args = {
      ...params.apexArgs,
      threads: 10,
    };

    actionItems.push((
      <Button
        title='threads=10'
        action={() => navigate({
          type: 'apex',
          page: 'KimbleOne__JobsPending',
          redirect: true
        }, args)}
      />
    ));
  }

  // Activity Assignment
  if (params?.sObject?.includes('ActivityAssignment__c') && params?.recordId) {
    actionItems.push((
      <Button
        title='Open Assignment Usage Pattern'
        action={() => navigate({
          type: 'apex',
          page: 'KimbleOne__ActivityAssignmentRates'
        }, { id: params.recordId || null })}
      />
    ));
  }

  // Delivery Engagement
  if (params?.sObject?.includes('DeliveryGroup__c') && params?.recordId) {
    pageItems.push((
      <Button
        title='Expense Forecasting'
        action={() => navigate({
          type: 'apex',
          page: 'KimbleOne__ActivityExpenseCategoryProfiles'
        }, { id: params.recordId || null })}
      />
    ));

    queryItems.push((
      <Button
        title='Assignments on Engagement'
        action={() => {
          const soql = SOQLBuilder.getQueryForAssignmentsByEngagement(params.recordId);
          navigator.clipboard.writeText(soql);
        }}
      />
    ), (
      <Button
        title='Time Entries on Engagement'
        action={() => {
          const soql = SOQLBuilder.getQueryForTimeEntriesByEngagement(params.recordId);
          navigator.clipboard.writeText(soql);
        }}
      />
    ));
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
              content: JSON.stringify(err) || 'getLogContent generic catch',
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
          content = JSON.stringify(logCopyResult);
        }
        result = (
          <div className={classString}>
            {icon}
            {content}
          </div>
        );
      }
      
      actionItems.push((
        <Button
          title='Copy Log Content'
          action={triggerContentCopy}
        />
      ), result);
    }
  }

  return actionItems.length > 0 || pageItems.length > 0 || queryItems.length > 0 ? (
    <div className="context-actions-layout">
      {actionItems.length > 0 && <ContextActionSection title='Actions' content={actionItems} />}
      {pageItems.length > 0 && <ContextActionSection title='Pages' content={pageItems} />}
      {queryItems.length > 0 && <ContextActionSection title='Query Snippets' content={queryItems} />}
    </div>
  ) : null;
};

export default ContextActions;
