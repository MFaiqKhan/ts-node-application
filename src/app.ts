import express, { NextFunction, Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    return res.send("Helloworld");
});

app.get("/json", (req: Request, res: Response) => {
    return res.json({
        jsonfile: true,
        name: "faiq",
    });
});

app.get("/redirect", (req: Request, res: Response) => {
    return res.redirect("http://localhost:3000/json");
});

app.post("/api/typepost", (req: Request, res: Response) => {
    console.log(req.body);
    return res.sendStatus(200);
});

app.all("/api/typeall", (req: Request, res: Response) => {
    return res.sendStatus(201);
});

//chaining requests,
app
    .route("/api/order")
    .get((req: Request, res: Response) => {
        return res.send("check the order");
    })
    .post((req: Request, res: Response) => {
        return res.send("Create a Order");
    })
    .put((req: Request, res: Response) => {
        return res.send("Update the Order");
    })
    .delete((req: Request, res: Response) => {
        return res.send("Delete the Order");
    });

//route paths
app.get("/path1", (req: Request, res: Response) => res.sendStatus(200));
app.get("/ab*cd", (req: Request, res: Response) => res.send("route1"));
app.get("/faiq/", (req: Request, res: Response) => res.send("route1-route2"));

//route parameters
/* app.get("/api/order/:orderNum", (req: Request, res: Response) =>{
    console.log(req.params.orderNum);

    return res.send(req.params);
}); */

//route handler in external function,
//multiple handlers

function getOrderHandleOne(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);
    next();
}

function getOrderHandleTwo(req: Request, res: Response, next: NextFunction) {
    console.log(req.params.orderNum);

    return res.send(req.params);
}

app.get("/api/order/:orderNum", [getOrderHandleOne, getOrderHandleTwo]);

//middleware & handler

function middleware(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    req.name = "faiq";
    next();
}



app.get(
    "/api/games/:gameId",
    middleware, //can create route middleware by puttin multiple middlewares in array [middleware1,middleware2]
    (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        console.log(req.name);
        // @ts-ignore
        res.send(req.name);
    }
);

//global middleware

app.use(middleware)

app.get(
    "/api/store/:storeId",
    (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        console.log(req.name);
        // @ts-ignore
        res.send(req.name);
    }
);


app.listen(3000, () => {
    console.log("Server is listening to http://localhost:3000");
});
