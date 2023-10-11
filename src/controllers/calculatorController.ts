import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
let calculatorId: string;

function operatorValidation(operator: string){
    if(operator == '+' || operator == '-' || operator == '*' || operator == '/')
        return true;
    else
        return false;
}

function isNumber(numberString: string) {
    //Regular expression to check if the string is a number or not
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

function calculateUndoResult(num1: string, num2: string, operator: string){
    let firstNumber = Number(num1);
    let secondNumber = Number(num2);
    let result;

    if(operator == '+')
        result = firstNumber - secondNumber;
    else if(operator == '-')
        result = firstNumber + secondNumber;
    else if(operator == '*')
        result = firstNumber / secondNumber;
    else
        result = firstNumber * secondNumber;

    return result;
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
                        calculatorId = uuidv4();

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
        //Taking data from request
        const { operator, num, Id } = req.body;

        //validate input
        if (!operator || !num || !Id) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required input fields' });
        }
        else {
            //Check calculator is initialised or not
            if(!req.cookies[Id]){
                return res.status(404).json(`calculator with Id ${Id} not initialised`);
            }
            else{
                //Operator validation
                if(operatorValidation(operator)){

                    if(isNumber(num)){

                        if(operator == '/' && Number(num) === 0)
                            return res.status(400).json('zero division error');
                        else{
                            //Get data from cookies
                            const cookieData = req.cookies[Id];

                            //Get previous result and totalOps
                            const num1 = cookieData.result;
                            const totalOps = cookieData.totalOps + 1;

                            //List to track operators and number for undo functionality
                            let operatorNumberList = cookieData.list || [];

                            const result = calculateResult(num1, num, operator);

                            const data = {
                                result: result,
                                totalOps: totalOps
                            }

                            //Add the new operator with number as string
                            operatorNumberList.push(operator + num);

                            //Store data using cookie
                            res.cookie(Id, {...data, list: operatorNumberList});

                            //Return the response
                            return res.status(200).json({...data, Id: Id});
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error: ' + error);
    }
}

//clear the cookie to logout
const undoFunction = (req: Request, res: Response) => {
    try {
        //Taking data from request
        const { Id } = req.body;

        //validate input
        if(!Id) {
            //Bad request (400)
            return res.status(400).json({ message: 'enter required input fields' });
        }
        else{
            //Check calculator is initialised or not
            if(!req.cookies[Id]){
                return res.status(404).json(`calculator with Id ${Id} not initialised`);
            }
            else{
                //Get data from cookie
                const cookieData = req.cookies[Id];

                //Get previous result and totalOps
                const num1 = cookieData.result;
                const totalOps = cookieData.totalOps - 1;

                //Get list from cookie
                const operatorNumberList = cookieData.list;

                //Check if you reach init step then no more undo operations
                if(operatorNumberList.length === 0)
                    return res.status(400).json('no more undo operations');

                //Get operator and num2
                const operator = operatorNumberList[operatorNumberList.length - 1][0];
                let num2 = operatorNumberList[operatorNumberList.length - 1];
                num2 = num2.substr(1, num2.length);

                //Calculate the undo result
                const result = calculateUndoResult(num1, num2, operator);

                const data = {
                    result: result,
                    totalOps: totalOps
                }

                //Remove operator with number as string from list because of undo operation
                operatorNumberList.pop();

                //Store data using cookies
                res.cookie(Id, {...data, list: operatorNumberList});

                //Return the response
                return res.status(200).json({...data, Id: Id});
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error');
    }
}

const resetFunction = async (req: Request, res: Response) => {
    //Taking data from request
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

            return res.status(200).json(response);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json('internal server error: ' + error);
    }
}

export default {
    calculatorId,
    operatorValidation,
    isNumber,
    resetFunction,
    initFunction,
    operationFunction,
    undoFunction
}