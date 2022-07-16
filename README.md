# Beach Litríochta

## Dev

```shell
# install dependencies
yarn install

# dev server
yarn run dev
# production build (fails to open locally with file:// protocol due to cors)
yarn run build

# lint check
yarn run lint
# lint autofix
yarn run lintfix
```

## Create derivative files

IrishWords.txt must already exist. It must contain a single word per line.
answers.txt and pangrams.txt are created for debugging.
allAnswers.js is created for use in the game.

```shell
cd data
node /createFiles.js
```
