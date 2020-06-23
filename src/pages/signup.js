import React, { useContext, useState } from "react";
import { useSignUpPageStyles } from "../styles";
import { LoginWithFacebook } from "./login";
import SEO from "../components/shared/Seo";
import { Card, TextField, Button, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../auth";
import { useForm } from "react-hook-form";

function SignUpPage() {
  const classes = useSignUpPageStyles();
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const { signInwithEmailAndPassword } = useContext(AuthContext);

  const [values, setValues] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
  });
  function onChangeHandler(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }
  async function onSubmitHandler(event) {
    event.preventDefault();
    await signInwithEmailAndPassword(values);
    history.push("/");
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
            <form onSubmit={onSubmitHandler}>
              <TextField
                name="email"
                fullWidth
                variant="filled"
                label="Email"
                margin="dense"
                type="email"
                className={classes.textField}
              />
              <TextField
                name="name"
                fullWidth
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                name="username"
                fullWidth
                variant="filled"
                label="Username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                name="password"
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
