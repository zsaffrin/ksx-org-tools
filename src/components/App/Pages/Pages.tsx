import { useNav } from '../../../hooks';
import { Button } from '../../ui';
import PageSection from './PageSection';
import './Pages.css';

const appTargets = [
  { title: 'Home', target: { type: 'lightning', page: 'home' } },
  { title: 'Interface Type Dashboard', target: { type: 'apex', page: 'KimbleOne__InterfaceTypeDashboard' } },
  { title: 'Period Management', target: { type: 'n', page: 'KimbleOne__PeriodManagement' } },
  { title: 'Reference Data Home', target: { type: 'n', page: 'KimbleOne__ReferenceData' } },
];

const apexPageTargets = [
  { title: 'Event Classes', target: { type: 'object', sObject: 'KimbleOne__EventClass__c' } },
  { title: 'Job Administration', target: { type: 'apex', page: 'KimbleOne__JobAdministration' } },
  { title: 'Org-Wide Config', target: { type: 'apex', page: 'KimbleOne__ConfigurationSettings' } },
  { title: 'Scheduled Operations', target: { type: 'apex', page: 'KimbleOne__ScheduledOperations' } },
];

const setupTargets = [
  { title: 'Setup Home', target: { type: 'setup', page: 'SetupOneHome' } },
  { title: 'Apex Jobs', target: { type: 'setup', page: 'AsyncApexJobs' } },
  { title: 'Company Information', target: { type: 'setup', page: 'CompanyProfileInfo' } },
  { title: 'Debug Logs', target: { type: 'setup', page: 'ApexDebugLogs' } },
  { title: 'Grant LMA', target: { type: 'settings', page: 'GrantLoginAccess' } },
  { title: 'Installed Packages', target: { type: 'setup', page: 'ImportedPackage' } },
  { title: 'Scheduled Apex Jobs', target: { type: 'setup', page: 'ScheduledJobs' } },
  { title: 'My User Details', target: { type: 'settings', page: 'AdvancedUserDetails' } }
];

const Pages = () => {
  const { navigate } = useNav();

  const renderNodes = (
    targets: {
      title: string,
      target: {
        type: string,
        page?: string,
        sObject?: string,
      }
    }[]
  ) => targets.map(({ title, target }) => (
    <Button
      title={title}
      action={() => target && navigate(target)}
    />
  ));
  
  return (
    <>
      <PageSection title='App Pages' content={renderNodes(appTargets)} />
      <PageSection title='Kantata Admin' content={renderNodes(apexPageTargets)} />
      <PageSection title='Setup' content={renderNodes(setupTargets)} />
    </>
  );
};

export default Pages;
