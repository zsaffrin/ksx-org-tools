import { useNav } from '../../../hooks';
import { Button } from '../../ui';
import './Pages.css';

const Pages = () => {
  const { navigate } = useNav();

  const targets = [
    { title: 'Home', target: { type: 'lightning', page: 'home' } },
    { title: 'Setup', target: { type: 'setup', page: 'SetupOneHome' } },
    { title: 'Apex Jobs', target: { type: 'setup', page: 'AsyncApexJobs' } },
    { title: 'Company Information', target: { type: 'setup', page: 'CompanyProfileInfo' } },
    { title: 'Event Classes', target: { type: 'object', sObject: 'KimbleOne__EventClass__c' } },
    { title: 'Grant LMA', target: { type: 'settings', page: 'GrantLoginAccess' } },
    { title: 'Installed Packages', target: { type: 'setup', page: 'ImportedPackage' } },
    { title: 'Interface Type Dashboard', target: { type: 'apex', page: 'KimbleOne__InterfaceTypeDashboard' } },
    { title: 'Job Administration', target: { type: 'apex', page: 'KimbleOne__JobAdministration' } },
    { title: 'Org-Wide Config', target: { type: 'apex', page: 'KimbleOne__ConfigurationSettings' } },
    { title: 'Reference Data', target: { type: 'n', page: 'KimbleOne__ReferenceData' } },
    { title: 'Scheduled Apex Jobs', target: { type: 'setup', page: 'ScheduledJobs' } },
    { title: 'Scheduled Operations', target: { type: 'apex', page: 'KimbleOne__ScheduledOperations' } },
    { title: 'User Details', target: { type: 'settings', page: 'AdvancedUserDetails' } }
  ];

  const targetNodes = targets.map(({ title, target }) => (
    <Button
      title={title}
      action={() => navigate(target)}
    />
  ));
  
  return (
    <div className="two-column-grid">
      {targetNodes}
    </div>
  );
};

export default Pages;
