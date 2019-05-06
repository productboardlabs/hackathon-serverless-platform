import React from "react";

export default () => (
  <header
    style={{
      background: "linear-gradient(135deg,#3c0684,#4642e9,#1da2c5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem"
    }}
  >
    <h1>
      <a
        href="/"
        style={{
          color: "white",

          textDecoration: "none"
        }}
      >
        Hacking Slack with
        <img
          src="https://www.productboard.com/wp-content/themes/productboard/public/images/logo-pb-white.svg"
          alt="productboard logo"
          style={{ margin: "0 0.5rem" }}
        />
      </a>
    </h1>
  </header>
);
