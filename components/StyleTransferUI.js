import { useState, createElement } from "react";
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import Head from 'next/head'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { normalize } from 'polished'
import Image from 'next/image'

function CurrentStyleTransferUI() {
    const INITIAL_IMAGES_STATE = {
        "contentImage":{"src":undefined,"w":256,"h":256,"i":null,"createObjectURL":null},
        "styleImage":{"src":undefined,"w":256,"h":256,"i":null,"createObjectURL":null},
        "resultImage":{"src":undefined,"w":256,"h":256,"i":null,"createObjectURL":null},
    };

    // "showUploader","showProgress","showResults"
    const [currentState, setState] = useState("showUploader");
    const [imagesState, setImagesState] = useState(INITIAL_IMAGES_STATE);
    const [moment_stamp, set_moment_stamp] = useState(Date.now()+"_"+Math.random());
    const [progressState, setProgressState] = useState({"status_msg":"Idle"});

    function resetImages() { console.log("resetImages enter"); setImagesState(INITIAL_IMAGES_STATE) }
    function getImageSrc(imageKey) {
        console.log(`getImageSrc(${imageKey}): returning ${imagesState[imageKey]["src"]}`);
        return imagesState[imageKey]["src"];
    }
    function getImageWidth(imageKey) { return imagesState[imageKey]["w"]; }
    function getImageHeight(imageKey) { return imagesState[imageKey]["h"]; }

    function bothImagesUploaded() {
        var count = 0;
        if (imagesState["contentImage"]["src"]) ++count;
        if (imagesState["styleImage"]["src"]) ++count;
        return count == 2;
    }

    const uploadToClient = (event, imageKey) => {
      console.log(`uploadToClient(${event}, ${imageKey}) entered`)
      if (event.target.files && event.target.files[0]) {
        console.log(`uploadToClient: triggered the handling`)
        const i = event.target.files[0];
        console.log(`uploadToClient: i: '${i}'`)
        var imagesStateNew = imagesState;
        imagesStateNew[imageKey]["i"]=i;
        imagesStateNew[imageKey]["src"]=URL.createObjectURL(i);
        //setImagesState(null); //to trigger React refresh FIXME
        //setTimestamp(Date.now());
        setImagesState(imagesStateNew);
        set_moment_stamp(Date.now()+"_"+Math.random());

        const img = createElement("img", {
            onLoad: () => {
                var imagesStateNewWH = imagesState;
                imagesStateNewWH[imageKey]["w"]=img.width;
                imagesStateNewWH[imageKey]["h"]=img.height;
                //setImagesState(null); //to trigger React refresh FIXME
                //setTimestamp(Date.now());
                setImagesState(imagesStateNewWH);
                set_moment_stamp(Date.now()+"_"+Math.random());
            },
            src: imagesStateNew[imageKey]["src"]
         }, null);
      }
    };

    const fetcher = (url, body) => axios.post(url, {
        method: "POST",
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body
    }).then(res => {
        console.log("http reply:",res)
        return res.data
    });
  
    const uploadToServer = () => {
        console.log("uploadToServer enter");
        setState("showProgress")
        setProgressState({"status_msg":"Uploading images..."})
        console.log("uploadToServer new FormData");
        const body = new FormData();
        body.append("contentImage", imagesState["contentImage"]["i"]);
        body.append("styleImage", imagesState["styleImage"]["i"]);
        console.log("uploadToServer posting");

        const { query } = useRouter()
        const { data, error } = useSWR(
          () => `/api/upload`,
          url => fetcher(url, body)
        )

        if (error) {
            set_moment_stamp(Date.now()+"_"+Math.random());
            setProgressState({"status_msg":`Error: ${error.message}`})
            return
        }
        if (!data){
            setProgressState({"status_msg":`Uploading images...`})
            return
        }
        set_moment_stamp(Date.now()+"_"+Math.random());
        setProgressState({"status_msg":"Uploaded images, mixing images with the neural network..."})
    };
  
    if (currentState == "showUploader") {
        return (<>
            <h1>Please upload two images</h1>
            <table border={0}><tr>
                <td>
                    <Image key={moment_stamp} src={getImageSrc("contentImage")} width={getImageWidth("contentImage")} height={getImageHeight("contentImage")} alt="Content image" />
                    <input type="file" name="Upload Content Image" onChange={(event)=>uploadToClient(event,"contentImage")} />
                    <p>Upload Content Image</p>
                </td>
                <td>
                    <Image key={moment_stamp} src={getImageSrc("styleImage")} width={getImageWidth("styleImage")} height={getImageHeight("styleImage")} alt="Style image" />
                    <input type="file" name="Upload Style Image" onChange={(event)=>uploadToClient(event,"styleImage")} />
                    <p>Upload Style Image</p>
                </td>
            </tr></table>
            <p>
                <button
                    type="button"
                    onClick={uploadToServer}
                    disabled={!bothImagesUploaded()}
                >Submit For Processing</button>
                <button
                    type="button"
                    onClick={() => resetImages()}
                >Reset This Form</button>
            </p>
        </>);
    }
    if (currentState == "showProgress") {
        // setTimeout(() => setState("showResults"), 5000);
        return (<>
            <h1>Progress Status</h1>
            <hr/>
            <p><i>{progressState["status_msg"]}</i></p>
            <hr/>
            <p><i>Please wait</i></p>
            <hr/>
            <p>
                <button
                    type="button"
                    onClick={() => setState("showUploader")}
                >Start Again</button>
            </p>
        </>);
    }
    if (currentState == "showResults") {
        return (<>
            <h1>Style Transfer Results</h1>
            <hr/>
            <h2>Source Images</h2>
            <table border={0}><tr>
                <td>
                    <Image src={getImageSrc("contentImage")} width={getImageWidth("contentImage")} height={getImageHeight("contentImage")} alt="Content image" />
                </td>
                <td>
                    <Image src={getImageSrc("styleImage")} width={getImageWidth("styleImage")} height={getImageHeight("styleImage")} alt="Style image" />
                </td>
            </tr></table>
            <hr/>
            <h2>Result Image</h2>
            <p>
                <Image src={getImageSrc("resultImage")} width={getImageWidth("resultImage")} height={getImageHeight("resultImage")} alt="Result image" />
            </p>
            <hr/>
            <p>
                <button
                    type="button"
                    onClick={() => setState("showUploader")}
                >Start Again</button>
            </p>
        </>);
    }
    throw `invalid state for style transfer ui component: '${currentState}'`;
};


const GlobalStyle = createGlobalStyle`

  ${normalize()}

  html {
    font-family: 'Roboto', sans-serif;
  }

  `

const Container = styled.main`
  align-content: center;
  align-items: center;
  background-color: ${props => props.theme.palette.backgroundColor};
  color: ${props => props.theme.palette.textColor};
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  min-height: 100vh;
`

export default function StyleTransferUI ({ children, theme, title = 'Style Transfer UI' }) { return (
  <ThemeProvider theme={theme}>
    <Container>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/favicon.png' />
        <link
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
          rel='stylesheet'
        />
      </Head>

      <CurrentStyleTransferUI/>

      {/*children*/}

      <GlobalStyle />
    </Container>
  </ThemeProvider>
) }