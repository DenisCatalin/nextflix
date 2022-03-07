export const getCommonVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const BASE_URL = "youtube.googleapis.com/youtube/v3";
    const response = await fetch(
      `https://${BASE_URL}/${url}&maxResults=1&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    if (data?.error) {
      // console.error("YT API error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        title: snippet?.title,
        imgUrl: snippet?.thumbnails.high.url,
        id,
        description: snippet?.description,
        publishTime: snippet?.publishedAt,
        channelTitle: snippet?.channelTitle,
        statistics: item.statistics
          ? item.statistics
          : { viewCount: 0, likeCount: 0 },
      };
    });
  } catch (err) {
    // console.error("Something went wrong", err);
    return [];
  }
};

export const getVideos = async (searchQuery) => {
  const URL = `search?part=snippet&maxResults=25&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = async () => {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=RO";
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = async (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};
