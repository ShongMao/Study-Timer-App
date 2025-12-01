import express, { Request, Response } from "express";
const app = express()

// test route
app.get('/', (req: Request, res: Response) => {
    console.log('Here')
    res.send('Hi')
})

app.listen(3000)