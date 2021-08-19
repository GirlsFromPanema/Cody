# Deno OAK Server | Open Source - https://oakserver.github.io/oak/

- $ deno run --allow-net server.ts | .gitkeep

# Middleware

The main architecture of middleware frameworks like oak is, unsurprisingly, the concept of middleware. These are functions which are executed by the application in a predictable order between when the application receives a request and the response is sent.

Middleware functions allow you to break up the logic of your server into discreet functions that encapsulate logic, as well as import in other middleware that can add functionality to your application in a very loosely coupled way.

To get an application to use a middleware function, an instance of an application has a .use() method. Middleware functions are provided with two parameters, a context object, and a next() function. Because the processing of middleware is asynchronous by nature, middleware functions can return a promise to indicate when they are done processing.

Control the execution of middleware
Middleware gets executed in the order that it is registered with the application via the .use() method. Just executing the functions in order though is insufficient in a lot of cases to create useful middleware. This is where the next() function passed to a middleware function allows the function to control the flow of other middleware, without the other middleware having to be aware of it. next() indicates to the application that it should continue executing other middleware in the chain. next() always returns a promise which is resolved when the other middleware in the chain has resolved.

If you use next(), almost all the time you will want to await next(); so that the code in your middleware function executes as you expect. If you don’t await next() the rest of the code in your function will execute without all the other middleware resolving, which is not usually what you want.

There are few scenarios where you want to control with your middleware. There is when you want the middleware to do something just before the response is sent, like logging middleware. You would want to create a middleware function like this:

# Example

const app = new Application();

app.use(async (ctx, next) => {
await next();
/_ Do some cool logging stuff here _/
});

# Handling

- Cookies
- App
- Request
- Response
- State
- Assert()
- Throw()
