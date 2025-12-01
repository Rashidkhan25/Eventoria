// Core modules
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// External libraries
const Razorpay = require("razorpay");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

// App initialization
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Database Models
const User = require("./models/User");
const CommunityMember = require("./models/Members");
const CommunityChat = require("./models/Chat");

// Firebase Admin
const admin = require("firebase-admin");

// Firebase Initialization
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
});

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Online users (memory only)
let onlineUsers = {};

// Socket.io Events
io.on("connection", socket => {

  socket.on("joinRoom", async (eventId) => {
    socket.join(eventId);

    const oldMessages = await CommunityChat.find({ eventId }).sort({ createdAt: 1 });
    socket.emit("loadOldMessages", oldMessages);

    let record = await CommunityMember.findOne({ eventId });
    if (!record) {
      record = await CommunityMember.create({ eventId, members: [] });
    }

    socket.emit("updateMembers", record.members);
  });

  socket.on("userJoinedCommunity", async ({ eventId, username }) => {

  eventId = String(eventId);
  let record = await CommunityMember.findOne({ eventId });

  if (!record) {
    record = await CommunityMember.create({ eventId, members: [] });
  }

  if (!record.members.includes(username)) {
    record.members.push(username);
    await record.save();
  }

  io.to(eventId).emit("updateMembers", record.members);

    if (!onlineUsers[eventId]) onlineUsers[eventId] = [];
    if (!onlineUsers[eventId].includes(username)) {
      onlineUsers[eventId].push(username);
    }

    io.to(eventId).emit("updateOnlineUsers", onlineUsers[eventId]);

    socket.on("disconnect", () => {
      if (onlineUsers[eventId]) {
        onlineUsers[eventId] = onlineUsers[eventId].filter(u => u !== username);
        io.to(eventId).emit("updateOnlineUsers", onlineUsers[eventId]);
      }
    });
  });

  socket.on("sendMessage", async msg => {
    await CommunityChat.create(msg);
    io.to(msg.eventId).emit("receiveMessage", msg);
  });

  socket.on("typing", ({ eventId, username }) => {
    socket.to(eventId).emit("showTyping", username);
  });

});

// Import event data
const {
  upcomingEvents,
  nearbyEvents,
  featuredEvents,
} = require("./data/eventsData");

const allEvents = [...upcomingEvents, ...nearbyEvents, ...featuredEvents];

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public Folder
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Routes
app.get("/", (req, res) => res.render("loading"));
app.get("/home", (req, res) => res.render("index", { session: req.session }));
app.get("/contact", (req, res) => res.render("contact-us", { session: req.session }));

// Events Route
app.get("/events", (req, res) => {
  res.render("events", {
    trending: upcomingEvents,
    topPicks: nearbyEvents,
    newReleases: featuredEvents,
    session: req.session,
  });
});

// Event Description
app.get("/event/:id", (req, res) => {
  const event = allEvents.find((ev) => ev.id === req.params.id);
  if (!event) return res.status(404).send("Event not found");

  res.render("description", { event, session: req.session });
});

// Ticket Page
app.get("/ticket/:eventId", async (req, res) => {
  const event = allEvents.find((ev) => ev.id === req.params.eventId);
  if (!event) return res.status(404).send("Event not found");
  if (!req.session.loggedIn) return res.redirect("/userlogin");

  const ticketId = Date.now().toString();
  const qrData = `EVENTORIA_TICKET_${ticketId}_${req.session.userEmail}`;
  const qrCode = await QRCode.toDataURL(qrData);

  res.render("ticket-download", {
    event,
    ticketId,
    user: { username: req.session.username, email: req.session.userEmail },
    qrCode,
  });
});

// PDF Download Route
app.get("/download-pdf/:ticketId", async (req, res) => {
  if (!req.session.loggedIn) return res.redirect("/userlogin");

  const ticketId = req.params.ticketId;
  const user = {
    username: req.session.username,
    email: req.session.userEmail,
  };

  const qrData = `EVENTORIA_TICKET_${ticketId}_${user.email}`;
  const qrImage = await QRCode.toDataURL(qrData);

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=ticket-${ticketId}.pdf`);
  doc.pipe(res);

  doc.fontSize(28).fillColor("#0035ff").text("EVENTORIA PASS", { align: "center" }).moveDown(1);
  doc.fillColor("black").fontSize(16);
  doc.text(`Name: ${user.username}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Ticket ID: ${ticketId}`);
  doc.moveDown(1);

  doc.fontSize(18).fillColor("black").text("Event Details", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(16);
  doc.text(`Event: ${req.query.title || "Event"}`);
  doc.text(`Tagline: ${req.query.tagline || ""}`);
  doc.moveDown(1);

  const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
  doc.image(qrBuffer, { width: 180, align: "center" });

  doc.end();
});

// Community Routes
app.get("/community", (req, res) => {
  res.render("community", { allEvents, session: req.session });
});

app.get("/community/:eventId", (req, res) => {
  const event = allEvents.find(e => e.id === req.params.eventId);
  if (!event) return res.status(404).send("Event not found");

  res.render("community-chat", { event, messages: [], session: req.session });
});

// Authentication Routes
app.get("/usersignup", (req, res) => res.render("signupPage"));
app.get("/userlogin", (req, res) => res.render("loginPage"));

// Firebase Login Route
app.post("/sessionLogin", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.json({ success: false, message: "Missing ID Token" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      user = await new User({
        username: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        photo: decoded.picture || "/images/default-profile.jpg",
      }).save();
    }

    req.session.loggedIn = true;
    req.session.username = user.username;
    req.session.userEmail = user.email;

    res.json({ success: true });

  } catch (err) {
    console.error("Firebase Token Error:", err);
    res.json({ success: false, message: "Invalid Token" });
  }
});

// Razorpay Order Route
app.post("/create-order", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ error: "NOT_LOGGED_IN" });
  }

  const { amount, eventId } = req.body;
  if (!amount || !eventId) {
    return res.status(400).json({ error: "Amount and Event ID are required" });
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${eventId}_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Razorpay order failed", details: err });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/home"));
});

// Start Server
http.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
