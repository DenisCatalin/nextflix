import Image from "next/image";
import styles from "./card.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
import cls from "classnames";

const Card = (props) => {
  const {
    imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1159&q=80",
    size = "medium",
    id,
    shouldScale = true,
  } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const handleOnError = () => {
    setImgSrc(imgSrc);
  };

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const hover = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  const tap = id === 0 ? { scale: 0.9 } : { scale: 1.0 };

  return (
    <div className={styles.container}>
      <motion.div
        whileHover={{ ...hover }}
        whileTap={{ ...tap }}
        className={cls(styles.imgMotionWrapper, classMap[size])}
      >
        <Image
          src={imgUrl}
          onError={handleOnError}
          alt="Card"
          layout="fill"
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  );
};

export default Card;
