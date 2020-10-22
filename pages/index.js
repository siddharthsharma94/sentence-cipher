import React, {useState} from 'react'
import {
  ThemeProvider,
  CSSReset,
  theme,
  Tag,
  Box,
  Heading,
  Input,
  Stack,
  Button,
  Text,
  Textarea  
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
    Promise.all(text.map(async(letter) => {
        const response = await fetch(`https://api.datamuse.com/words?sp=${letter}*`).then(res => res.json());
        const word = response[text.length];
        return word.word
      })).then(res => {
        setIsLoading(false);
        setWords(res);
      });
    }

  return (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Box backgroundColor="whiteAlpha.500">
      <Box backgroundColor="blackAlpha.100" width="100%">
        <Heading size="2xl" p={16} textAlign="center">
          Cipher
        </Heading>
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
            <Stack isInline spacing={4} my={8}>
                <Heading>Ciphered Sentence</Heading>
                <Tag size={"sm"}>Coming Soon</Tag>
            </Stack>

          </>
          }
        </Stack>
      </Box>
    </Box>
  </ThemeProvider>
  )
}
export default App;
