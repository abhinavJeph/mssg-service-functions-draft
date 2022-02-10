const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const db = require("./config/mongoose");
const axios = require("axios");
const Message = require("./models/Message");
const Service = require("./models/Service");

app.use(express.urlencoded({ extended: true }));

// Body Parser middleware
app.use(express.json());

//third party API (Dummy API) - GUPSHUP
app.post("/api/v1/template/msg", (req, res) => {
  return res.status(200).send({
    messageId: "bf70b8c4-a5b9-4acd-b108-512ce704f4dc",
    status: "submitted",
  });
});

//posting message in DB
app.post("/message", (req, res) => {
  const body = req.body;

  const date = new Date();
  Object.assign(body, {
    operatingTime: date.getTime(),
  });
  const mssg = Message.create(body);
  return res.status(200).send({ message: "Success" });
});

const getUrlEncodedData = (data) => {
  const resultantData = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    resultantData.append(
      key,
      typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]
    );
  });
  return resultantData;
};

//worker function
const sendMessage = async (serviceDetails, mssg) => {
  try {
    const { id, user, template } = mssg;

    const params = getUrlEncodedData({
      source: serviceDetails.source,
      destination: user.number,
      template: {
        id: template.templateID,
        params: template.params,
      },
    });

    const url = "http://localhost:8000/api/v1/template/msg";
    const config = {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        apiKey: serviceDetails.apiKey,
      },
    };

    const res = await axios.post(url, params, config);
    // await Message.findByIdAndDelete(id);

    return res;
  } catch (error) {
    console.log(error);
    return { status: 500, data: "Error occured" };
  }
};

//orchestrator API
app.get("/orchestrator", async (req, res) => {
  const date = new Date();
  var mssg = await Message.findOne({
    status: false,
    operatingTime: { $lte: date.getTime() },
  });

  if (!mssg) return res.status(400).send({ message: "No current mssg held" });

  var service = await Service.findOne({ name: mssg.service });

  var timeDelay = 0;
  var limitHit = service.limiters.some((limit) => {
    const currentTime = date[limit.name]();
    if (limit.time == currentTime) {
      var hit = limit.count == limit.maxLimit;
      if (hit) timeDelay = limit.duration * 60 * 1000; // 1 minute = 60,000 milisecond
      return hit;
    } else {
      limit.time = currentTime; //to reset count and update time
      limit.count = 0;
      return false;
    }
  });

  if (limitHit) {
    mssg.operatingTime = date.getTime() + timeDelay;
    await mssg.save();
    await service.save(); //to update currentTime
    return res.status(200).send({ message: "API limit hitted" });
  }

  //At this point NO API limit has been hit and we are ready to call the third party service

  service.limiters.forEach((limiter) => limiter.count++);
  await service.save();

  //status = true means the mssg has been sent to "worker function" to call the service
  mssg.status = true;
  await mssg.save();

  // console.log(service);
  // console.log(mssg);

  service = JSON.parse(JSON.stringify(service));
  const { status, data } = await sendMessage(service, mssg);
  return res.status(status).send(data);
});

app.listen(port, (err) => {
  if (err) {
    console.log("Error in connecting the server : " + err);
    return;
  }
  console.log(`Server is up and running on port ${port}`);
});

module.exports = app;
