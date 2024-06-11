import React from "react";

import Footer from "./Footer/Footer";

function Includes({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Includes;
