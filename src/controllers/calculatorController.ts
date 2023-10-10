import { Request, Response } from 'express';


const resetFunction = async (req: Request, res: Response) => {
    //taking user data from client
    const { userName, password, confirmPassword } = req.body;

    //using try catch for error handling
    try {
        if (!userName || !password || !confirmPassword) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required details' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error\n' + error);
    }
}

const initFunction = async (req: Request, res: Response) => {
    //taking user data from client
    const { userName, password, confirmPassword } = req.body;

    //using try catch for error handling
    try {
        if (!userName || !password || !confirmPassword) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required details' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error\n' + error);
    }
}

const operationFunction = async (req: Request, res: Response) => {
    try {
        //taking user data from client
        const { userName, password } = req.body;

        //validate input
        if (!userName || !password) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required input fields' });
        }
        else {
            
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error');
    }
}

//clear the cookie to logout
const undoFunction = (req: Request, res: Response) => {
    res.clearCookie('access_token').json('user logged out');
}

export default {
    resetFunction,
    initFunction,
    operationFunction,
    undoFunction
}