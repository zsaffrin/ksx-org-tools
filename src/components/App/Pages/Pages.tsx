import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage } from '../../../utilities';
import './Pages.css';

const Pages = () => {
  const params = useUrlParams();

  const targetList = [
    { title: 'Job Administration', target: '/apex/KimbleOne__JobAdministration' },
    { title: 'Apex Jobs', target: '/lightning/setup/AsyncApexJobs/home' },
    { title: 'Scheduled Jobs', target: '/lightning/setup/ScheduledJobs/home' },
    { title: 'Event Classes', target: '/lightning/o/KimbleOne__EventClass__c/home' },
    { title: 'Reference Data', target: '/lightning/n/KimbleOne__ReferenceData' },
    { title: 'Org-Wide Config', target: '/apex/KimbleOne__ConfigurationSettings' },
    { title: 'Scheduled Operations', target: '/apex/KimbleOne__ScheduledOperations' },
    { title: 'Installed Packages', target: '/lightning/setup/ImportedPackage/home' },
    { title: 'Company Information', target: '/lightning/setup/CompanyProfileInfo/home' },
    { title: 'Grant LMA', target: '/lightning/settings/personal/GrantLoginAccess/home' },
    { title: 'Interface Type Dashboard', target: '/apex/KimbleOne__InterfaceTypeDashboard' },
  ];

  const targetNodes = targetList.map(({ title, target }) => (
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
