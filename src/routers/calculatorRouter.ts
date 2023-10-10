import express from "express";
import calculatorController from "../controllers/calculatorController";

//create a router for calculator
const calculatorRouter = express.Router();

//create an endpoint to reset the calculator 
calculatorRouter.get('/reset', calculatorController.resetFunction);

//create an endpoint to perform operation on 2 numbers and initialize the calculator 
calculatorRouter.post('/init', calculatorController.initFunction);

//create an endpoint to perform operation on created result 
calculatorRouter.post('/operation', calculatorController.operationFunction);

//create an endpoint to perform undo and get last performed result
calculatorRouter.put('/undo', calculatorController.undoFunction);

export default calculatorRouter;
