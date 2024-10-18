import { Request, Response } from "express-serve-static-core";
import Url from "./url-model";

class ShortenController {
  constructor() {
    this.createShortUrl = this.createShortUrl.bind(this);
  }
  #randomCode(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
  async getAllShortUrl(_req: Request, res: Response) {
    try {
      const urls = await Url.find().select("id url shortCode");
      res.status(200).json(urls);
    } catch (error) {
      console.log("===error in getAllShortUrl", error);
      try {
        if (error instanceof Error) {
          const parsedError = JSON.parse(error.message);
          res.status(parsedError.status).json({ message: parsedError.message });
        }
      } catch (jsonError) {
        res.status(500).json({ message: "Something went wrong, unable to get the shortUrl" });
      }
    }
  }
  async createShortUrl(req: Request<{}, {}, { url: string }>, res: Response) {
    try {
      const { url } = req.body;
      if (!url) {
        throw new Error(JSON.stringify({ status: 400, message: "Url not found" }));
      }

      try {
        new URL(url);
      } catch (error) {
        throw new Error(JSON.stringify({ status: 400, message: "Invalid Url" }));
      }

      const existingUrl = await Url.findOne({ url });
      if (existingUrl) {
        throw new Error(JSON.stringify({ status: 400, message: "Url already stored" }));
      }
      const shortCode = this.#randomCode(6);
      const newUrl = new Url({ url, shortCode });
      await newUrl.save();
      const { accessCount, _id: id, ...responseDocument } = newUrl.toObject();
      res.status(201).json({ id, ...responseDocument });
    } catch (error) {
      console.log("===error in createShortUrl", error);
      try {
        if (error instanceof Error) {
          const parsedError = JSON.parse(error.message);
          res.status(parsedError.status).json({ message: parsedError.message });
        }
      } catch (jsonError) {
        res.status(500).json({ message: "Something went wrong, can't able to create a shortUrl" });
      }
    }
  }

  async getUrl(req: Request<{ shortCode: string }>, res: Response) {
    try {
      const { shortCode } = req.params;
      if (!shortCode) {
        throw new Error(JSON.stringify({ status: 400, message: "Short Code not found" }));
      }

      const urlDocument = await Url.findOne({
        shortCode
      }).select("id url shortCode createdAt updatedAt accessCount");

      if (!urlDocument) {
        throw new Error(JSON.stringify({ status: 404, message: "Short Url not found" }));
      }

      urlDocument.accessCount += 1;
      await urlDocument.save({ timestamps: false });
      const { accessCount, _id: id, ...responseDocument } = urlDocument.toObject();
      res.status(200).json({ id, ...responseDocument });
    } catch (error) {
      console.log("=error in getUrl=======>>>", error);

      try {
        if (error instanceof Error) {
          const parsedError = JSON.parse(error.message);
          res.status(parsedError.status).json({ message: parsedError.message });
        }
      } catch (jsonError) {
        res.status(500).json({ message: "Something went wrong, can't able to create a shortUrl" });
      }
    }
  }

  async updateUrl(req: Request<{ shortCode: string }, {}, { url: string }>, res: Response) {
    try {
      const { shortCode } = req.params;
      const { url } = req.body;
      if (!shortCode) {
        throw new Error(JSON.stringify({ status: 400, message: "Short Code not found" }));
      }
      if (!url) {
        throw new Error(JSON.stringify({ status: 400, message: "Url not found" }));
      }

      try {
        new URL(url);
      } catch (error) {
        throw new Error(JSON.stringify({ status: 400, message: "Invalid Url" }));
      }

      const existingUrl = await Url.findOne({ url });
      if (existingUrl) {
        throw new Error(JSON.stringify({ status: 400, message: "Url already stored" }));
      }
      const urlDocument = await Url.findOneAndUpdate(
        { shortCode },
        {
          $set: {
            url: url,
            updatedAt: new Date()
          }
        },
        { new: true }
      );

      if (!urlDocument) {
        throw new Error(JSON.stringify({ status: 404, message: "Short Code not found" }));
      }

      const { accessCount, _id: id, ...responseDocument } = urlDocument.toObject();
      res.status(200).json({ id, ...responseDocument });
    } catch (error) {
      try {
        if (error instanceof Error) {
          const parsedError = JSON.parse(error.message);
          res.status(parsedError.status).json({ message: parsedError.message });
        }
      } catch (jsonError) {
        res.status(500).json({ message: "Something went wrong, can't able to create a shortUrl" });
      }
    }
  }

  async deleteUrl(req: Request<{ shortCode: string }>, res: Response) {
    try {
      const { shortCode } = req.params;
      if (!shortCode) {
        throw new Error(JSON.stringify({ status: 400, message: "Short Code not found" }));
      }

      const deletedUrlDocument = await Url.findOneAndDelete({ shortCode });
      if (!deletedUrlDocument) {
        throw new Error(JSON.stringify({ status: 404, message: "Short Code not found" }));
      }
      res.sendStatus(204);
    } catch (error) {
      try {
        if (error instanceof Error) {
          const parsedError = JSON.parse(error.message);
          res.status(parsedError.status).json({ message: parsedError.message });
        }
      } catch (jsonError) {
        res.status(500).json({ message: "Something went wrong, can't able to create a shortUrl" });
      }
    }
  }

  async getStats(req: Request<{ shortCode: string }>, res: Response) {
    try {
      const { shortCode } = req.params;
      if (!shortCode) {
        throw new Error(JSON.stringify({ status: 400, message: "Short Code not found" }));
      }

      const urlDocument = await Url.findOne({
        shortCode
      });

      if (!urlDocument) {
        throw new Error(JSON.stringify({ status: 404, message: "Short Url not found" }));
      }
      const { _id: id, ...responseDocument } = urlDocument.toObject();
      res.status(200).json({ id, ...responseDocument });
    } catch (error) {
      try {
        if (error instanceof Error) {
          const parsedError = JSON.parse(error.message);
          res.status(parsedError.status).json({ message: parsedError.message });
        }
      } catch (jsonError) {
        res.status(500).json({ message: "Something went wrong, can't able to create a shortUrl" });
      }
    }
  }
}

export default ShortenController;
