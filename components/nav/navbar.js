import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";

import { magic } from "../../lib/magic-client";

const NavBar = () => {
  const router = useRouter();

  const [username, setUsername] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(async () => {
    try {
      const { email, publicAddress } = await magic.user.getMetadata();
      console.log({ email, publicAddress });

      if (email) {
        setUsername(email);
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Can't retrieve email in NavBar", error);
    }
  }, []);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await magic.user.logout();
      console.log(await magic.user.isLoggedIn());
      setLoggedIn(false);
    } catch (err) {
      console.error("Something went wrong while logging out", err);
    }
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <a className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src="/static/netflix.svg"
              alt="netflix logo"
              width="128px"
              height="34px"
            />
          </div>
        </a>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{loggedIn ? username : "Login"}</p>
              <Image
                src="/static/expand_more.svg"
                alt="expand dropdown"
                width="24px"
                height="24px"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignOut}>
                    Sign Out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
