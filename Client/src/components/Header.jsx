import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../constants/navigation";


/* ======================================================
   Header
 ====================================================== */
const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleContactClick = (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate("/#contact");
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center z-40 bg-gradient-to-b from-zinc-900 to-zinc-900/0">
      <div className="max-w-screen-2xl w-full mx-auto px-4 items-center justify-between flex md:grid md:grid-cols-[1fr_3fr_1fr] md:px-6">

        <Link to="/" className="logo">
          <img src="/images/logo.svg" alt="Logo" width={40} height={40} />
        </Link>

        <div className="relative md:justify-self-center">
          <button
            className="menu-btn md:hidden"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <span className="material-symbols-rounded">
              {navOpen ? "close" : "menu"}
            </span>
          </button>

          <Navbar navOpen={navOpen} />
        </div>

        <a
          className='btn btn-secondary hidden md:flex ml-auto'
          href="#contact"
          onClick={handleContactClick}
        >
          Contact Me
          <img src="/images/callIcon.svg" alt="Call Icon" height={16} width={16} />
        </a>

      </div>
    </header>
  );
};

export default Header;

/* ======================================================
   Navbar
 ====================================================== */
const Navbar = ({ navOpen }) => {
  const activeBoxRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  const updateActiveBox = () => {
    const activeLink = document.querySelector(
      `.nav-link[data-section="${activeSection}"]`
    );

    if (!activeLink || !activeBoxRef.current) {
      if (activeBoxRef.current) activeBoxRef.current.style.opacity = "0";
      return;
    }

    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = activeLink;

    Object.assign(activeBoxRef.current.style, {
      top: `${offsetTop}px`,
      left: `${offsetLeft}px`,
      width: `${offsetWidth}px`,
      height: `${offsetHeight}px`,
      opacity: "1",
    });
  };

  useEffect(() => {
    updateActiveBox();
    window.addEventListener("resize", updateActiveBox);
    return () => window.removeEventListener("resize", updateActiveBox);
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      let current = activeSection;

      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 150) {
          current = section.id;
        }
      });

      setActiveSection((prev) => (prev !== current ? current : prev));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, item) => {
    if (item.isScroll) {
      e.preventDefault();
      const id = item.id;
      setActiveSection(id);

      if (window.location.pathname !== "/") {
        navigate("/#" + id);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`navbar ${navOpen ? "active" : ""}`}>
      {NAV_LINKS.filter(item => item.showInHeader).map((item) => {
        const { label, id, isScroll, path } = item;
        return isScroll ? (
          <a
            key={id}
            href={`#${id}`}
            data-section={id}
            onClick={(e) => handleNavClick(e, item)}
            className={`nav-link font-s-14 ${activeSection === id ? "active" : ""
              }`}
          >
            {label}
          </a>
        ) : (
          <Link
            key={id}
            to={path}
            className="nav-link font-s-14"
            data-section={id}
          >
            {label}
          </Link>
        );
      })}

      <div className="active-box" ref={activeBoxRef} />
    </nav>
  );
};

Navbar.propTypes = {
  navOpen: PropTypes.bool.isRequired,
};

