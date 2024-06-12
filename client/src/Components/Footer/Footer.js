import React from "react";
import "./Footer.css";
import images from "../../Resource/Images";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Footer() {
  return (
    <footer>
      <div className="footer  text-white">
        <div className="footer-main-container">
          {/* Logo and Social Icons */}
          <div className="logo-container">
            <div>
              <img src={images.evangadiLogoFooter} alt="Evangadi Logo" />
            </div>
            <div className="social-icons">
              <a href="#">
                <FacebookIcon />
              </a>
              <a href="#">
                <InstagramIcon />
              </a>
              <a href="#">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="left-side-wrapper">
            <div className="links">
              <h2>Useful Links</h2>
              <p className="text-xs font-light my-2">How it works</p>
              <p className="text-xs font-light my-2">Terms and Service</p>
              <p className="text-xs font-light my-2">Privacy and Policy</p>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <h2>Contact Info</h2>
              <p className="text-xs font-light my-2">Evangadi Networks</p>
              <p className="text-xs font-light my-2">support@gmail.com</p>
              <p className="text-xs font-light my-2">+1-202-386-2702</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
