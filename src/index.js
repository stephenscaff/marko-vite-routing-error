import { Router } from "express";
import indexPage from "./pages/index";
import productTemplate from "./pages/product/template.marko";
import usersService from "./services/users";

export default Router({ mergeParams: true })
  .get("/", indexPage)
  .get("/services/users", usersService)
  .get("/product/:id", function (req, res) {
    // res.send("user " + req.params.id);
    res.marko(productTemplate, req.params);
  });
