import { Application, Router } from "https://deno.land/x/oak@v8.0.0/mod.ts";

const port = 8000;
const app = new Application();

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Cody - Bot Server";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
