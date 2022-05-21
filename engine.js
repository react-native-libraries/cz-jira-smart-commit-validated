'format cjs';

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var chalk = require('chalk');
var exec = require('./scripts/exec');

//= ==============================================================================================
var filter = function (array) {
    return array.filter(function (x) {
        return x;
    });
};

//= ==============================================================================================
var headerLength = function (answers) {
    return answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0);
};

//= ==============================================================================================
var maxSummaryLength = function (options, answers) {
    return options.maxHeaderWidth - headerLength(answers);
};

//= ==============================================================================================
var filterSubject = function (subject, disableSubjectLowerCase) {
    subject = subject.trim();

    if (!disableSubjectLowerCase && subject.charAt(0).toLowerCase() !== subject.charAt(0))
        subject = subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);

    while (subject.endsWith('.')) {
        subject = subject.slice(0, subject.length - 1);
    }

    return subject;
};

//= ==============================================================================================
function reverseString(str) {
    if (str) return str.split('').reverse().join('');
}

//= ==============================================================================================
var checkJiraIssueID = function (subject, options) {
    try {
        var prefixJiraMatcher = options.defaultIssuesPrefix
            ? `(${options.defaultIssuesPrefix}|${reverseString(options.defaultIssuesPrefix)})`
            : '[A-Z]';

        var jira_matcher = new RegExp('\\d+-' + prefixJiraMatcher + '+(?!-?[a-zA-Z]{1,10})', 'g');

        subject = reverseString(subject);
        var m = subject.match(jira_matcher) || [];

        for (var i = 0; i < m.length; i++) m[i] = reverseString(m[i]);

        m.reverse();

        // ------------------------------------------------------------------------
        let defaultErrorMessage = chalk.red(
            `Must specify issue IDs with prefix and id (${options.defaultIssuesPrefix}-1234)`
        );

        if (options.enableMultiIssuesIdByCommit) {
            return m.length > 0 ? true : chalk.red(defaultErrorMessage);
        } else {
            return m.length == 1
                ? true
                : m.length == 0
                ? chalk.red(defaultErrorMessage)
                : chalk.red('Should have one issue ID by commit');
        }
    } catch (err) {
        return chalk.red('Should enter an issue ID');
    }
};

//= ==============================================================================================
var checkJiraTime = function (jiraTime) {
    if (!jiraTime) return true;

    var time_matcher = new RegExp(
        '^([0-9]+([.][0-9]+)?[WwDdHhMm])([ ][0-9]+([.][0-9]+)?[WwDdHhMm])*$',
        'g'
    );

    var defaultOrder = ['w', 'd', 'h', 'm'];
    var countTimeInOrder = 0;
    var m = jiraTime.match(time_matcher) || [];

    if (m.length > 0) {
        let timeSplit = String(m).split(' ');

        if (timeSplit.length == 1) return true;

        var timeSplitWithoutNumbers = timeSplit[0].replace(/[^a-zA-Z]+/g, '');
        let initialSlicePosition = defaultOrder.indexOf(timeSplitWithoutNumbers);

        defaultOrder = defaultOrder.slice(initialSlicePosition, defaultOrder.length);

        let isInOrder = false;

        for (let i = 1; i < timeSplit.length; i++) {
            isInOrder = false;

            for (let j = 1; j < defaultOrder.length; j++) {
                if (String(timeSplit[i]).includes(defaultOrder[j])) isInOrder = true;

                if (j == defaultOrder.length - 1 && isInOrder == true) countTimeInOrder++;
            }
        }

        if (countTimeInOrder == timeSplit.length - 1) return true;
    }

    return chalk.red('Date should be in this format (2w 1d 5h 30m)');
};

//= ==============================================================================================
var checkSubjectLength = function (subject, options, maxAnswerLength) {
    let subjectLength = filterSubject(subject, options.disableSubjectLowerCase).length;

    return subjectLength == 0
        ? 'subject is required'
        : subjectLength <= maxAnswerLength
        ? true
        : 'Subject length must be less than or equal to ' +
          maxAnswerLength +
          ' characters. Current length is ' +
          subjectLength +
          ' characters.';
};

//= ==============================================================================================
var handleWorkflowOptions = (workflowOptions) => {
    const nothing = {
        description: 'Does nothing',
        title: 'Nothing',
    };

    let options = { nothing, ...workflowOptions };

    return options;
};

//= ==============================================================================================
var prepareChoices = (types, length) => {
    let choices = map(types, (type, key) => {
        return {
            name: (key + ':').padEnd(length) + ' ' + type.description,
            value: key,
        };
    });

    return choices;
};

//= ==============================================================================================
module.exports = function (options) {
    var { types, workflowOptions } = options;
    var subjectLength = 0;
    var maxAnswerLength = 0;
    var branchName;
    var newWorkFlowOptions = handleWorkflowOptions(workflowOptions);

    exec('git symbolic-ref --short HEAD').then((res) => (branchName = res));

    var typeChangeLength = longest(Object.keys(types)).length + 1;
    var typeChangeChoices = prepareChoices(types, typeChangeLength);

    var typeWorkflowLength = longest(Object.keys(newWorkFlowOptions)).length + 1;
    var typeWorkflowChoices = prepareChoices(newWorkFlowOptions, typeWorkflowLength);

    return {
        // When a user runs `git cz`, prompter will
        // be executed. We pass you cz, which currently
        // is just an instance of inquirer.js. Using
        // this you can ask questions and get answers.
        //
        // The commit callback should be executed when
        // you're ready to send back a commit template
        // to git.
        //
        // By default, we'll de-indent your commit
        // template and will keep empty lines.
        prompter: function (cz, commit) {
            // Let's ask some questions of the user
            // so that we can populate our commit
            // template.
            //
            // See inquirer.js docs for specifics.
            // You can also opt to use another input
            // collection library if you prefer.
            cz.prompt([
                {
                    type: 'list',
                    name: 'type',
                    message: "Select the type of change that you're committing:",
                    choices: typeChangeChoices,
                    default: options.defaultType,
                },
                {
                    type: 'input',
                    name: 'scope',
                    message:
                        'What is the scope of this change (e.g. component or file name) (optional):',
                    default: options.defaultScope,
                    filter: function (value) {
                        return options.disableScopeLowerCase
                            ? value.trim()
                            : value.trim().toLowerCase();
                    },
                },
                {
                    type: 'input',
                    name: 'subject',
                    message: function (answers) {
                        maxAnswerLength = maxSummaryLength(options, answers);
                        return `Write a short, imperative tense description of the change (max ${maxAnswerLength} chars):`;
                    },
                    default: options.defaultSubject,
                    validate: function (subject) {
                        return checkSubjectLength(subject, options, maxAnswerLength);
                    },
                    transformer: function (subject) {
                        subjectLength = filterSubject(
                            subject,
                            options.disableSubjectLowerCase
                        ).length;

                        var color = subjectLength <= maxAnswerLength ? chalk.green : chalk.red;

                        return color(`(${subjectLength}/${maxAnswerLength})\n` + subject);
                    },
                    filter: function (subject) {
                        return filterSubject(subject, options.disableSubjectLowerCase);
                    },
                },
                {
                    type: 'input',
                    name: 'body',
                    message: 'Provide a longer description of the change: (press enter to skip)\n',
                    default: options.defaultBody,
                },
                {
                    type: 'input',
                    name: 'issues',
                    message: `Jira Issue ID(s)${
                        String(branchName).includes(options.defaultIssuesPrefix)
                            ? `, default is your current branch name (${branchName})`
                            : ''
                    } (required):`,
                    default: String(branchName).includes(options.defaultIssuesPrefix)
                        ? branchName
                        : null,
                    validate: function (input) {
                        return checkJiraIssueID(input, options);
                    },
                },
                {
                    type: 'list',
                    name: 'workflow',
                    message: 'Select the workflow command (optional):',
                    choices: typeWorkflowChoices,
                },
                {
                    type: 'input',
                    name: 'time',
                    message: 'Time spent (i.e. 5w 5d 3h 15m) (optional):',
                    validate: function (input) {
                        return checkJiraTime(input);
                    },
                },
                {
                    type: 'input',
                    name: 'comment',
                    message: 'Jira comment (optional):\n',
                },
                {
                    type: 'confirm',
                    name: 'isBreaking',
                    message: 'Are there any breaking changes?',
                    default: false,
                },
                {
                    type: 'input',
                    name: 'breakingBody',
                    default: '-',
                    message:
                        'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
                    when: function (answers) {
                        return answers.isBreaking && !answers.body;
                    },
                    validate: function (breakingBody) {
                        return (
                            breakingBody.trim().length > 0 || 'Body is required for BREAKING CHANGE'
                        );
                    },
                },
                {
                    type: 'input',
                    name: 'breaking',
                    message: 'Describe the breaking changes:\n',
                    when: function (answers) {
                        return answers.isBreaking;
                    },
                },
            ]).then(function (answers) {
                var wrapOptions = {
                    trim: true,
                    cut: false,
                    newline: '\n',
                    indent: '',
                    width: options.maxLineWidth,
                };

                // parentheses are only needed when a scope is present
                var scope = answers.scope ? '(' + answers.scope + ')' : '';

                // Hard limit this line in the validate
                var head = answers.type + scope + ': ' + answers.subject;

                // Wrap these lines at options.maxLineWidth characters
                var body = answers.body ? wrap(answers.body, wrapOptions) : false;

                var workflow =
                    answers.workflow && answers.workflow !== 'nothing'
                        ? ' #' + answers.workflow
                        : '';

                var time = answers.time ? ' #time ' + answers.time : '';

                var comment = answers.comment ? ' #comment ' + answers.comment : '';

                var jira = '\n' + answers.issues + workflow + time + comment;

                // Apply breaking change prefix, removing it if already present
                var breaking = answers.breaking ? answers.breaking.trim() : '';
                breaking = breaking
                    ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '')
                    : '';
                breaking = breaking ? wrap(breaking, wrapOptions) : false;

                commit(filter([head, body, jira, breaking]).join('\n\n'));
            });
        },
    };
};
