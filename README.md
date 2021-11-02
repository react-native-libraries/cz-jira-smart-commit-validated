![npm (scoped)](https://img.shields.io/npm/v/@react_native_libraries/react-native-network-state-listener) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) ![npm](https://img.shields.io/npm/dw/@react_native_libraries/react-native-network-state-listener)

# cz-jira-smart-validated

[](https://raw.githubusercontent.com/react-native-libraries/cz-jira-smart-validated/main/images/banner.jpeg)

## About

Standardize your team's commits using this adapter for commitzen.

This adapter makes it possible to specify and validate the commit of a project that uses Jira as a tool
of management. Using this tool you can benefit from using Jira's [smart commit commands](https://confluence.atlassian.com/fisheye/using-smart-commits-960155400.html#:~:text=%C2%A0-,Smart%20Commit%20commands,transition,-Comment) more easily without having to worry about remembering which commands are available and which syntax must be respected. Besides, it is a perfect adapter to be used together with [semantic versioning](https://github.com/semantic-release/semantic-release).

This adapter was based on [cz-jira-smart-commit](https://github.com/commitizen/cz-jira-smart-commit) and [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog).

## Highlights

-   Standardizes the squad commit;
-   Can be used together with [semantic-release](https://github.com/semantic-release/semantic-release);
-   Prevents typing errors, preventing an erroneous flow in relation to smart commit commands;
-   Prevents an invalid team from being informed to Jira, forcing the default(1w 1d 1h 1m);
-   Prevents an Issue ID from being informed with a key different from the one specified as default;
-   Validates the commit title size respecting the defined limitation.

## Example

**Flow sample:**
![sampleFlow](https://raw.githubusercontent.com/react-native-libraries/cz-jira-smart-validated/main/images/commitExample.jpeg)

**Sample of the result of mounting the commit using this adapter:**
![sampleFlow](https://raw.githubusercontent.com/react-native-libraries/cz-jira-smart-validated/main/images/expectedResult.jpeg)

## Installation

**If using yarn:**

```javascript
yarn add cz-jira-smart-validated
```

**If using npm:**

```javascript
npm i cz-jira-smart-validated
```

## Usage

**Reference cz-jira-smart-commit-validated path in commitzen path property:**

```javascript
{
    ...
 "config": {
        "commitizen": {
            "path": "./node_modules/cz-jira-smart-commit-validated",
            "disableScopeLowerCase": false,
            "disableSubjectLowerCase": false,
            "maxHeaderWidth": 100,
            "maxLineWidth": 100,
            "defaultType": "",
            "defaultScope": "",
            "defaultSubject": "",
            "defaultBody": "",
            "defaultIssuesPrefix": "EVOLOG",
            "enableMultiIssuesIdByCommit": false
        }
    }
}
```

Example of what would look like [package.json](https://gist.github.com/Kalebesamuel/545a5d53d145ffe8e2a29dcaef7a77f1) of a project using cz-jira-smart-commit-validated.

**To use adapter after integration with commitzen, just run:**

```javascript
git cz
```

or if you prefer, you can use [husky](https://www.npmjs.com/package/husky) to trigger the hook [prepare-commmit-msg](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks#:~:text=The%20prepare-commit,programmatically%20insert%20information.). Inside this hook this line should be executed:

```javascript
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

**Example of how the hook would look:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

    exec < /dev/tty && node_modules/.bin/cz --hook || true
```

So whenever the command is executed:

```javascript
git commit
```

The commitzen will be triggered via the husky using cz-jira-smart-commit-validated.

## Documentation

### cz-jira-smart-validated

| Property Name               | Environment Variable Name           | Description                                                                                                                                                                                                                                                                              | Default                                                                                                   |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| types                       | N/A                                 | Defines the types of changes that can be used.                                                                                                                                                                                                                                           | [conventional-commit-types](https://github.com/commitizen/conventional-commit-types/blob/HEAD/index.json) |
| workflowOptions             | N/A                                 | Defines the workflow options to be triggered in Jira.                                                                                                                                                                                                                                    | [workflowOptions](https://gist.github.com/Kalebesamuel/a20cd50e0e681a54094686a39c24b299)                  |
| defaultType                 | CZ_TYPE                             | Defines the default commit type.                                                                                                                                                                                                                                                         | ""                                                                                                        |
| defaultScope                | CZ_SCOPE                            | Defines the default scope of the commit.                                                                                                                                                                                                                                                 | ""                                                                                                        |
| defaultSubject              | CZ_SUBJECT                          | Defines the default commit subject.                                                                                                                                                                                                                                                      | ""                                                                                                        |
| defaultBody                 | CZ_BODY                             | Defines the default body of the commit.                                                                                                                                                                                                                                                  | ""                                                                                                        |
| defaultIssuesPrefix         | CZ_ISSUES_PREFIX                    | Defines the prefix for the project's Jiras Issue IDs. If the branch name starts with defaultIssuesPrefix, the branch name is seen as the default Jira Issue ID, assuming the branch name is EVOLOG-1234, so when the Issues name is required, the default Issue ID would be EVOLOG-1234. | ""                                                                                                        |
| enableMultiIssuesIdByCommit | CZ_ENABLE_MULTI_ISSUES_ID_BY_COMMIT | Defines whether or not it is possible to report more than one Issue ID per commit.                                                                                                                                                                                                       | false                                                                                                     |
| disableScopeLowerCase       | DISABLE_SCOPE_LOWERCASE             | Disables the passing of characters from scope to lowercase.                                                                                                                                                                                                                              | false                                                                                                     |
| disableSubjectLowerCase     | DISABLE_SUBJECT_LOWERCASE           | Disables the passing of characters from the commit title to lowercase.                                                                                                                                                                                                                   | false                                                                                                     |
| maxHeaderWidth              | CZ_MAX_HEADER_WIDTH                 | Defines how many characters the commit title can be.                                                                                                                                                                                                                                     | 100                                                                                                       |
| maxHeaderWidth              | CZ_MAX_LINE_WIDTH                   | Defines the maximum number of characters per line.                                                                                                                                                                                                                                       | 100                                                                                                       |

## Contributing

Pull requests are always welcome! Feel free to open a new GitHub issue for any changes that can be made.

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Author

Kalebe Samuel

## License

[MIT](./LICENSE)

---
