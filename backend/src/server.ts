import express, { Request, Response } from "express";
import { userRegister, userLogin, addSubject, deleteSubject, getSubjects, userDetails, startTimer, stopTimer, getSubject, getTodayLeaderBoard, userDetailsUpdate,
  V2userRegister, V2userLogin, V2addSubject, V2userDetails, V2userDetailsUpdate, V2getSubjects, V2getSubject, V2startTimer, V2stopTimer, V2getTodayLeaderBoard, 
  searchUserByFriendCode, sendFriendRequest, acceptFriendRequest, listFriends, getFriendRequests, declineFriendRequest, removeFriend
 } from "./app";
import { clearDB } from "./db";

import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));




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
  const updates = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const updatedUser = userDetailsUpdate(userId, updates);
    res.status(200).json(updatedUser);
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

// ============================= V2 ROUTES ==================================

app.post('/v2/user/register', async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    const userId = await V2userRegister(email, password, username);
    res.status(200).json({ userId });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message }); 
    } else {
      res.status(400).json({ error: 'Unknown error occured' }); 
    }
  }
})

app.post('/v2/user/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const userId = await V2userLogin(username, password);
    res.status(200).json({ userId });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message }); 
    } else {
      res.status(400).json({ error: 'Unknown error occured' }); 
    }
  }
})

// Get user details
app.get("/v2/user/:userId/details", async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }
  
  try {
    const user = await V2userDetails(userId);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Update user details
app.put("/v2/user/:userId/details", async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const updates = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }
  
  try {
    const updatedUser = await V2userDetailsUpdate(userId, updates);
    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Create a new subject
app.post('/v2/user/:userId/subject', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const {name} = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: "Subject name is required" });
    return;
  }

  try {
    const subjectId = await V2addSubject(userId, name);
    res.status(201).json({ subjectId });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
})

// Retrieve all subjects
app.get('/v2/user/:userId/subjects', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const subjects = await V2getSubjects(userId);
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

// Get specific subject
app.get('/v2/timer/:userId/subject/:subjectId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const subjectId = Number(req.params.subjectId);

  try {
    const subject = await V2getSubject(userId, subjectId);
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

// Start timer
app.post('/v2/timer/start', async (req: Request, res: Response) => {
  const { userId, subjectId } = req.body;
  const numberId = Number(userId);
  try {
    await V2startTimer(numberId, subjectId);
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
app.post('/v2/timer/stop', async (req: Request, res: Response) => {
  const userId = Number(req.body.userId);

  try {
    await V2stopTimer(userId);
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

// Get the leaderboard
app.get('/v2/leaderboard/users', async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 7;

  try {
    const leaderboard = await V2getTodayLeaderBoard(limit);
    return res.status(200).json({ leaderboard });
  } catch (err) {
    res.status(400).json({ error: "Unknown error occurred" });
  }
})

// Search for friends by friendcode
app.get("/v2/friends/search", async (req, res) => {
  const { code } = req.query;
  try {
    const user = await searchUserByFriendCode(code as string);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Send a friend request
app.post("/v2/friends/request", async (req, res) => {
  try {
    const { fromUserId, friendCode } = req.body;

    const result = await sendFriendRequest(fromUserId, friendCode);
    res.json(result);

  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Accept a friend request
app.post("/v2/friends/accept", async (req, res) => {
  const { requestId, userId } = req.body;
  try {
    const result = await acceptFriendRequest(requestId, userId);
    res.json(result);

  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// List friends
app.get("/v2/friends/list/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  try {
    const friends = await listFriends(userId);
    res.json({ friends });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// View friend requests
app.get("/v2/friends/requests", async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  if (!userId) {
    throw new Error("Missing userId");
  }
  try {
    const requests = await getFriendRequests(userId);
    res.json({ requests });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Decline friend requests
app.post("/v2/friends/decline", async (req: Request, res: Response) => {
  try {
    const { requestId, userId } = req.body;

    if (!requestId || !userId) {
      throw new Error("Missing requestId or userId");
    }

    const result = await declineFriendRequest(requestId, userId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Remove a friend
app.delete("/v2/friends/remove", async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      throw new Error("Missing userId or friendId");
    }

    const result = await removeFriend(userId, friendId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// ===========================================================================
// ============================= ROUTES ABOVE ================================
// ===========================================================================

export default app;