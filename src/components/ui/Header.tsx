import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { routePaths } from "@/app/router/routePaths";

const imagesBase = `assets/images`;
// Not used: in static mode we don't need a base file URL.
// const appBase = "/";

const navItems = [
  { label: "About Us", href: "#aboutus" },
  // { label: "Directors", href: routePaths.leadership },
  { label: "Our Products", href: routePaths.products },
  { label: "Manufacturing Process", href: routePaths.process },
  { label: "Industries Served", href: routePaths.industries },
  { label: "Media", href: routePaths.media },
  { label: "Contact Us", href: routePaths.contact },

  { label: "Investors", href: routePaths.investors },
];

export function Header() {
  const location = useLocation();
  const currentRoute = `${location.pathname}${location.hash}`;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const clickScrollRef = useRef(false);
  const clickScrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const sectionNavItems = navItems.filter((item) =>
      item.href.startsWith("#"),
    );

    const getActiveLabelFromScroll = () => {
      if (window.scrollY < 80) return "Home";

      let currentLabel = "Home";
      const scrollMarker = window.scrollY + 130;

      sectionNavItems.forEach((item) => {
        const section = document.getElementById(item.href.slice(1));
        if (section && section.offsetTop <= scrollMarker) {
          currentLabel = item.label;
        }
      });

      return currentLabel;
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      if (location.pathname === "/") {
        if (clickScrollRef.current) {
          // Scroll is still in progress from a click — reschedule the settle timer
          clearTimeout(clickScrollTimeout.current);
          clickScrollTimeout.current = setTimeout(() => {
            clickScrollRef.current = false;
          }, 300);
        } else {
          setActiveItem(getActiveLabelFromScroll());
        }
      }
    };

    // 🔥 Handle route change active state
    if (location.pathname === "/") {
      if (location.hash) {
        const matched = navItems.find(
          (item) => item.href === currentRoute || item.href === location.hash,
        );
        setActiveItem(matched?.label || "Home");
      } else {
        setActiveItem("Home");
      }
    } else {
      const matched = navItems.find(
        (item) => item.href === currentRoute || item.href === location.pathname,
      );
      if (matched) {
        setActiveItem(matched.label);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentRoute, location]);

  // Close menu on resize
  useEffect(() => {
    const closeMenu = () => {
      if (window.innerWidth >= 992) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  const headerClassName = `navbar navbar-expand-lg silvertoss-header ${
    isScrolled ? "is-scrolled" : ""
  }`;

  return (
    <header className={headerClassName}>
      <div className="container-fluid silvertoss-header__container">
        {/* Logo */}
        <a
          className="navbar-brand silvertoss-header__brand"
          href={"/"}
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            src={
              isScrolled
                ? `${imagesBase}/black.webp`
                : `${imagesBase}/SILVERTOSS LOGO 1.png`
            }
            alt="Silvertoss Industries"
            className={`silvertoss-header__logo${
              isScrolled ? " silvertoss-header__logo--dark" : ""
            }`}
          />
        </a>

        {/* Toggler */}
        <button
          type="button"
          aria-controls="silvertoss-navbar"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          className={`silvertoss-header__toggler ${
            isMenuOpen ? "is-open" : ""
          }`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="silvertoss-header__toggler-line" />
          <span className="silvertoss-header__toggler-line" />
          <span className="silvertoss-header__toggler-line" />
        </button>

        {/* Menu */}
        <div
          id="silvertoss-navbar"
          className={`silvertoss-header__menu ${isMenuOpen ? "is-open" : ""}`}
        >
          <ul className="navbar-nav align-items-lg-center silvertoss-header__nav">
            {navItems.map((item) => {
              const isHash = item.href.startsWith("#");

              return (
                <li className="nav-item" key={item.label}>
                  <Link
                    className={`nav-link silvertoss-header__link ${
                      activeItem === item.label ? "is-active" : ""
                    }`}
                    to={isHash ? { pathname: "/", hash: item.href } : item.href}
                    onClick={() => {
                      setActiveItem(item.label);
                      setIsMenuOpen(false);
                      if (isHash) {
                        clickScrollRef.current = true;
                        clearTimeout(clickScrollTimeout.current);
                        clickScrollTimeout.current = setTimeout(() => {
                          clickScrollRef.current = false;
                        }, 1200);
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
