import express, { Request, Response } from "express";
import { userRegister, userLogin, addSubject, deleteSubject, getSubjects, userDetails, startTimer, stopTimer, getSubject, getTodayLeaderBoard, userDetailsUpdate } from "./app";
import { clearDB } from "./db";
import config from "../config.json";
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

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
  const { username, password } = req.body;

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

app.get("/v1/user/:userId/details", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const user = userDetails(userId);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

app.put("/v1/user/:userId/details", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const success = userDetailsUpdate(userId);
    res.status(200).json(success);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Create a new subject
app.post('/v1/user/:userId/subject', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const {name} = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: "Subject name is required" });
    return;
  }

  try {
    const subjectId = addSubject(userId, name);
    res.status(201).json({ subjectId });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
})

// Delete a subject
app.delete('/v1/user/:userId/subject/:subjectId', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const subjectId = Number(req.params.subjectId);

  try {
    const success = deleteSubject(userId, subjectId);
    res.status(200).json({ success });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
})

// Retrieve all subjects
app.get('/v1/user/:userId/subjects', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const subjects = getSubjects(userId);
    res.status(200).json({ subjects: subjects });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
});

// Start timer
app.post('/v1/timer/start', (req: Request, res: Response) => {
  const { userId, subjectId } = req.body;
  const numberId = Number(userId);
  try {
    startTimer(numberId, subjectId);
    return res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
});

// Stop timer
app.post('/v1/timer/stop', (req: Request, res: Response) => {
  const userId = Number(req.body.userId);

  try {
    stopTimer(userId);
    return res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
});

// Get specific subject
app.get('/v1/timer/:userId/subject/:subjectId', (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const subjectId = Number(req.params.subjectId);

  try {
    const subject = getSubject(userId, subjectId);
    return res.status(200).json({ subject });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      } else if (err.message === 'Subject not found for user') {
        res.status(404).json({ error: err.message });
      }
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
});

app.get('/v1/leaderboard/users', (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 7;

  try {
    const leaderboard = getTodayLeaderBoard(limit);
    return res.status(200).json({ leaderboard });
  } catch (err) {
    res.status(400).json({ error: "Unknown error occurred" });
  }
})

app.delete('/v1/clear', (_req: Request, res: Response) => {
  clearDB();
  res.status(200).json({});
});


// ===========================================================================
// ============================= ROUTES ABOVE ================================
// ===========================================================================

export const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  // Clear any memory in the database
  clearDB();
  server.close(() => {
    console.log("Shutting down server gracefully.");
    process.exit();
  });
});