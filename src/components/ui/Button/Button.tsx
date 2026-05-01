import { useAppState } from '../../../hooks';
import { FaRegCopy } from 'react-icons/fa';
import './Button.css';

interface ButtonProps {
  /** The text to display inside the Button */
  title?: string | null,
  /** The size of the button */
  size?: string | null,
  /** The action to take when the Button is clicked */
  action?: () => null | void,
  /** Toggle to include a secondary button to copy provided value to clipboard */
  withCopy?: string | null,
}

const Button = ({ size, title, action, withCopy }: ButtonProps) => {
  const appState = useAppState();
  const buttonClasses: string[] = ['button'];

  if (size == 'small') {
    buttonClasses.push('button-small');
  }
  
  return (
    <div className='button-wrap'>
      <button
        className={buttonClasses.join(' ')}
        type='button'
        onClick={action}
      >
        {title}
      </button>
      {withCopy && appState?.showCopyLinks && (
        <button
          className={buttonClasses.join(' ')}
          type='button'
          onClick={() => navigator.clipboard.writeText(withCopy)}
        >
          <FaRegCopy style={{ verticalAlign: 'middle'}}/>
        </button>
        
      )}
    </div>
  );
};

export default Button;
