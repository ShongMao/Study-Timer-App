import express, { Request, Response } from "express";
import config from "../config.json";

const app = express();

const PORT = parseInt(process.env.PORT || config.port);
const HOST = process.env.IP || "127.0.0.1";


// ===========================================================================
// ============================= ROUTES BELOW ================================
// ===========================================================================

app.get('/', (req: Request, res: Response) => {
    console.log('Here')
    res.send('Hi')
})

app.listen(3000)

// ===========================================================================
// ============================= ROUTES ABOVE ================================
// ===========================================================================

export const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Shutting down server gracefully.");
    process.exit();
  });
});