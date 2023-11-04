const express = require("express");
const {
  register,
  login,
  auth,
  getOtherUsers,
  getEventsByUserId,
  insertEventUnderUserId,
  getEventByUserIdAndEventId,
  updateEventByUserIdAndEventId,
  deleteEventByUserIdAndEventId,
} = require("../controllers/auth");
const { validateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth", validateToken, auth);
router.get("/users/exclude/:user_id", getOtherUsers);
router.get("/users/:user_id/events", getEventsByUserId);
router.post("/users/:user_id/events", insertEventUnderUserId);
router.get("/users/:user_id/events/:event_id", getEventByUserIdAndEventId);
router.put("/users/:user_id/events/:event_id", updateEventByUserIdAndEventId);
router.delete(
  "/users/:user_id/events/:event_id",
  deleteEventByUserIdAndEventId
);

module.exports = router;
