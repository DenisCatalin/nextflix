import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send({ msg: "Forbidden" });
    } else {
      const { videoId } = req.method === "POST" ? req.body : req.query;
      if (videoId) {
        const userId = await verifyToken(token);
        const findVideo = await findVideoIdByUser(userId, videoId, token);

        const doesStatsExist = findVideo?.length > 0;

        if (req.method === "POST") {
          const { favourited, watched = true } = req.body;
          if (doesStatsExist) {
            const response = await updateStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            res.send({
              msg: "it works",
              data: response,
            });
          } else {
            const response = await insertStats(token, {
              favourited: 0,
              watched: true,
              userId,
              videoId,
            });
            res.send({
              data: response,
            });
          }
        } else {
          if (doesStatsExist) {
            res.send(findVideo);
          } else {
            res.status(404);
            res.send({ user: null, msg: "Video not found" });
          }
        }
      }
    }
  } catch (err) {
    res.status(500).send({ done: false, error: err?.message });
    console.error(err);
  }
}
