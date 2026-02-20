import PropTypes from "prop-types";

// 🔵 ButtonPrimary Component
const ButtonPrimary = ({
  herf,
  target = '_self',
  label,
  icon,
  iconImg,
  classes = ""
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
    <button className={`btn btn-primary ${classes}`}>
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
  classes: PropTypes.string
};

// 🟠 ButtonOutline Component
const ButtonOutline = ({
  herf,
  target = '_self',
  label,
  icon,
  iconImg,
  classes = ""
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
    <button className={`btn btn-outline ${classes}`}>
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
  classes: PropTypes.string
};

// 🔄 Export both
export {
  ButtonPrimary,
  ButtonOutline
};
