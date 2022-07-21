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

_Warning_: this operation may result in the same puzzle repeating too often.
This operation is not idempotent. Re-creating allAnswers.ts may change the order of the puzzles, resulting in the same puzzle twice in a row on deploy in the worst case.

IrishWords.txt must already exist. It must contain a single word per line.
answers.txt and pangrams.txt are created for debugging.
allAnswers.ts is created for use in the game.

```shell
cd data
yarn createFiles
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
