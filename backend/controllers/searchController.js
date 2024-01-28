import Data from "../models/data.js";
import Logger from "../models/logger.js";

const searchData = async (req, res) => {
  let { word, advance, searchin, pageIndex, numberPerPage, sortMethod, descending } = req.body;
  console.log(sortMethod)
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
          {
            $skip: numberPerPage * (pageIndex - 1)
          },
          {
            $limit: numberPerPage
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
        {
          $skip: numberPerPage * (pageIndex - 1)
        },
        {
          $limit: numberPerPage
        },
      ];
    }
    if(sortMethod) {
      totalQuery.splice(1, 0, {$sort: { title_id: descending?-1:1 }});
    } else {
      totalQuery.splice(1, 0, {$sort: { rate: descending?-1:1 }});
    }
    console.log(totalQuery)
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
    res.status(500);
    throw new Error("Error occured while searching database");
  }
};

const indexExists = async (fieldName) => {
  const indexes = await Data.collection.listIndexes().toArray();
  const existingIndex = indexes.find(index => index.name == fieldName);
  return existingIndex ? 1 : 0;
};

const updateDescription = async (req, res) => {
  const { user, text, newTag, title_id } = req.body;

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
      await Logger.create({
        name: "Update Description",
        status: "Success",
        user: user,
        time: new Date().toUTCString(),
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
      time: new Date().toUTCString(),
      detail: `Update Description(${title_id})`,
    });
    res.status(500);
    throw new Error("Error occured updating description")
  }
};

const rateDescription = async (req, res) => {
  const { title_id, rate } = req.body;
  
  try {
    let data = await Data.findOne({ title_id });
    let curRate = 0, curRatedCount = 0;
    if(data) {
      curRate = data.rate;
      curRatedCount = data.ratedCount;
      console.log(curRate, curRatedCount)
      // console.log(curRate, curRatedCount)
      // const result = await Data.updateOne({ title_id: title_id },  {
      //   $set: {
      //     rate: (curRate + rate) / (curRatedCount + 1),
      //     ratedCount: curRatedCount + 1
      //   }
      // }, {
      //   upsert: true
      // });
      // if(result) {
      //   res.status(200).send("success");
      // }
      data.rate = ((data.rate*data.ratedCount+rate)/(data.ratedCount+1)).toFixed(2);
      data.ratedCount = data.ratedCount+1;
      const result = await data.save();   



      
      if(result) {
        res.status(200).send("success");
      }
    }

  } catch (err) {
    res.status(500);
    throw new Error("failed rating");
  }
};

const deleteDescription = async (req, res) => {
  const result = await Data.deleteOne({ title_id: req.params.id });
  if (result) {
    res.status(200).send({
      message: "success",
    });
  } else {
    res.status(205).send({
      message: "not found"
    });
  }

};

export {
  searchData,
  getFilteredNumber,
  updateDescription,
  rateDescription,
  deleteDescription,
};