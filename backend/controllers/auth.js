const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const queries = require("../query");
const generateDatabaseDateTime = require("./util/date");

const register = async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    mobile_phone,
    work_phone,
    home_phone,
    email,
    password,
    country_name,
  } = req.body;

  try {
    const encryptedPassword = bcrypt.hashSync(password, 8);
    const countryResult = await queries.selectOp(
      "id",
      "country",
      ["name"],
      [country_name]
    );
    countryId = countryResult[0].id;

    const userId = await queries.insertOp(
      "user",
      [
        "first_name",
        "middle_name",
        "last_name",
        "mobile_phone",
        "work_phone",
        "home_phone",
        "email",
        "password",
        "country_id",
        "role_id",
        "status_id",
        "created_on",
        "created_by",
        "modified_on",
        "modified_by",
        "row_version",
      ],
      [
        first_name,
        middle_name ? middle_name : null,
        last_name,
        mobile_phone,
        work_phone ? work_phone : null,
        home_phone ? home_phone : null,
        email,
        encryptedPassword,
        countryId,
        1,
        1,
        generateDatabaseDateTime(new Date()),
        1,
        generateDatabaseDateTime(new Date()),
        1,
        1,
      ]
    );
    res.status(200).json({ message: "User registered successfully", userId });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await queries.selectOp("*", "user", ["email"], [email]);
    const user = userResult[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.first_name,
        email: user.email,
      },
      process.env.API_SECRET,
      {
        expiresIn: 86400,
      }
    );

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.first_name,
        email: user.email,
      },
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const auth = (req, res) => {
  res.json(req.user);
};

const getEventsByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const result = await queries.selectOp(
      "id, title, start_time, end_time",
      "event",
      ["user_id"],
      [userId]
    );
    res.status(200).json({ events: result });
  } catch (error) {
    console.error("Error fetching events for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOtherUsers = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const result = await queries.customOp(
      `SELECT id, first_name FROM "${process.env.SCHEMA}".user WHERE id != ${userId}`
    );
    res.status(200).json({ users: result });
  } catch (error) {
    console.error("Error fetching other users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const insertEventUnderUserId = async (req, res) => {
  const userId = req.params.user_id;
  const {
    title,
    event_date,
    start_time,
    end_time,
    invitees,
    reminder_interval,
  } = req.body;

  try {
    const eventId = await queries.insertOp(
      "event",
      [
        "title",
        "event_date",
        "start_time",
        "end_time",
        "reminder_interval",
        "created_on",
        "created_by",
        "modified_on",
        "modified_by",
        "row_version",
        "user_id",
        "invitees",
      ],
      [
        title,
        event_date,
        start_time,
        end_time,
        reminder_interval,
        generateDatabaseDateTime(new Date()),
        1,
        generateDatabaseDateTime(new Date()),
        1,
        1,
        userId,
        invitees,
      ]
    );
    res
      .status(200)
      .json({ message: "Event inserted successfully under user", eventId });
  } catch (error) {
    console.error("Error inserting event under user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEventByUserIdAndEventId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const eventId = req.params.event_id;

    const result = await queries.selectOp(
      "*",
      "event",
      ["user_id", "id"],
      [userId, eventId]
    );
    res.status(200).json({ event: result });
  } catch (error) {
    console.error("Error fetching event for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateEventByUserIdAndEventId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const eventId = req.params.event_id;
    const {
      title,
      event_date,
      start_time,
      end_time,
      invitees,
      reminder_interval,
    } = req.body;

    const result = await queries.updateOp(
      "event",
      [
        "title",
        "event_date",
        "start_time",
        "end_time",
        "reminder_interval",
        "created_on",
        "created_by",
        "modified_on",
        "modified_by",
        "row_version",
        "user_id",
        "invitees",
      ],
      [
        title,
        event_date,
        start_time,
        end_time,
        reminder_interval,
        generateDatabaseDateTime(new Date()),
        1,
        generateDatabaseDateTime(new Date()),
        1,
        1,
        userId,
        invitees,
      ],
      ["user_id", "id"],
      [userId, eventId]
    );
    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteEventByUserIdAndEventId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const eventId = req.params.event_id;

    const result = await queries.deleteOp(
      "event",
      ["id", "user_id"],
      [eventId, userId]
    );
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  auth,
  getOtherUsers,
  getEventsByUserId,
  insertEventUnderUserId,
  getEventByUserIdAndEventId,
  updateEventByUserIdAndEventId,
  deleteEventByUserIdAndEventId,
};
