<h1 align="center">Chronoside</h1>

<h5 align="center">Chronoside is a text-based multiplayer fantasy role playing game (RPG) developed as a Discord Bot.</h5>
<h5 align="center">This bot was developed as an entry for <a href="https://blog.discordapp.com/discord-community-hack-week-build-and-create-alongside-us-6b2a7b7bba33">Discord's Hack Week</a>.</h5>

[![status](https://img.shields.io/badge/status-pre--alpha-red.svg)](https://github.com/majordwarf/chronoside)
[![Build Status](https://travis-ci.org/majordwarf/chronoside.svg?branch=master)](https://travis-ci.org/majordwarf/chronoside)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/majordwarf/chronoside.svg)](https://github.com/majordwarf/chronoside/issues/)

---

<p align="center">
  <a href="#setup">Setup</a>&nbsp;&nbsp;
  <a href="#help">Help</a>&nbsp;&nbsp;
  <a href="#testing">Testing</a>&nbsp;&nbsp;
  <a href="#contributing">Contributing</a>&nbsp;&nbsp;
  <a href="#cite">Contributors</a>
</p>

---

<h2 id="setup">Setup</h2>

- Clone the repository `git clone https://github.com/majordwarf/chronoside`
- Navigate inside the repository `cd chronoside`
- Install the dependencies ( yarn is recommended ) `yarn`
- Change the config data inside `config.json`
- Run the bot `yarn start`

<h2 id="help">Help</h2>

Commands - ( `$` - Prefix )

- `start` - Starts character creator to begin your adventure.


<h2 id="testing">Testing</h2>

<h2 id="contributing">Contributing</h2>

To add a new feature or fix a bug follow the steps - 

- Make sure your local workspace is up-to-date with the main repository.
    - Add the original repository as `upstream` in you local git remote `git remote add upstream https://github.com/majordwarf/chronoside`
    - Fetch the latest code `git fetch remote upstream master`
    - Checkout to your local master branch `git checkout master`
    - Merge changes from `upstream/master` to sync `git merge upstream/master`
- Create a new branch to work on the new feature or bug via the updated master branch `git checkout -b "branch_name"`
- Work on feature/bug and stage all the files to commit it on that branch `git add .` > `git commit -m "Commit Message"`
- Push the branch to your fork `git push -u origin branch_name`
- Create a pull request.

<h2 id="cite">Contributors</h2>

The Chronoside Bot was developed by [@majordwarf](https://github.com/majordwarf), [@segalll](https://github.com/segall), and [@gcttirth](https://github.com/gcttirth).