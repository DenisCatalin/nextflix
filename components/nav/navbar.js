import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles2 from "../../styles/Search.module.css";
import Modal from "react-modal";
Modal.setAppElement("#__next");
import { getVideos } from "../../lib/videos";
import SectionCards from "../card/section-cards";

import { magic } from "../../lib/magic-client";
import SearchIcon from "../icons/search-icon";

const NavBar = () => {
  const router = useRouter();

  const [username, setUsername] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [submittedContent, setSubmittedContent] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(async () => {
    try {
      const { email, issuer } = await magic.user.getMetadata();
      const didToken = await magic.user.getIdToken();
      console.log({ email, issuer });
      console.log({ didToken });

      if (email) {
        setUsername(email);
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Can't retrieve email in NavBar", error);
    }
  }, []);

  useEffect(async () => {
    const myVideos = await getVideos(submittedContent);
    setSearchResult(myVideos);
    console.log({ myVideos });
  }, [submittedContent]);

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

  const handleOnSearchButtonClick = () => {
    if (!searchContent) {
      setToggleSearch(!toggleSearch);
      setToggleModal(false);
    } else {
      setSubmittedContent(searchContent);
      setToggleModal(true);
    }
  };

  const handleOnChangeSearchInput = (e) => {
    setSearchContent(e.target.value);

    if (e.target.value === "") {
      setToggleModal(false);
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
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

        <Modal
          isOpen={toggleModal ? true : false}
          contentLabel="Example Modal"
          className={styles2.modal}
          // onRequestClose={() => {
          //   router.back();
          // }}
          overlayClassName={styles2.overlay}
        >
          <div className={styles2.container}>
            <h1>
              Related videos for{" "}
              <span className={styles2.searchSpan}>{submittedContent}</span>
            </h1>
            <div className={styles2.sectionWrapper}>
              <SectionCards
                videos={searchResult}
                size="small"
                shouldWrap
                shouldScale={false}
              />
            </div>
          </div>
        </Modal>

        <nav className={styles.navContainer}>
          <div className={styles.navButtonWrapper}>
            <div className={styles.navSearchWrapper}>
              <motion.button
                onClick={handleOnSearchButtonClick}
                className={toggleSearch ? styles.searchButton : null}
                animate={{
                  x: toggleSearch ? 0 : 170,
                }}
                transition={{ duration: 0.4 }}
              >
                <SearchIcon toggle={toggleSearch} />
              </motion.button>
              <motion.input
                type="text"
                animate={{
                  x: toggleSearch ? 0 : 10,
                  y: 0,
                  scale: toggleSearch ? 1 : 0,
                }}
                onChange={handleOnChangeSearchInput}
                transition={{ duration: toggleSearch ? 0.4 : 0 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleOnSearchButtonClick();
                  }
                }}
                className={styles.navSearchInput}
              />
            </div>

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
