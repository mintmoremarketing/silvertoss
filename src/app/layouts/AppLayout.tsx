import AOS from "aos";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      AOS.refreshHard();
    }, 0);

    if (!location.hash) {
      return () => {
        window.clearTimeout(refreshTimer);
      };
    }

    const scrollTimer = window.setTimeout(() => {
      const element = document.getElementById(location.hash.slice(1));

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(scrollTimer);
    };
  }, [location]);

  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
