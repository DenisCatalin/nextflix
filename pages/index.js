import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner/banner";
import NavBar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";
import {
  getVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
import useRedirectUser from "../utils/redirectUser";

// AIzaSyAdwnEJETkCUdRePnkFsjGNWtJ5xNp7mmo
export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const disneyVideos = await getVideos("disney trailer");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");
  const myVideos = await getVideos("denis catalin ktms");
  const popularVideos = await getPopularVideos();

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  return {
    props: {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      myVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  productivityVideos,
  travelVideos,
  myVideos,
  popularVideos,
  watchItAgainVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar username="Denis Catalin" />

        <Banner
          title="Clifford the red dog"
          subTitle="A very cute dog"
          imgUrl="/static/clifford.jpeg"
          videoId="4zH5iYM4wJo"
        />

        <div className={styles.sectionWrapper}>
          <SectionCards
            title="Watch It Again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Denis Catalin KTMS"
            videos={myVideos}
            size="small"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
