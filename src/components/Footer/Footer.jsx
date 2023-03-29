import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" style={{ background: "linear-gradient(to top, #F6B352 0%, #FFC3A0 50%, #C48F65 100%)" }}>
      <a href="somelink">Internal news</a>
      <a href="somelink">Connect with us!</a>
      <p className="mbauto">Woof Paws</p>
    </div>
  );
};

export default Footer;