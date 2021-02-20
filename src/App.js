import { useEffect, useState } from "react";
import "./App.css";

import Post from "./components/Post/Post";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import { auth, db } from "./firebase";

import { Button, makeStyles, Modal, Input, Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "300px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  // useeffect -> runs a piece of code ased on specific conditions
  // useeffect a front end listener which fires on changes of the dependencies
  useEffect(() => {
    // the login state is kept persistant with onAuthStateChanged b/c cookie tracking & survives refreshing.
    //  this is a back-end listeners which fires on back-end user change.

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in..
        console.log(authUser);
        setUser(authUser);

        if (authUser?.displayName) {
          // dont update the username
        } else {
          // if just created a profile, update the username
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out..
        setUser(null);
      }
    });

    return () => {
      // perform some clean-up actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    // execute code here once..
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        setPosts(
          snap?.docs.map((doc) => ({
            id: doc?.id,
            post: doc?.data(),
          }))
        );
      });
  }, []);

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser?.user?.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error?.message));

    setOpen(false);
  };

  return (
    <div className="app">
      {/* SIGN-IN MODAL */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {/* SIGN-UP MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      {/* HEADER COMPONENT */}
      <div className="app__header">
        <img
          className="app__headerLogo"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
        <div className="app__headerSearch">
          <input type="text" placeholder="Search" />
          <SearchIcon />
        </div>
        {user ? (
          <div className="app__headerRight">
            <Button onClick={() => auth.signOut()}>Logout</Button>
            <Avatar
              className="app__headerAvatar"
              alt={user?.displayName}
              src="/static/images/avatar/1.jpg"
            />
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign-In</Button>
            <Button onClick={() => setOpen(true)}>Sign-up</Button>
          </div>
        )}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user?.displayName} />
      ) : (
        <h3 align="center">Sorry, You need to login to upload..</h3>
      )}

      <div className="app__posts">
        <div className="app__postleft">
          {posts.map(({ id, post }) => (
            <Post
              user={user}
              key={id}
              postId={id}
              imgUrl={post?.imgUrl}
              username={post?.username}
              caption={post?.caption}
            />
          ))}
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
