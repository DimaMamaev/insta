import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, CssBaseline, Typography } from "@material-ui/core";
import theme from "./theme";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import AuthProvider from "./auth";
import { client } from "./graphql/client";

class ErrorBoundry extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.log(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Typography component="h1" variant="h6" align="center">
          {" "}
          Oooops!!!! Something went wrong! Just try again later!{" "}
        </Typography>
      );
    }
    return this.props.children;
  }
}

ReactDOM.render(
  <ErrorBoundry>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </MuiThemeProvider>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </ErrorBoundry>,
  document.getElementById("root")
);
