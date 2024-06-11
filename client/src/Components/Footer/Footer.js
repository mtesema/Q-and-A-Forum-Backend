import React from "react";
import logo from "../../../asset/evangadi-logo-footer.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Footer() {
  return (
    <footer>
      <div class="footer bg text-white">
        <div class="w-9/12 flex justify-between m-auto py-6">
          <div class="logo-container">
            <div>
              <img src="evangadi-logo-footer.png" alt="Evangadi Logo" />
            </div>
            <div class="social-icons">
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
          <div class="links">
            <h2>Useful Links</h2>
            <p class="text-xs font-light my-2">How it works</p>
            <p class="text-xs font-light my-2">Terms and Service</p>
            <p class="text-xs font-light my-2">Privacy and Policy</p>
          </div>
          <div class="contact-info">
            <h2>Contact Info</h2>
            <p class="text-xs font-light my-2">Evangadi Networks</p>
            <p class="text-xs font-light my-2">support@gmail.com</p>
            <p class="text-xs font-light my-2">+1-202-386-2702</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
