import { Router } from "express";
import ShortenController from "./shorten-controller";

const shortenRouter = Router();
const shortenController = new ShortenController();
shortenRouter.post("/", shortenController.createShortUrl);
shortenRouter.get("/", shortenController.getAllShortUrl);
shortenRouter.get("/:shortCode/stats", shortenController.getStats);
shortenRouter.get("/:shortCode", shortenController.getUrl);
shortenRouter.put("/:shortCode", shortenController.updateUrl);
shortenRouter.delete("/:shortCode", shortenController.deleteUrl);

export default shortenRouter;
