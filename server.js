import index from "./index.js"
import logger from "./src/utils/logger.js";

const PORT = process.env.PORT || 3000;
let server;

function shutdown(code = 0) {
  if (server) {
    server.close(() => {
      logger.info("🔻 Server closed gracefully");
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception:", err);
  shutdown(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection:", reason);
  shutdown(1);
});

process.on("SIGTERM", () => {
  logger.info("📴 SIGTERM received");
  shutdown(0);
});

process.on("SIGINT", () => {
  logger.info("📴 SIGINT received (e.g. Ctrl+C)");
  shutdown(0);
});

try {
  server = index.listen(PORT, () => {
    logger.info(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  logger.error("❌ Error starting server:", err);
  shutdown(1);
}
