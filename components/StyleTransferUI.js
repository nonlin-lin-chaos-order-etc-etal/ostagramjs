import { useState } from "react";
import Head from 'next/head'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { normalize } from 'polished'

function currentStyleTransferUI() {
    const INITIAL_IMAGES_STATE = {
        "contentImage":{"src":undefined,"w":256,"h":256},
        "styleImage":{"src":undefined,"w":256,"h":256},
        "resultImage":{"src":undefined,"w":256,"h":256},
    };

    // "showUploader","showProgress","showResults"
    const [currentState, setState] = useState("showUploader");
    const [imagesState, setImagesState] = useState(INITIAL_IMAGES_STATE);

    function resetImages() { setImagesState(INITIAL_IMAGES_STATE) }
    function uploadImage(imageKey) { alert(imageKey); }; //tbd

    function getImageSrc(imageKey) { return imagesState[imageKey]["src"]; }
    function getImageWidth(imageKey) { return imagesState[imageKey]["w"]; }
    function getImageHeight(imageKey) { return imagesState[imageKey]["h"]; }

    function bothImagesUploaded() {
        var count = 0;
        if (imagesState["contentImage"]["src"]) ++count;
        if (imagesState["styleImage"]["src"]) ++count;
        return count == 2;
    }

    if (currentState == "showUploader") {
        return (<>
            <h1>Please upload two images</h1>
            <table border={0}><tr>
                <td>
                    <Image src={getImageSrc("contentImage")} width={getImageWidth("contentImage")} height={getImageHeight("contentImage")} alt="Content image" />
                    <button
                        type="button"
                        onClick={() => uploadImage("contentImage")}
                    >Upload Content Image</button>
                </td>
                <td>
                    <Image src={getImageSrc("styleImage")} width={getImageWidth("styleImage")} height={getImageHeight("styleImage")} alt="Style image" />
                    <button
                        type="button"
                        onClick={() => uploadImage("styleImage")}
                    >Upload Style Image</button>
                </td>
            </tr></table>
            <p>
                <button
                    type="button"
                    onClick={() => setState("showProgress")}
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
        setTimeout(() => setState("showResults"), 5000);
        return (<>
            <h1>Style transfer in progress, please wait...</h1>
            <p>
            </p>
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

export default function IndexPage ({ children, theme, title = 'Style Transfer UI' }) (
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

      

      {/*children*/}

      <GlobalStyle />
    </Container>
  </ThemeProvider>
)
