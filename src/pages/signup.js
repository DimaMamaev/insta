import React, { useContext, useState } from "react";
import { useSignUpPageStyles } from "../styles";
import { LoginWithFacebook } from "./login";
import SEO from "../components/shared/Seo";
import {
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../auth";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import {
  HighlightOffRounded,
  CheckCircleOutlineOutlined,
} from "@material-ui/icons";
import { useApolloClient } from "@apollo/react-hooks";
import { CHECK_USERNAME_IS_TAKEN } from "../graphql/queries";

function SignUpPage() {
  const classes = useSignUpPageStyles();
  const { register, handleSubmit, formState, errors } = useForm({
    mode: "onBlur",
  });
  const history = useHistory();
  const { signInwithEmailAndPassword } = useContext(AuthContext);
  const [error, setError] = useState("");
  const client = useApolloClient();

  async function onSubmit(data) {
    try {
      setError("");
      await signInwithEmailAndPassword(data);

      setTimeout(() => history.push("/explore"), 0);
    } catch (error) {
      console.log("Registration error", error);
      handleErrorMessage(error);
    }
  }
  function handleErrorMessage(error) {
    if (error.message.includes("users_username_key")) {
      setError("Username is already taken ");
    } else if (error.code.includes("auth")) {
      setError(error.message);
    }
  }
  async function validateUsername(username) {
    const variables = { username };
    const check = await client.query({
      query: CHECK_USERNAME_IS_TAKEN,
      variables,
    });

    const checkValid = check.data.users.length === 0;
    return checkValid;
  }
  const errorIcon = (
    <InputAdornment>
      <HighlightOffRounded style={{ color: "red", width: 30, height: 30 }} />
    </InputAdornment>
  );
  const validIcon = (
    <InputAdornment>
      <CheckCircleOutlineOutlined
        style={{ color: "green", width: 30, height: 30 }}
      />
    </InputAdornment>
  );

  return (
    <div style={{ marginTop: 20 }}>
      <SEO title="sign up" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <div className={classes.cardHeader} />
            <Typography className={classes.cardHeaderSubHeader}>
              Sign up to see photos and videos from your friends
            </Typography>
            <LoginWithFacebook
              color="primary"
              iconColor="white"
              variant="contained"
            />
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="email"
                inputRef={register({
                  required: true,
                  validate: (input) => isEmail(input),
                })}
                InputProps={{
                  endAdornment: errors.email
                    ? errorIcon
                    : formState.touched.email && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Email"
                margin="dense"
                type="email"
                className={classes.textField}
              />
              <TextField
                name="name"
                inputRef={register({
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
                InputProps={{
                  endAdornment: errors.name
                    ? errorIcon
                    : formState.touched.name && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                name="username"
                inputRef={register({
                  required: true,
                  validate: async (input) => await validateUsername(input),
                  minLength: 3,
                  maxLength: 20,
                  pattern: /^[a-zA-Z0-9_.]*$/,
                })}
                InputProps={{
                  endAdornment: errors.username
                    ? errorIcon
                    : formState.touched.username && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                name="password"
                inputRef={register({
                  required: true,
                  minLength: 6,
                })}
                InputProps={{
                  endAdornment: errors.password
                    ? errorIcon
                    : formState.touched.password && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Password"
                type="password"
                margin="dense"
                className={classes.textField}
                autoComplete="new-password"
              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
                disabled={!formState.isValid || formState.isSubmitting}
              >
                Sign up
              </Button>
            </form>
            <AuthError error={error} />
          </Card>
          <Card className={classes.loginCard}>
            <Typography align="right" variant="body2">
              Have an account?{" "}
            </Typography>
            <Link to="/accounts/login">
              <Button color="primary" className={classes.loginButton}>
                Log in
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </div>
  );
}

export function AuthError({ error }) {
  return (
    Boolean(error) && (
      <Typography
        align="center"
        gutterBottom
        variant="body2"
        style={{ color: "red" }}
      >
        {error}
      </Typography>
    )
  );
}

export default SignUpPage;
