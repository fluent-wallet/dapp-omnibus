# pnpm allow only

# How to add a dependency to a sub-project

pnpm add <package-name> --filter <sub-project-folder-name>
pnpm add react --filter react-utils

# How to auto release

First pull a new branch from main and make your code changes.
Then run the **npm run changeset** command, select the sub-projects that have been changed.
Then press enter to skip the major and minor selections and select the patch version.
After writing the update Summary, run the **npm run version** command.
Finally, just commit the PR to the main branch and wait for the bot to execute the release. 