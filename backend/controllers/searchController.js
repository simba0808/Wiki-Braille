import Data from "../models/data.js";

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
            $sort: { "title_id": 1 }
          },
          {
            $skip: numberPerPage * (pageIndex - 1)
          },
          {
            $limit: numberPerPage
          }
        ];
      } else {
        totalQuery = [
          query,
          {
            $match: {
              catagory: advance,
            }
          },
          { $addFields: { score: { $meta: "textScore" } } },
          { $sort: { score: { $meta: "textScore" } } },
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
          $sort: { "title_id": 1 }
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
    if (!await indexExists("title")) {
      await Data.collection.createIndex({ title_id: "text", title: "text", tag: "text", description: "text" }, { name: "title" }, { default_language: "portuguese" });
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

const updateDescription = async (req, res) => {
  const { text, newTag, title_id } = req.body;
  
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
          tag: newTag,
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
  updateDescription,
};