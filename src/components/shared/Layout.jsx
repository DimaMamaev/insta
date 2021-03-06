import React from "react";
import { useLayoutStyles } from "../../styles";
import SEO from "../shared/Seo";
import NavBar from "../shared/Navbar";

function Layout({ children, title, marginTop = 60, minimal = false }) {
  const classes = useLayoutStyles();

  return (
    <section className={classes.section}>
      <SEO title={title} />
      <NavBar minimal={minimal} />
      <main className={classes.main} style={{ marginTop }}>
        <section className={classes.childrenWrapper}>
          <div className={classes.children}>{children}</div>
        </section>
      </main>
    </section>
  );
}

export default Layout;
