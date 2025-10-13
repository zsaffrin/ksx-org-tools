import { useNav } from '../../../hooks';
import { Button } from '../../ui';

interface ContextActionsProps {
  params?: {
    baseUrl?: string | null,
    domain?: string | null,
    pageType?: string | null,
    sObject?: string | null,
    recordId?: string | null,
    apexPage?: string | null,
    apexArgs?: { [key: string]: string | null } | null,
  }
}

const ContextActions = ({ params }: ContextActionsProps) => {
  const { openNew, redirectTo } = useNav();
  
  // Job Administration > Pending Jobs runner
  if (params?.apexPage == 'JobsPending') {
    const targetPath = 'apex/JobsPending';
    const args = {
      ...params.apexArgs,
      threads: 10,
    };
    
    return (
      <div>
        <Button
          title='threads=10'
          action={() => redirectTo(targetPath, args)}
        />
      </div>
    );
  }

  // Activity Assignment
  if (params?.sObject == 'KimbleOne__ActivityAssignment__c' && params?.recordId) {
    const targetPath = 'apex/KimbleOne__ActivityAssignmentRates';
    const args = {
      id: params.recordId,
    };

    return (
      <div>
        <Button
          title='Open Assignment Usage Pattern'
          action={() => openNew(targetPath, args)}
        />
      </div>
    );
  }

  return null;
};

export default ContextActions;
