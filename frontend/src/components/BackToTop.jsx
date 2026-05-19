import { useEffect, useState } from "react";
import "../styles/BackToTop.css";


function BackToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > window.innerHeight) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!showButton) {
    return null;
  }

  return (
    <button className="back-to-top" onClick={scrollToTop}>
      ↑
    </button>
  );
}

export default BackToTop;