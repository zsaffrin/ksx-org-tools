import './Button.css';

interface ButtonProps {
  /** The text to display inside the Button */
  title?: string | null,
  /** The action to take when the Button is clicked */
  action?: () => boolean | void,
}

const Button = ({ title, action }: ButtonProps) => {
  return (
    <button
      className='button'
      type='button'
      onClick={action}
    >
      {title}
    </button>
  );
};

export default Button;
