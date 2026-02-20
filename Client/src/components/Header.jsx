import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Static data
// import { NAV_ITEMS } from "../data/AllDataArray";

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Work", id: "work" },
  { label: "Resume", id: "resume" },
  {
    label: "Contact",
    id: "contact",
    className: "md:!hidden", // Mobile-only link
  },
];

/* ======================================================
   Header
====================================================== */
const Header = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-40 flex items-center bg-gradient-to-b from-zinc-900 to-zinc-900/0">
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-6 flex items-center justify-between md:grid md:grid-cols-[1fr_3fr_1fr]">

        <a href="/" className="logo">
          <img src="/images/logo.svg" alt="Logo" width={40} height={40} />
        </a>

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

        <a href="#contact" className="btn btn-secondary hidden md:flex ml-auto">
          Contact Me
          <img src="/images/callIcon.svg" alt="Call" width={16} height={16} />
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

  const updateActiveBox = () => {
    const activeLink = document.querySelector(
      `.nav-link[data-section="${activeSection}"]`
    );

    if (!activeLink || !activeBoxRef.current) {
      activeBoxRef.current.style.opacity = "0";
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
      let current = "home";

      document.querySelectorAll("section[id]").forEach((section) => {
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

  const handleNavClick = (e) => {
    e.preventDefault();
    const id = e.currentTarget.dataset.section;

    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${navOpen ? "active" : ""}`}>
      {NAV_ITEMS.map(({ label, id, className }) => (
        <a
          key={id}
          href={`#${id}`}
          data-section={id}
          onClick={handleNavClick}
          className={`nav-link font-s-14 ${className || ""} ${
            activeSection === id ? "active" : ""
          }`}
        >
          {label}
        </a>
      ))}

      <div className="active-box" ref={activeBoxRef} />
    </nav>
  );
};

Navbar.propTypes = {
  navOpen: PropTypes.bool.isRequired,
};
