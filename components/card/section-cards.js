import Card from "./card";
import Link from "next/link";
import styles from "./section-cards.module.css";
import cls from "classnames";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap = false } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, i) => {
          return (
            <Link href={`/video/${video.id}`}>
              <a>
                <Card
                  key={video.title}
                  id={i}
                  imgUrl={video.imgUrl}
                  size={size}
                />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
