'format cjs';

var engine = require('./engine');
var conventionalCommitTypes = require('conventional-commit-types');
var { configLoader } = require('commitizen');
var config = configLoader.load() || {};
var defaultWorkflowOptions = require('./workflowOptions.json');

//= ==============================================================================================
var options = {
    types: config.types || conventionalCommitTypes.types,
    defaultType: process.env.CZ_TYPE || config.defaultType,
    defaultScope: process.env.CZ_SCOPE || config.defaultScope,
    defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
    defaultBody: process.env.CZ_BODY || config.defaultBody,
    defaultIssuesPrefix: process.env.CZ_ISSUES_PREFIX || config.defaultIssuesPrefix,
    enableMultiIssuesIdByCommit:
        process.env.CZ_ENABLE_MULTI_ISSUES_ID_BY_COMMIT || config.enableMultiIssuesIdByCommit,
    workflowOptions: config.workflowOptions || defaultWorkflowOptions.workflowOptions,
    disableScopeLowerCase: process.env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase,
    disableSubjectLowerCase:
        process.env.DISABLE_SUBJECT_LOWERCASE || config.disableSubjectLowerCase,
    maxHeaderWidth:
        (process.env.CZ_MAX_HEADER_WIDTH && parseInt(process.env.CZ_MAX_HEADER_WIDTH)) ||
        config.maxHeaderWidth ||
        100,
    maxLineWidth:
        (process.env.CZ_MAX_LINE_WIDTH && parseInt(process.env.CZ_MAX_LINE_WIDTH)) ||
        config.maxLineWidth ||
        100,
};

//= ==============================================================================================
(function (options) {
    try {
        var commitlintLoad = require('@commitlint/load');
        commitlintLoad().then(function (clConfig) {
            if (clConfig.rules) {
                var maxHeaderLengthRule = clConfig.rules['header-max-length'];

                if (
                    typeof maxHeaderLengthRule === 'object' &&
                    maxHeaderLengthRule.length >= 3 &&
                    !process.env.CZ_MAX_HEADER_WIDTH &&
                    !config.maxHeaderWidth
                ) {
                    options.maxHeaderWidth = maxHeaderLengthRule[2];
                }
            }
        });
        // eslint-disable-next-line no-empty
    } catch (err) {}
})(options);

//= ==============================================================================================
module.exports = engine(options);
