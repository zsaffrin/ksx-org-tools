import { constructUrlWithArgs, openNewPage, redirectPage } from '../../../utilities';
import { Button } from '../../ui';

interface ContextActionsProps {
  params?: {
    domain?: string | null,
    pageType?: string | null,
    sObject?: string | null,
    recordId?: string | null,
    apexPage?: string | null,
    apexArgs?: { [key: string]: string | null } | null,
  }
}

const ContextActions = ({ params }: ContextActionsProps) => {
  // Job Administration > Pending Jobs runner
  if (params?.apexPage == 'JobsPending') {
    const targetUrlString: string | null = constructUrlWithArgs(
      `https://${params.domain}/apex/JobsPending`,
      { ...params.apexArgs, threads: 10 }
    );
    
    return (
      <div>
        <Button
          title='threads=10'
          action={() => redirectPage(targetUrlString)}
        />
      </div>
    );
  }

  // Activity Assignment
  if (params?.sObject == 'KimbleOne__ActivityAssignment__c' && params?.recordId) {
    return (
      <div>
        <Button
          title='Open Assignment Usage Pattern'
          action={() => openNewPage(params.domain, `/apex/KimbleOne__ActivityAssignmentRates?id=${params.recordId}`)}
        />
      </div>
    );
  }

  return null;
};

export default ContextActions;
