import axios from 'axios';
import querystring from 'querystring';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  axios.post("http://tranoo.com:9999/api/upload_into_style_transfer_type_2_nn", {
    method: "POST",
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify(req.body)
  }).then(res => {
      console.log("http reply:",res)
      res.status(200).json({ response_body: res.body }); //TODO
  }).catch(err => {
      console.log("http reply (error):", err.message, err)
      res.status(500).json({ error_message: err.message });
  });

}
