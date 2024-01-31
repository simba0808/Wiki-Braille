import Data from "../models/data.js";
import Logger from "../models/logger.js";
import fs from "fs";

const searchData = async (req, res) => {
  if (!await indexExists("title")) {
    await Data.collection.createIndex({ title_id: "text", title: "text", tag: "text", description: "text" }, { name: "title" }, { default_language: "portuguese" });
  }
  let { word, advance, searchin, pageIndex, numberPerPage, sortMethod, descending } = req.body;
  let query = {};
  let pluralWord = word;

  if (word.endsWith("ão")) {
    pluralWord = word.replace(/(?:ão)$/, 'ões')
  } else if (word.match(/(?:[nrsz])$/)) {
    pluralWord = word + 'es'
  } else if (word.match(/(?:[m])$/)) {
    pluralWord = word.replace(/(?:[m])$/, 'ns');
  } else if (word.match(/(?:[l])$/)) {
    pluralWord = word.replace(/(?:[l])$/, 'is');
  }

  if (word !== "") {
    if (searchin == 1) {
      query = {
        $match: {
          $or: [
            { title: { $regex: new RegExp(word, 'i') } },
            { title: { $regex: new RegExp(pluralWord, 'i') } }
          ]
        }
      };
    } else if (searchin == 2) {
      query = {
        $match: {
          $or: [
            { tag: { $regex: new RegExp(word, 'i') } },
            { tag: { $regex: new RegExp(pluralWord, 'i') } }
          ]
        }
      };
    } else {
      query = {
        $match: {
          $text: { $search: word + " " + pluralWord },
        }
      };
    }
  }

  try {
    let totalQuery = [];
    if (word !== "") {
      if (word.match(/^\d{1,6}$/) !== null) {
        totalQuery = [
          {
            $match: {
              title_id: word.padStart(6, "0")
            }
          },
        ];
      } else {
        totalQuery = [
          query,
          {
            $match: {
              catagory: advance,
            }
          },
        ];
        // if (searchin === 0) {
        //   totalQuery.push(
        //     { $addFields: { score: { $meta: "textScore" } } },
        //     { $sort: { score: { $meta: "textScore" } } }
        //   );
        // }
      }
    } else {
      totalQuery = [
        {
          $match: {
            catagory: advance,
          }
        },
      ];
    }
    if (sortMethod) {
      totalQuery.splice(1, 0, { $sort: { title_id: descending ? -1 : 1 } });
    } else {
      totalQuery.splice(1, 0, { $sort: { rate: descending ? -1 : 1, title_id: 1 } });
    }

    totalQuery.push({
      $facet: {
        totalCount: [{ $count: "total" }],
        limitData: [{ $skip: numberPerPage * (pageIndex - 1) }, { $limit: numberPerPage }]
      }
    });

    const result = await Data.aggregate(totalQuery);
    res.status(200).send({
      count: result[0].totalCount.length ? result[0].totalCount[0].total : 0,
      data: result[0].limitData
    });
  } catch (err) {
    res.status(405);
    throw new Error("Error occured while searching database")
  }
};

const indexExists = async (fieldName) => {
  const indexes = await Data.collection.listIndexes().toArray();
  const existingIndex = indexes.find(index => index.name == fieldName);
  return existingIndex ? 1 : 0;
};

const updateDescription = async (req, res) => {
  const { user, text, category, newTag, title_id } = req.body;

  try {
    const data = await Data.updateOne(
      {
        title_id: title_id
      },
      {
        $set: {
          title_id: Data.title_id,
          title: Data.title,
          catagory: category,
          tag: newTag,
          description: text,
        }
      },
      {
        upsert: true
      }
    );
    if (data) {
      await Logger.create({
        name: "Update Description",
        status: "Success",
        user: user,
        time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
        detail: `Update Description(${title_id})`,
      });
      res.status(200).send({
        message: "success",
      });
    }
  } catch (err) {
    await Logger.create({
      name: "Update Description",
      status: "Failed",
      user: user,
      time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
      detail: `Update Description(${title_id})`,
    });
    res.status(500);
    throw new Error("Error occured updating description")
  }
};

const updateImageDescription = async (req, res) => {
  const { title_id, category, tag, text, user } = req.body;
  try {
    const data = await Data.findOne({ title_id });
    if (data) {
      fs.unlink(`images/${data.image.split("http://localhost:3000/")[1]}`, (err) => {
      });
      data.text = text;
      data.catagory = category;
      data.tag = tag;
      data.image = "http://localhost:3000/" + req.file.filename;
      await data.save();

      await Logger.create({
        name: "Update Description",
        status: "Success",
        user: user,
        time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
        detail: `Update Description(${title_id})`,
      });

      res.status(200).send({
        message: "success",
        path: "http://localhost:3000/" + req.file.filename,
      });
    }
  } catch (err) {
    await Logger.create({
      name: "Update Description",
      status: "Failed",
      user: user,
      time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
      detail: `Update Description(${title_id})`,
    });
    res.status(404);
    throw new Error("not found")
  }
};

const rateDescription = async (req, res) => {
  const { title_id, rate, comment, user } = req.body;

  try {
    let data = await Data.findOne({ title_id });
    let curRate = 0, curRatedCount = 0;
    if (data) {
      curRate = data.rate;
      curRatedCount = data.ratedCount;
      data.totalRate = data.totalRate + rate;
      data.rate = ((data.totalRate) / (data.ratedCount + 1)).toFixed(2);
      data.ratedCount = data.ratedCount + 1;
      if(comment !== "") {
        await data.comments.push({
          comment: comment,
          user: user,
          rate: parseInt(rate),
          date: new Date().toUTCString()
        });
      }
      
      const result = await data.save();
      if (result) {
        res.status(200).send("success");
      }
    }
  } catch (err) {
    res.status(500);
    throw new Error("failed rating");
  }
};

const deleteComment = async (req, res) => {
  const { title_id, comment_id } = req.body;
  try {
    const comment = await Data.findOne(
      { title_id },
      { comments: { $elemMatch: { _id: comment_id } } }
    );
    
    const data = await Data.findOne({ title_id });
    data.totalRate = data.totalRate - comment.comments[0].rate;
    data.rate = data.totalRate ? (data.totalRate)/(data.ratedCount-1):0;
    data.ratedCount = data.ratedCount - 1;
    await data.save();

    const result = await Data.findOneAndUpdate(
      { title_id },
      { $pull: { comments: { _id: comment_id } } },
      { new: true }
    );
    if(result) {
      res.status(200).send({
        message: "removed"
      });
    }
  } catch (err) {
    res.status(500);
    throw new Error("Failed to delete comment")
  }
}

const deleteDescription = async (req, res) => {
  const { user } = req.body;
  try {
    const result = await Data.deleteOne({ title_id: req.params.id });
    if (result) {
      await Logger.create({
        name: "Delete Description",
        status: "Success",
        user: user,
        time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
        detail: `Delete Description(${req.params.id})`,
      });

      res.status(200).send({
        message: "success",
      });
    }
  } catch(err) {
    await Logger.create({
      name: "Delete Description",
      status: "Failed",
      user: user,
      time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
      detail: `Delete Description(${req.params.id})`,
    });
    res.status(500);
    throw new Error("Failed deleting description");
  }
};

export {
  searchData,
  updateDescription,
  updateImageDescription,
  rateDescription,
  deleteComment,
  deleteDescription,
};