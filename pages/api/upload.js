import axios from 'axios';
import querystring from 'querystring';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const req_body = req.body;
  const map = querystring.parse(req_body)
  const body = new FormData();
  body.append("contentImage", imagesState["contentImage"]["i"]);
  body.append("styleImage", imagesState["styleImage"]["i"]);
  console.log("uploadToNN posting");
  axios.post("http://tranoo.com:9999/", {
    method: "POST",
    body
  }).then(res => {
      console.log("http reply:",res)
      res.status(200).json({ response: res }); //TODO
  }).catch(err => {
      console.log("http reply (error):", err.message, err)
      res.status(500).json({ error: err });
  });

}
