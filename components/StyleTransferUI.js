import { useState } from "react";
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
    const [progressState, setProgressState] = useState({"status_msg":"Idle"});

    function resetImages() { setImagesState(INITIAL_IMAGES_STATE) }
    function getImageSrc(imageKey) { return imagesState[imageKey]["src"]; }
    function getImageWidth(imageKey) { return imagesState[imageKey]["w"]; }
    function getImageHeight(imageKey) { return imagesState[imageKey]["h"]; }

    function bothImagesUploaded() {
        var count = 0;
        if (imagesState["contentImage"]["src"]) ++count;
        if (imagesState["styleImage"]["src"]) ++count;
        return count == 2;
    }

    const uploadToClient = (event, imageKey) => {
      if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        var imagesStateNew = imagesState;
        imagesStateNew[imageKey]["i"]=i;
        imagesStateNew[imageKey]["src"]=URL.createObjectURL(i);
        setImagesState(imagesStateNew)
      }
    };
  
    const uploadToServer = async () => {
        setState("showProgress")
        setProgressState({"status_msg":"Uploading images..."})
        const body = new FormData();
        body.append("contentImage", imagesState["contentImage"]["i"]);
        body.append("styleImage", imagesState["styleImage"]["i"]);
        const response = await fetch("/api/upload", {
            method: "POST",
            body
        });
        setProgressState({"status_msg":"Uploaded images, mixing images with the neural network... TODO"})
    };
  
    if (currentState == "showUploader") {
        return (<>
            <h1>Please upload two images</h1>
            <table border={0}><tr>
                <td>
                    <Image src={getImageSrc("contentImage")} width={getImageWidth("contentImage")} height={getImageHeight("contentImage")} alt="Content image" />
                    <input type="file" name="Upload Content Image" onChange={(event)=>uploadToClient(event,"contentImage")} />
                    <p>Upload Content Image</p>
                </td>
                <td>
                    <Image src={getImageSrc("styleImage")} width={getImageWidth("styleImage")} height={getImageHeight("styleImage")} alt="Style image" />
                    <input type="file" name="Upload Style Image" onChange={(event)=>uploadToClient(event,"styleImage")} />
                    <p>Upload Style Image</p>
                </td>
            </tr></table>
            <p>
                <button
                    type="button"
                    onClick={uploadToServer()}
                    disabled={ () => bothImagesUploaded() ? "false" : "disabled" }
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
            <p><i>{progressState["status_msg"]}</i></p>
            <p><i>Please wait</i></p>
        </>);
    }
    if (currentState == "showResults") {
        return (<>
            <h1>Style Transfer Results</h1>
            <h2>Source Images</h2>
            <table border={0}><tr>
                <td>
                    <Image src={getImageSrc("contentImage")} width={getImageWidth("contentImage")} height={getImageHeight("contentImage")} alt="Content image" />
                </td>
                <td>
                    <Image src={getImageSrc("styleImage")} width={getImageWidth("styleImage")} height={getImageHeight("styleImage")} alt="Style image" />
                </td>
            </tr></table>
            <h2>Result Image</h2>
            <p align="center">
                <Image src={getImageSrc("resultImage")} width={getImageWidth("resultImage")} height={getImageHeight("resultImage")} alt="Result image" />
            </p>
            <p>
                <button
                    type="button"
                    onClick={() => setState("showUploader")}
                >Mix Another Pair</button>
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