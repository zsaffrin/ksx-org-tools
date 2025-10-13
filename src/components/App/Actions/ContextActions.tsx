import { constructUrlWithArgs, redirectPage } from '../../../utilities';
import { Button } from '../../ui';

interface ContextActionsProps {
  params?: {
    apexArgs?: object | null,
    apexPage?: string | null,
    domain?: string | null,
    url?: string | null,
  } | undefined,
}

const ContextActions = ({ params }: ContextActionsProps) => {
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

  return null;
};

export default ContextActions;
