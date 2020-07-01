import React, { useState, useContext } from "react";
import { useLoginPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from "./signup";

function LoginPage() {
  const classes = useLoginPageStyles();
  const history = useHistory();
  const { register, handleSubmit, watch, formState } = useForm({
    mode: "onBlur",
  });
  const [showPW, setPWVisability] = useState(false);
  const typedPassword = Boolean(watch("password"));
  const { logInWithEmailAndPassword } = useContext(AuthContext);
  const client = useApolloClient();
  const [error, setError] = useState("");

  function togglePWVisability() {
    setPWVisability((prev) => !prev);
  }

  async function onSubmit({ login, password }) {
    try {
      setError("");
      if (!isEmail(login)) {
        login = await getUserEmail(login);
      }
      await logInWithEmailAndPassword(login, password);
      setTimeout(() => history.push("/"), 0);
    } catch (error) {
      handleErrorMessage(error);
    }
  }
  function handleErrorMessage(error) {
    if (error.code.includes("auth")) {
      setError(error.message);
    }
  }

  async function getUserEmail(login) {
    const variables = { login };
    const response = await client.query({
      query: GET_USER_EMAIL,
      variables,
    });
    console.log(response);

    const userEmail = response.data.users[0]?.email || "no@email.com";
    return userEmail;
  }

  return (
    <>
      <SEO title="login" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="login"
                fullWidth
                inputRef={register({
                  required: true,
                  minLength: 3,
                })}
                variant="filled"
                label="Username, email or phone"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                name="password"
                fullWidth
                inputRef={register({
                  required: true,
                  minLength: 6,
                })}
                InputProps={{
                  endAdornment: typedPassword && (
                    <InputAdornment>
                      <Button onClick={togglePWVisability}>
                        {" "}
                        {showPW ? "Hide" : "Show"}{" "}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                label="Password"
                type={showPW ? "text" : "password"}
                margin="dense"
                className={classes.textField}
                autoComplete="current-password"
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Log In
              </Button>
            </form>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <LoginWithFacebook color="secondary" iconColor="blue" />
            <AuthError error={error} />
            <Button fullWidth color="secondary">
              <Typography variant="caption"> Forgot password?</Typography>
            </Button>
          </Card>
          <Card className={classes.signUpCard}>
            <Typography align="right" variant="body2">
              Dont have an account?{" "}
            </Typography>
            <Link to="/accounts/emailsignup">
              <Button color="primary" className={classes.signUpButton}>
                Sign Up
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export function LoginWithFacebook({ color, iconColor, variant }) {
  const classes = useLoginPageStyles();
  const { logInWithGoogle } = useContext(AuthContext);
  const facebookIcon =
    iconColor === "blue" ? FacebookIconBlue : FacebookIconWhite;
  const [error, setError] = useState("");
  const history = useHistory();
  async function handleLogInWithGoogle() {
    try {
      setError("");
      await logInWithGoogle();
      setTimeout(() => history.push("/"), 0);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <Button
        onClick={handleLogInWithGoogle}
        fullWidth
        color={color}
        variant={variant}
      >
        <img
          src={facebookIcon}
          alt="facebook icon"
          className={classes.facebookIcon}
        />
        Log in with Facebook
      </Button>
      <AuthError error={error} />
    </>
  );
}

export default LoginPage;
