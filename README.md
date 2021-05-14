# Marko Vite Express Routing Error Test Case

## Getting Started

```bash
npm install
npm run dev
npm run build
npm start
```

## The Project

This project uses Marko's `vite-express` example, which includes `@marko/vite` and `@marko/express`.

## The Issue

With `@marko/vite` and `@marko/express`, dynamic nested routes (ie: `.get("/product/:id", ...)`) cause a directory error `ENOENT: no such file or directory error...`.

The route successfully renders, and `req.params` values pass, but page assets fail. It seems that the loader is looking in a directory named after the defined route name.
Meaning, if a route is defined as `/product/:id`, with the template housed at `src/pages/product`, the loader is searching `/product/src/pages/product/template.marko`

## Example

**This Project's Routing Setup**

```
// src/index.js
import { Router } from "express";
import indexPage from "./pages/index";
import productTemplate from "./pages/product/template.marko";

export default Router()
  // .set("views", path.join(__dirname, "views"))
  .get("/", indexPage)
  // dynamic route
  .get("/product/:id", (req, res) => {
    res.marko(productTemplate, req.params);
  });
```

**The Simplified Template**

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

`npm run dev` and visit `http://localhost:3000/product/123`

`input.id` outputs `123`, but the pages also throws the following error

`ENOENT: no such file or directory, open '/product/src/pages/product/template.marko'`

![Vite Error Screenshot](/error-screenshot.png)

So, no other assets load, as the lookup is using the route name in `product` in the path.

## Notes

**1. Non nested dynamic routes work as expected.**

```
.get("/:id", (req, res) => {
  res.marko(productTemplate, req.params);
});
```

**1. Nested static routes work as expected.**

```
.get("/product", productPage);
```

**2. The same nested dynamic routing works with the `webpack-express` example**

```
Works at /product/123
.get("/product/:id", (req, res) => {
  res.marko(productTemplate, req.params);
});
```

**3. If we just `send()`, the route works.**

```
.get("/product/:id", (req, res) => {
  res.send("product " + req.params.id);
})
```
