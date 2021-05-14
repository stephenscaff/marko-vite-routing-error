# Marko Vite Routing Error Test

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## The Project

This project is based on the `vite-express` `Marko.js` example, installed via the `marko-cli` (`npm init @marko myapp --template vite-express`)
The app uses `@marko/vite` (Marko's Vite.js plugin), and `@marko/express`.

## The Issue

When using `@marko/vite` and `@marko/express` plugins, as in the `vite-express` example, adding dynamic nested routes (ie: `.get("/product/:id", ...)`) causes a directory error `ENOENT: no such file or directory error...`.

The route actually renders, and the the `req.params` value passes, but all pages assets fail because the loader is looking in a directory named after the defined route name.

**Take this Routing**

```
// src/index.js
import { Router } from "express";
import indexPage from "./pages/index";
import productTemplate from "./pages/product/template.marko";

export default Router({ mergeParams: true })
  // .set("views", path.join(__dirname, "views"))
  .get("/", indexPage)
  // dynamic route
  .get("/product/:id", (req, res) => {
    res.marko(productTemplate, req.params);
  });
```

**With this products template**

```
// src/pages/product/template.marko
<app-layout>
  <@head>
    <title>Product</title>
  </@head>
  <@body>
    <section>
      <h1>Product ID: ${input.id}</h1>
    </section>
  </@body>
</app-layout>
```

If you go to `http://localhost:3000/product/123`, `input.id` outputs `123`, but the pages also throws the following error

``ENOENT: no such file or directory, open '/product/src/pages/product/template.marko'```

![Vite Error Screenshot](/error-screenshot.png)

So, no other assets load, due to an incorrect directory lookup, as the route name, `product`, is being used in the lookup.

## Notes

**1. Non nested dynamic routes work as expected.**

```
.get("/:id", (req, res) => {
  res.marko(productTemplate, req.params);
});
```

**2. The same nested dynamic routing works with the `webpack-express` example**

**3. If we just `send()`, the route works.**

```
.get("/product/:id", (req, res) => {
  res.send("user " + req.params.id);
})
```
