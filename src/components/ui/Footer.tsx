import { Link, useLocation } from "react-router-dom";

import { routePaths } from "@/app/router/routePaths";

export function Footer() {
  const location = useLocation();

  return (
    <footer className="st-footer">
      <div className="st-footer__overlay" />

      <div className="st-footer__container">
        <div className="st-footer__grid">
          {/* LEFT SECTION */}
          <div className="st-footer__left">
            <Link
              className="st-footer__brand"
              to={{ pathname: "/", hash: "#aboutus" }}
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <img src="/assets/images/logo.webp" alt="Silvertoss Industries" />
            </Link>

            <h4 className="st-footer__headline">
              A Legacy of Evolution and Engineering
            </h4>

            <p className="st-footer__desc">
              Our commitment remains anchored in quality, innovation, and
              responsible practices, shaping solutions that meet the evolving
              demands of modern infrastructure and design.
            </p>

            {/* <div className="st-footer__social">
              <p className="st-footer__socialLabel">Social Media</p>
              <div className="st-footer__socialIcons">
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-whatsapp"></i></a>
                <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
              </div>
            </div> */}
          </div>

          {/* NAVIGATION */}
          <div className="st-footer__nav">
            <h5>Navigation</h5>
            <ul>
              <li>
                <Link to={{ pathname: "/", hash: "#aboutus" }}>About Us</Link>
              </li>
              <li>
                <Link to={{ pathname: "/", hash: routePaths.products }}>
                  Our Products
                </Link>
              </li>
              <li>
                <Link to={{ pathname: "/", hash: routePaths.process }}>
                  Manufacturing Process
                </Link>
              </li>
              <li>
                <Link to={{ pathname: "/", hash: routePaths.industries }}>
                  Industries Served
                </Link>
              </li>
              <li>
                <Link to={{ pathname: "/", hash: routePaths.media }}>
                  Media
                </Link>
              </li>
              <li>
                <Link to={{ pathname: "/", hash: routePaths.contact }}>
                  Contact Us
                </Link>
              </li>

              <li>
                <Link to={routePaths.investors} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Investors</Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="st-footer__contact">
            <div className="st-footer__contactItem">
              <i className="fa-solid fa-phone"></i>
              <div>
                <span>Phone</span>
                <a href="tel:03348017916">03348017916</a>
              </div>
            </div>

            <div className="st-footer__contactItem">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <span>Email</span>
                <a href="mailto:singhbros1@yahoo.co.in">
                  reach@silvertossindustries.com
                </a>
              </div>
            </div>

            <div className="st-footer__contactItem">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                {/* Updated label to reflect combined Registered Office and Factory */}
                <span>Registered Office &amp; Factory</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=179%2FD%2C%20N.T.%20Road%2C%20Dirghanga%2C%20Baidyabati%2C%20Hooghly%20-%20712222"
                  rel="noreferrer"
                  target="_blank"
                >
                  179/D, N.T. Road, Dirghanga, Baidyabati, Hooghly - 712222
                </a>
              </div>
            </div>

            <div className="st-footer__contactItem">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <span>Corporate Office</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Adventz%20Infinity%405%2C%20Sector%20V%2C%20Salt%20Lake%2C%20Kolkata%20-%20700091"
                  rel="noreferrer"
                  target="_blank"
                >
                  Adventz Infinity@5, Office no - 802, Block - BN5, Sector V, Saltlake, Kolkata, West Bengal 700091
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="st-footer__bottom">
          © 2026 Silvertoss Industries. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
