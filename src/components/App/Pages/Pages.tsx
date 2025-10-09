import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage } from '../../../utilities';
import './Pages.css';

const Pages = () => {
  const params = useUrlParams();

  const targets = [
    { title: 'Apex Jobs', target: '/lightning/setup/AsyncApexJobs/home' },
    { title: 'Company Information', target: '/lightning/setup/CompanyProfileInfo/home' },
    { title: 'Event Classes', target: '/lightning/o/KimbleOne__EventClass__c/home' },
    { title: 'Grant LMA', target: '/lightning/settings/personal/GrantLoginAccess/home' },
    { title: 'Installed Packages', target: '/lightning/setup/ImportedPackage/home' },
    { title: 'Interface Type Dashboard', target: '/apex/KimbleOne__InterfaceTypeDashboard' },
    { title: 'Job Administration', target: '/apex/KimbleOne__JobAdministration' },
    { title: 'Org-Wide Config', target: '/apex/KimbleOne__ConfigurationSettings' },
    { title: 'Reference Data', target: '/lightning/n/KimbleOne__ReferenceData' },
    { title: 'Scheduled Jobs', target: '/lightning/setup/ScheduledJobs/home' },
    { title: 'Scheduled Operations', target: '/apex/KimbleOne__ScheduledOperations' },
  ];

  const targetNodes = targets.map(({ title, target }) => (
    <button
      type='button'
      onClick={() => openNewPage(params.domain, target)}
    >
      {title}
    </button>
  ));
  
  return (
    <div className="pages-layout">
      {targetNodes}
    </div>
  );
};

export default Pages;
