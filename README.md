
<h1 align="center">Chronoside</h1>

<h5 align="center">Chronoside is a text-based multiplayer fantasy role playing game (RPG) developed as a Discord Bot.</h5>
<h5 align="center">This bot was developed as an entry for <a href="https://blog.discordapp.com/discord-community-hack-week-build-and-create-alongside-us-6b2a7b7bba33">Discord's Hack Week</a>.</h5>

[![status](https://img.shields.io/badge/status-pre--alpha-red.svg)](https://github.com/majordwarf/chronoside)
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
- Setup you `mysql` server locally
- Make a copy of `config.json.example` and rename it to `config.json`
- Change the config data inside `config.json`
- Run the bot `yarn start`

<h2 id="help">Help</h2>

```
YOU WON'T BE ABLE TO EXECUTE ANY COMMANDS WHILE TRAVELLING OR WHEN ON ADVENTURE.
YOU NEED TO EXECUTE A COMMAND WHEN TO TRIGGER THE CHECK IF THE CURRENT ACTIVITY [travelling or adventure] is completed or not.
```
Commands - ( `!` - Prefix )

- `begin` - Starts character creator to begin your adventure.
---
- `farm list` - Shows you a list of farm upgrades.
- `farm buy` - To buy a farm patch with 50 gold.
- `farm upgrade` - Upgrade your current farm level.
- `farm collect` - Collect your hourly generated gold from the farm.
---
- `travel cityName` - Travel to the city specified. List of city you can travel -
	- Erysall
	- Qrita
	- Calbury
	- Spawn
---
- `explore` - Explores the current city. You have chance to find hidden loot or encounter mobs while exploring.
---
- `adventure` - Let's you make your character go in a dungeon while begin AFK to gather gold.
---
- `cheats` - Cheat for development debugging process. Arguments available -
	- `gainxp amount` - Gives you the amount of XP specified.
	- `travel cityName` - Instant teleport to the city specified.
	- `gaingold amount` - Gives you the amount of gold specified.
	- `battle` - Triggers battle with random mobs without needing to explpore.
---
- `stats` - Show the server statistics.
---

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

The Chronoside Bot was developed by [@majordwarf](https://github.com/majordwarf), [@segalll](https://github.com/segalll), and [@gcttirth](https://github.com/gcttirth).
