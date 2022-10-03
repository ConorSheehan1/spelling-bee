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
This operation is not idempotent. Re-creating allAnswers.json will change the order of the puzzles, which could result in the same puzzle twice in a row on deploy in the worst case. As of the latest version (v2.2.1) I've made `createRandomGenerator` that produces pseudo-random numbers but can be given a seed to produce the same sequence of random numbers. This should make the operation idempotent.

1. Create `AllWords.txt`
  This is only required if there are changes to `wordsAdded.txt` or `wordsRemoved.txt`.
  ```shell
  yarn createAllWords
  ```
2. Create `allAnswers$N.json`
  ```shell
  yarn createFiles
  ```
  `AllWords.txt` must already exist. It must contain a single word per line.
  `answers.txt` and pangrams.txt are created for debugging.
  `allAnswers.json` is created for use in the game.



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
