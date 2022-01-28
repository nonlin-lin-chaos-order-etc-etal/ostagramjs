import axios from 'axios';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
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
