import React, {useState} from 'react'
import {
  ThemeProvider,
  CSSReset,
  theme,
  Box,
  Heading,
  Stack,
  Button,
  Badge,
  Text,
  Textarea,  
  Link
} from '@chakra-ui/core'

import * as _ from 'lodash';
import { result } from 'lodash';
const App = () => {

  const [inputText, setInputText] = useState(null)
  const [parsedLetters, setParsedLetters] = useState(null)
  const [words, setWords] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const shuffleText = v=>[...v].sort(_=>Math.random()-.5).join('');

  const parseText = async () => {
    let text = inputText.replace(/[^A-Z0-9]/ig, "").split("");
    await setParsedLetters(text);
    const previousWords = [];
    // https://api.datamuse.com/words?lc=with&sp=w*
    Promise.all(text.map(async(letter,index) => {
        const response = await fetch(`https://api.datamuse.com/words?sp=${letter}*&lc=${ ''}`).then(res => res.json());
        const word = response[text.length].word || response[0].word;
        previousWords.push(word);
        console.log({previousWords});
        return word;
      })).then(res => {
        setIsLoading(false);
        setWords(res);
      });
    }

  return (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Box backgroundColor="whiteAlpha.500">
      <Box p={6} display="flex" flexDirection="column" backgroundColor="blackAlpha.100" width="100%">
        <Heading size="2xl" p={16} textAlign="center">
          Cipher
        </Heading>
        <Link mx="auto" maxW="300px" textAlign="center" href="https://thesiddd.com" target="_blank"> made by thesiddd</Link>
      </Box>
      <Box>
        <Stack
          maxWidth="800px"
          ml="auto"
          mr="auto"
          p={12}
          spacing={5}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Heading>Enter some text</Heading>
          <Text>
            We'll encode this text into a key and generate a ciphered out
            message for you.
          </Text>
          <Textarea onChange={(e) => setInputText(e.target.value)} />
          <Button loadingText="Talking to our Cipher Robots..." isLoading={isLoading} 
            onClick={() => {
              parseText();
              return setIsLoading(!isLoading)
            }}
            variantColor="messenger">Cipher me</Button>
          {words && 
          <>
            <Heading mb={3}>Ciphered Words</Heading>
            <Textarea cursor="pointer" isDisabled value={_.capitalize(_.toLower(words.join(" "))) + "."} />
                <Heading mt={4}>Ciphered Sentence<Badge p={2} variantColor="green" variant="outline" ml={4}>Coming Soon</Badge></Heading>
          </>
          }
        </Stack>
      </Box>
    </Box>
  </ThemeProvider>
  )
}
export default App;
