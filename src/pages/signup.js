import React, { useContext, useState } from "react";
import { useSignUpPageStyles } from "../styles";
import { LoginWithFacebook } from "./login";
import SEO from "../components/shared/Seo";
import { Card, TextField, Button, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../auth";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";

function SignUpPage() {
  const classes = useSignUpPageStyles();
  const { register, handleSubmit, formState } = useForm({ mode: "onBlur" });
  const history = useHistory();
  const { signInwithEmailAndPassword } = useContext(AuthContext);

  function onSubmit(data) {
    console.log({ data });
  }

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
                  minLength: 3,
                  maxLength: 20,
                  pattern: /^[a-zA-Z0-9_.]*$/,
                })}
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

export default SignUpPage;
