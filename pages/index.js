import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import lightTheme from '../styles/light-theme'

import StyleTransferUI from '../components/StyleTransferUI'

export default () => {
  return (
    <StyleTransferUI theme={lightTheme} name='Style Transfer Neural Network Demo using Next.js'/>
  )
}
