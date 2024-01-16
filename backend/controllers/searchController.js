import Data from "../models/data.js";
//import fuse from "fuse";
import ImageModel from "../models/image.js";
import { ObjectId } from "mongodb";

const searchData = async (req, res) => {
  let { word, advance, searchin, pageIndex } = req.body.searchWordGroup;
  const numberPerPage = req.body.numberPerPage;
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
      if (word.match(/^\d{6}$/) !== null) {
        totalQuery = [
          query,
          {
            $skip: numberPerPage * (pageIndex - 1)
          },
          {
            $limit: numberPerPage
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
          {
            $skip: numberPerPage * (pageIndex - 1)
          },
          {
            $limit: numberPerPage
          },
        ];
      }
    } else {
      totalQuery = [
        {
          $match: {
            catagory: advance,
          }
        },
        {
          $skip: numberPerPage * (pageIndex - 1)
        },
        {
          $limit: numberPerPage
        },
      ];
    }

    const result = await Data.aggregate(totalQuery);
    res.status(200).send(result);
  } catch (err) {
    res.status(405);
    throw new Error("Error occured while searching database")
  }
};

const getFilteredNumber = async (req, res) => {
  let { word, advance, searchin } = req.body;
  let pluralWord = word;
  let query = {};

  if (word.endsWith("ão")) {
    pluralWord = word.replace(/(?:ão)$/, 'ões')
  } else if (word.match(/(?:[nrsz])$/)) {
    pluralWord = word + 'es'
  } else if (word.match(/(?:[m])$/)) {
    pluralWord = word.replace(/(?:[m])$/, 'ns');
  } else if (word.match(/(?:[l])$/)) {
    pluralWord = word.replace(/(?:[l])$/, 'is');
  }

  console.log(word, pluralWord)
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
  console.log(query)
  try {
    if (!await indexExists("title")) {
      await Data.collection.createIndex({ title_id: "text", title: "text", tag: "text" }, { name: "title" }, { default_language: "portuguese" });
    }

    let totalQuery = [];
    if (word !== "") {
      if (word.match(/^\d{6}$/) !== null) {
        totalQuery = [
          query,
          {
            $count: "filteredCount"
          }
        ];
      } else {
        totalQuery = [
          query,
          {
            $match: { catagory: advance }
          },
          {
            $count: "filteredCount"
          }
        ];
      }
    } else {
      totalQuery = [
        {
          $match: { catagory: advance }
        },
        {
          $count: "filteredCount"
        }
      ];
    }

    const result = await Data.aggregate(totalQuery);
    if (result[0]) {
      res.status(200).send({
        filteredCount: result[0].filteredCount
      });
    } else {
      res.status(200).send({
        filteredCount: 0
      });
    }
  } catch (err) {
    console.log(err);
    res.status(405);
    throw new Error("Error occured while searching database");
  }
};

const indexExists = async (fieldName) => {
  const indexes = await Data.collection.listIndexes().toArray();
  const existingIndex = indexes.find(index => index.name == fieldName);
  return existingIndex ? 1 : 0;
};


const getDescriptionImages = async (req, res) => {
  const imageIds = req.body.imageIds;
  const fetchedImages = [];
  try {
    for (let i = 0; i < imageIds.length; i++) {
      const image = await ImageModel.findOne({ _id: new ObjectId(imageIds[i]) });
      fetchedImages.push({
        contentType: image.contentType,
        content: image.content,
      });
    }
    res.status(200).send(fetchedImages);
  } catch (err) {
    console.log(err);
    res.status(405);
    throw new Error("Error occured while fetching description images");
  }

};

const updateDescription = async (req, res) => {
  const { text, title_id } = req.body;
  try {
    const data = await Data.updateOne(
      {
        title_id: title_id
      },
      {
        $set: {
          title_id: Data.title_id,
          title: Data.title,
          catagory: Data.catagory,
          tag: Data.tag,
          description: text,
        }
      },
      {
        upsert: true
      }
    );
    if (data) {
      res.status(200).send({
        message: "success",
      })
    }
  } catch (err) {
    res.status(405);
    throw new Error("Error occured updating description")
  }
};

export {
  searchData,
  getFilteredNumber,
  getDescriptionImages,
  updateDescription,
};