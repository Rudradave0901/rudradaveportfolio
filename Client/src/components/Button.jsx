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
  disabled
}) => {
  const content = (
    <>
      {label}
      {iconImg ? (
        <img src={iconImg} alt="icon" className="" />
      ) : icon ? (
        <span className="material-symbols-rounded " aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  );

  return herf ? (
    <a href={herf} target={target} className={`btn btn-primary ${classes}`}>
      {content}
    </a>
  ) : (
    <button className={`btn btn-primary ${classes}`} onClick={onClick} disabled={disabled}>
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
  disabled
}) => {
  const content = (
    <>
      {label}
      {iconImg ? (
        <img src={iconImg} alt="icon" className="whiteImg" />
      ) : icon ? (
        <span className="material-symbols-rounded" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  );

  return herf ? (
    <a href={herf} target={target} className={`btn btn-outline ${classes}`}>
      {content}
    </a>
  ) : (
    <button className={`btn btn-outline ${classes}`} onClick={onClick} disabled={disabled}>
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
