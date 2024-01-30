# My Advent of Code 2023 solutions
in `TypeScript` this time. 

I know, these are far from perfect, but I only had so much time to solve the puzzles. They work, so don't be too judgmental :) 

## How to use it

### Setup
- `npm install` will help to start
- you need to get your session id, and store it in `assets/session_id.txt`
  - if you are signed in to [adventofcode.com](https://adventofcode.com/), just try to open your puzzle input for any day, and peek into the request headers

### Solve a puzzle
- set the content of `dayConfig.json` each day to the corresponding year and day
- create a directory in `src/impl/${year}`
- in that directory create a file `day${day}.ts`
- create a single class in it, with `export default` and extend the `Solver` abstract class
- implement `part1()` and `part2()` methods. 
- your class will inherit an `origInput: string` field from `Solver`, which contains the raw (test or production) input data
- the `input` field should contain the parsed input, you are free to pick its type
- to parse the input data, look at the `Parsers` utility class in 

### Good to know
There are a few useful dependencies, like 
- [lodash](https://lodash.com/) 
- [ts-matrix](https://github.com/Kapcash/ts-matrix#readme) 
- [graphology](https://graphology.github.io/) 
- [math-js](https://mathjs.org/)
- [flatten-js](https://github.com/alexbol99/flatten-js)
- [Open3d](https://github.com/ccc159/Open3d)

But I have a few of my own utility classes/methods. 

- In particular, I extended the `Matrix` class from ts-matrix by `MatrixExt` to be able to get specific columns and rotate/transpose the matrix. 
- I also started to work with an extended version of `Vector` from ts-matrix called `Vector2D`, but that did not turn out a good idea. Use `Vector` from flatten-js instead, which nicely distinguishes between a 2d point and a 2d vector. 
- I created an implementation of hashmap and hashset. Not very sophisticated though, but they work. 

### Test & submit
Look at the `package.json` npm jobs, you'll find the following:
- `npm run test_part1`
- `npm run test_part2`
  - will attempt to download the test input data and the expected solution from the current day's and year's (set in `dayConfig.js`) page, e.g. [https://adventofcode.com/2023/day/20](https://adventofcode.com/2023/day/20)
  - will run the implementation on the test input data, print the result on the console and mark if it equals to the expected test solution
- `npm run solve_part1`
- `npm run solve_part2`
  - will attempt to download your production input data for the current day from e.g. [https://adventofcode.com/2023/day/20/input](https://adventofcode.com/2023/day/20/input)
  - will run the implementation on the production data and print the result on the console
- `npm run solve_and_submit_part1`
- `npm run solve_and_submit_part2`
  - will do the same as solve_part*, but it will also try to submit the solution in the production environment, and print the server's response on the console. 

### Under the hood
- The test inputs, test solutions and production inputs are stored in `assets/inputs/year${year}/`. Please don't push these to your repo, they are ignored by `git`. 
- Naturally, if some of these assets is already present, download will not be attempted at the next run of any npm job. 
- Beware that the download of the test input and solution data is not perfect. It will try to parse the html page of the input. Sometimes it errs (so you better check the downloaded data yourself), and sometimes it just fails to find the parts in question, so you will have to paste the data by hand in the corresponding file in `/assets`. To help, it will communicate with you on the console, and print the data it finds. 