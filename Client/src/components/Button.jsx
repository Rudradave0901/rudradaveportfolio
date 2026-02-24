import PropTypes from "prop-types";

// 🔵 ButtonPrimary Component
const ButtonPrimary = ({
  herf,
  target = '_self',
  label,
  icon,
  iconImg,
  classes = "",
  onClick,
  disabled,
  isLoading
}) => {
  const content = (
    <span className="flex items-center justify-center gap-2">
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {label}
      {!isLoading && (
        iconImg ? (
          <img src={iconImg} alt="icon" className="" />
        ) : icon ? (
          <span className="material-symbols-rounded" aria-hidden="true">
            {icon}
          </span>
        ) : null
      )}
    </span>
  );

  return herf ? (
    <a href={herf} target={target} className={`btn btn-primary ${classes} ${isLoading ? 'pointer-events-none opacity-80' : ''}`}>
      {content}
    </a>
  ) : (
    <button className={`btn btn-primary ${classes}`} onClick={onClick} disabled={disabled || isLoading}>
      {content}
    </button>
  );
};

ButtonPrimary.propTypes = {
  label: PropTypes.string.isRequired,
  herf: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.string,
  iconImg: PropTypes.string,
  classes: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

// 🟠 ButtonOutline Component
const ButtonOutline = ({
  herf,
  target = '_self',
  label,
  icon,
  iconImg,
  classes = "",
  onClick,
  disabled,
  isLoading
}) => {
  const content = (
    <span className="flex items-center justify-center gap-2">
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {label}
      {!isLoading && (
        iconImg ? (
          <img src={iconImg} alt="icon" className="whiteImg" />
        ) : icon ? (
          <span className="material-symbols-rounded" aria-hidden="true">
            {icon}
          </span>
        ) : null
      )}
    </span>
  );

  return herf ? (
    <a href={herf} target={target} className={`btn btn-outline ${classes} ${isLoading ? 'pointer-events-none opacity-80' : ''}`}>
      {content}
    </a>
  ) : (
    <button className={`btn btn-outline ${classes}`} onClick={onClick} disabled={disabled || isLoading}>
      {content}
    </button>
  );
};

ButtonOutline.propTypes = {
  label: PropTypes.string.isRequired,
  herf: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.string,
  iconImg: PropTypes.string,
  classes: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

// 🔄 Export both
export {
  ButtonPrimary,
  ButtonOutline
};
