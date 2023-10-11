# Node.js Calculator Application
This project is a backend calculator built in Node.js and Express.js. It allows you to create an instance of a calculator and perform various mathematical operations such as Addition, Subtraction, Multiplication, and Division. You can also undo your operations and reset the calculator instance. The application does not use any persistent database storage and instead utilizes local storage (cookies) for temporary storage.

## Installation
To set up this Node.js Calculator Application on your own system, follow these steps:
1. Clone the repository using below command:
```bash
    git clone https://github.com/abhijeetnishal/Azgo-Assignment.git
```
2. Install dependencies in root directory of project using command: `npm install`.
3. Run the application using command: `npm start`.
4. Open postman or other API testing tools and use http://localhost:8000/ as URL and select GET request and send the request. If everything works fine, server send response as "server is live" i.e. your local setup is completed and server is running.

## Postman collection Link
- https://www.postman.com/technical-operator-72921422/workspace/calculator/collection/28883200-f5afe6dc-d509-41b4-91c4-b4b176aee252?tab=overview

## Implementation
- The application is developed in Node.js.
- Input validation and error handling are implemented.
- Test cases are included to ensure the application behaves as expected.
- Local storage (cookies) are used for temporary storage.

### Test API
- Install Postman or any API testing application. You can visit: https://www.postman.com/downloads/
- Open Postman and use below API endpoints mentioned below or visit Postman collection link mentioned above.
- To test API locally, setup project locally as instructed above and use http://localhost:8000 as URL followed by below routes.
- Calculator Routes:
    1. **POST: /init** - Initialize the calculator and perform an operation on two numbers.
    2. **POST: /operation** - Perform an operation on the current result.
    3. **PUT: /undo** - Undo the last operation and get the previous result.
    4. **GET: /reset** - Reset the calculator instance.

## Usage
Here's a basic example of how to use the calculator:

### 1. Initialize the Calculator

- **POST: /init**
  - Parameters:
    - operator: 'add'
    - num1: 3
    - num2: 4
  - Response:
    ```json
    {
      "result": 7,
      "totalOps": 1,
      "Id": 123
    }
    ```

### 2. Perform an Operation

- **POST: /operation**
  - Parameters:
    - operator: 'add'
    - num: 2
    - Id: 123
  - Response:
    ```json
    {
      "result": 9,
      "totalOps": 2,
      "Id": 123
    }
    ```

### 3. Undo the Last Operation

- **PUT: /undo**
  - Parameters:
    - id: 123
  - Response:
    ```json
    {
      "result": 7,
      "totalOps": 1
    }
    ```

### 4. Reset the Calculator

- **GET: /reset**
  - Parameters:
    - id: 123
  - Response:
    ```json
    {
      "success": true,
      "message": "Calculator 123 is now reset"
    }
    ```

## Testing
To run the included test cases, use the following command:
```bash
    npm test
```