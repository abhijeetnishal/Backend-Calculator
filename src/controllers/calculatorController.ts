import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';


function operatorValidation(operator: string){
    if(operator == '+' || operator == '-' || operator == '*' || operator == '/')
        return true;
    else
        return false;
}

function isNumber(numberString: string) {
    //Use a regular expression to check if the string is a number
    return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(numberString);
}

function calculateResult(num1: string, num2: string, operator: string){
    let firstNumber = Number(num1);
    let secondNumber = Number(num2);
    let result;

    if(operator == '+')
        result = firstNumber + secondNumber;
    else if(operator == '-')
        result = firstNumber - secondNumber;
    else if(operator == '*')
        result = firstNumber * secondNumber;
    else
        result = firstNumber / secondNumber;

    return result;
}

const resetFunction = async (req: Request, res: Response) => {
    //Taking user data from client
    const Id = req.params.id;

    //Using try catch for error handling
    try {
        if(!Id) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required details' });
        }
        else{
            //clear the cookie to clear instance
            res.clearCookie(Id);

            const response = {
                success: true,
                message: `calculator ${Id} is now reset`
            }

            return res.status(200).json({ response });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error: ' + error);
    }
}

const initFunction = async (req: Request, res: Response) => {
    //Taking data from request
    const { operator, num1, num2 } = req.body;

    //Using try catch for error handling
    try {
        //Input validation
        if (!operator || !num1 || !num2) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required details' })
        }
        else{
            //Operator validation
            if(operatorValidation(operator)){
                if(isNumber(num1) && isNumber(num2)){
                    if(operator == '/' && Number(num2) === 0)
                        return res.status(400).json('zero division error');
                    else{
                        const result = calculateResult(num1, num2, operator);

                        //Generate unique Id
                        const calculatorId = uuidv4();

                        const data = {
                            result: result,
                            totalOps: 1
                        }

                        //Store data using cookies
                        res.cookie(calculatorId, data);

                        //Return the response
                        return res.status(200).json({...data, Id: calculatorId});
                    }
                }
                else{
                    return res.status(400).json('enter valid numbers');
                }
            }
            else{
                return res.status(400).json('invalid operator');
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error: ' + error);
    }
}

const operationFunction = async (req: Request, res: Response) => {
    try {
        //taking user data from client
        const { operator, num, Id } = req.body;

        //validate input
        if (!operator || !num || !Id) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required input fields' });
        }
        else {
            //Operator validation
            if(operatorValidation(operator)){
                if(isNumber(num)){
                    if(operator == '/')
                        return res.status(400).json('zero division error');
                    else{
                        //Get data from cookies
                        const cookieData = req.cookies.Id;

                        //Get previous result and totalOps
                        const num1 = cookieData.result;
                        const totalOps = cookieData.totalOps + 1;

                        const result = calculateResult(num1, num, operator);

                        //Generate unique Id
                        const calculatorId = uuidv4();

                        const data = {
                            result: result,
                            totalOps: totalOps
                        }

                        //Store data using cookies
                        res.cookie(calculatorId, data);

                        //Return the response
                        return res.status(200).json({...data, Id: calculatorId});
                    }
                }
                else{
                    return res.status(400).json('enter invalid numbers');
                }
            }
            else{
                return res.status(400).json('Invalid operator');
            }
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