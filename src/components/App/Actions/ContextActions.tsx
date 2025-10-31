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
  const { navigate } = useNav();
  
  // Job Administration > Pending Jobs runner
  if (params?.apexPage == 'JobsPending') {
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
            page: 'JobsPending',
            redirect: true
          }, args)}
        />
      </div>
    );
  }

  // Activity Assignment
  if (params?.sObject == 'KimbleOne__ActivityAssignment__c' && params?.recordId) {
    const args = {
      id: params.recordId,
    };

    return (
      <div>
        <Button
          title='Open Assignment Usage Pattern'
          action={() => navigate({
            type: 'apex',
            page: 'KimbleOne__ActivityAssignmentRates'
          }, args)}
        />
      </div>
    );
  }

  // Delivery Engagement
  if (params?.sObject == 'KimbleOne__DeliveryGroup__c' && params?.recordId) {
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

  return null;
};

export default ContextActions;
