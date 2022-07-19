## Build Setup

```shell
# install dependencies
yarn install

# dev server
yarn dev
# production build (fails to open locally with file:// protocol due to cors)
yarn build
```

### Create derivative files

IrishWords.txt must already exist. It must contain a single word per line.
answers.txt and pangrams.txt are created for debugging.
allAnswers.js is created for use in the game.

```shell
cd data
node /createFiles.js
```

## Linting

```
# lint check
yarn lint
# lint autofix
yarn lintfix
```

## Versioning

```shell
# set version prefix
yarn config set version-tag-prefix "v"

# set version explicitly
yarn version --new-version <version>

# bump minor version
yarn version --minor
```
