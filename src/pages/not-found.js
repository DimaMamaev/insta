import React from "react";
import Layout from "../components/shared/Layout.jsx";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Layout title="Page not found" marginTop={120}>
      <Typography variant="h5" align="center" paragraph>
        К сожалению, эта страница недоступна.
      </Typography>
      <Typography align="center">
        Возможно, вы воспользовались недействительной ссылкой или страница была
        удалена.{" "}
        <Link to="/">
          <Typography color="primary" component="span">
            Назад в Insta.
          </Typography>
        </Link>
      </Typography>
    </Layout>
  );
}

export default NotFoundPage;
