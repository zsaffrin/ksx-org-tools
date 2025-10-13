import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage } from '../../../utilities';
import { Button } from '../../ui';
import './Pages.css';

const Pages = () => {
  const params = useUrlParams();

  const targets = [
    { title: 'Home', target: '/lightning/page/home' },
    { title: 'Setup', target: '/lightning/setup/SetupOneHome/home' },
    { title: 'Apex Jobs', target: '/lightning/setup/AsyncApexJobs/home' },
    { title: 'Company Information', target: '/lightning/setup/CompanyProfileInfo/home' },
    { title: 'Event Classes', target: '/lightning/o/KimbleOne__EventClass__c/home' },
    { title: 'Grant LMA', target: '/lightning/settings/personal/GrantLoginAccess/home' },
    { title: 'Installed Packages', target: '/lightning/setup/ImportedPackage/home' },
    { title: 'Interface Type Dashboard', target: '/apex/KimbleOne__InterfaceTypeDashboard' },
    { title: 'Job Administration', target: '/apex/KimbleOne__JobAdministration' },
    { title: 'Org-Wide Config', target: '/apex/KimbleOne__ConfigurationSettings' },
    { title: 'Reference Data', target: '/lightning/n/KimbleOne__ReferenceData' },
    { title: 'Scheduled Apex Jobs', target: '/lightning/setup/ScheduledJobs/home' },
    { title: 'Scheduled Operations', target: '/apex/KimbleOne__ScheduledOperations' },
    { title: 'User Details', target: '/lightning/settings/personal/AdvancedUserDetails/home' },
  ];

  const targetNodes = targets.map(({ title, target }) => (
    <Button
      title={title}
      action={() => openNewPage(params.domain, target)}
    />
  ));
  
  return (
    <div className="two-column-grid">
      {targetNodes}
    </div>
  );
};

export default Pages;
