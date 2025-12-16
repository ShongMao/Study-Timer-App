import express, { Request, Response } from "express";
import { userRegister, userLogin } from "./app";
import config from "../config.json";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.PORT || config.port);
const HOST = process.env.IP || "127.0.0.1";


// ===========================================================================
// ============================= ROUTES BELOW ================================
// ===========================================================================

app.post('/v1/user/register', (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    const userId = userRegister(email, password, username);
    res.status(200).json({ userId });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message }); 
    } else {
      res.status(400).json({ error: 'Unknown error occured' }); 
    }
  }
})

app.post('/v1/user/login', (req: Request, res: Response) => {
  const { password, username } = req.body;

  try {
    const userId = userLogin(username, password);
    res.status(200).json({ userId });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message }); 
    } else {
      res.status(400).json({ error: 'Unknown error occured' }); 
    }
  }
})







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