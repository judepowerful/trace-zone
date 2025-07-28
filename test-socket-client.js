const { io } = require("socket.io-client");
const axios = require("axios");

// 🔧 配置区
const userId = "27b09826-1254-4ee0-a6eb-b8f0d3b8d184";
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyN2IwOTgyNi0xMjU0LTRlZTAtYTZlYi1iOGYwZDNiOGQxODQiLCJpYXQiOjE3NTE3ODk2NTQsImV4cCI6MTc1NDM4MTY1NH0.gvGqDXKCQKw0bVafHxYRI67cxwdeMxCGEF8p2yA4c-o";
const spaceId = "686d3df25051322962d7f6ef";

const location = {
  latitude: 34.6937,
  longitude: 135.5023,
  city: "大阪市",
  district: "市中心"
};

// 🔌 初始化 socket
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  extraHeaders: {
    "x-user-id": userId,
    "authorization": token
  }
});

// 🔥 连接后行为
socket.on("connect", async () => {
  console.log("✅ Connected to server as", socket.id);

  socket.emit("join-space", { spaceId });
  console.log("🚀 Sent join-space");

  try {
    await axios.post("http://localhost:5000/api/spaces/report-location", location, {
      headers: {
        "x-user-id": userId,
        "authorization": token
      }
    });
    console.log("📍 Reported location via HTTP:", location);
  } catch (err) {
    console.error("❌ Failed to report location:", err.response?.data || err);
  }

  setTimeout(() => {
    socket.emit("feed-cat", { spaceId });
    console.log("🍖 Sent feed-cat");
  }, 2000);
});

// 🔔 监听事件
socket.on("partner-fed", (data) => {
  console.log("📥 Received partner-fed:", data);
});

socket.on("partner-status", (data) => {
  console.log("👥 Partner status changed:", data);
});
