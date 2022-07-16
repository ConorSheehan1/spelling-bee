# Beach Litríochta

https://beach-litriochta.netlify.app/

An Irish version of the New York Times Spelling Bee Puzzle.

|                                                  |                                                      |
| ------------------------------------------------ | ---------------------------------------------------- |
| ![light-sc](.github/images/beach-litriochta.png) | ![dark-sc](.github/images/beach-litriochta-dark.png) |

## Dev

```shell
# install dependencies
yarn install

# dev server
yarn dev
# production build (fails to open locally with file:// protocol due to cors)
yarn build

# lint check
yarn lint
# lint autofix
yarn lintfix
```

## Create derivative files

IrishWords.txt must already exist. It must contain a single word per line.
answers.txt and pangrams.txt are created for debugging.
allAnswers.js is created for use in the game.

```shell
cd data
node /createFiles.js
```
