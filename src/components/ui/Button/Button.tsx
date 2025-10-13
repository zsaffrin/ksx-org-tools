import './Button.css';

interface ButtonProps {
  /** The text to display inside the Button */
  title?: string | null,
  /** The size of the button */
  size?: string | null,
  /** The action to take when the Button is clicked */
  action?: () => null | void,
}

const Button = ({ size, title, action }: ButtonProps) => {
  const buttonClasses: string[] = ['button'];

  if (size == 'small') {
    buttonClasses.push('button-small');
  }
  
  return (
    <button
      className={buttonClasses.join(' ')}
      type='button'
      onClick={action}
    >
      {title}
    </button>
  );
};

export default Button;
