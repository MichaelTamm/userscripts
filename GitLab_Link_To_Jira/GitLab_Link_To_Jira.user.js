// ==UserScript==
// @name        GitLab Link To Jira
// @version     1.0.0
// @license     MIT
// @author      Michael Tamm
// @namespace   https://github.com/MichaelTamm
// @include     https://gitlab.com/autovio/*
// @icon        https://about.gitlab.com/images/press/press-kit-icon.svg
// @grant       GM_addStyle
// @homepage    https://github.com/MichaelTamm/userscripts/tree/master/GitLab_Link_To_Jira
// @homepageURL https://github.com/MichaelTamm/userscripts/tree/master/GitLab_Link_To_Jira
// @downloadURL https://github.com/MichaelTamm/userscripts/raw/master/GitLab_Link_To_Jira/GitLab_Link_To_Jira.user.js
// @updateURL   https://github.com/MichaelTamm/userscripts/raw/master/GitLab_Link_To_Jira/GitLab_Link_To_Jira.user.js
// @supportURL  https://github.com/MichaelTamm/userscripts/issues
// ==/UserScript==
(() => {
    "use strict";

    const JIRA_ISSUE_REG_EXP = /APP-[0-9]+/;
    const JIRA_ISSUE_LINK_PREFIX = "https://autovio.atlassian.net/browse/";

    function $(elm_or_selector, selector) {
        if (selector) {
            return elm_or_selector.querySelector(selector);
        } else {
            return document.querySelector(elm_or_selector);
        }
    }

    function linkToJiraIssue(jiraIssue, className) {
        const a = document.createElement("a");
        a.href = JIRA_ISSUE_LINK_PREFIX + jiraIssue;
        if (className) {
            a.className = className;
        }
        a.textContent = jiraIssue;
        return a;
    }

    function run() {
        let titleElm = $('[data-qa-selector="title_content"]');
        let jiraIssue = "";
        if (titleElm) {
            // If the Jira issue is not in the title, we might be able to extract it from the branch name ...
            const sourceBranchElm = $(".js-source-branch");
            if (sourceBranchElm) {
                const sourceBranch = sourceBranchElm.innerText;
                const m = JIRA_ISSUE_REG_EXP.exec(sourceBranch);
                if (m) {
                    jiraIssue = m[0];
                }
            }
        }
        if (titleElm && !titleElm.dataset['linkedToJiraIssue']) {
            for (let node = titleElm.firstChild; node; node = node.nextSibling) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const title = node.textContent;
                    const m = JIRA_ISSUE_REG_EXP.exec(title);
                    if (m) {
                        const jiraIssue = m[0];
                        node.replaceWith(
                            title.substr(0, m.index),
                            linkToJiraIssue(jiraIssue),
                            title.substr(m.index + jiraIssue.length)
                        );
                        titleElm.dataset['linkedToJiraIssue'] = 'true';
                        return;
                    }
                }
            }
            if (jiraIssue) {
                titleElm.append(" (");
                titleElm.append(linkToJiraIssue(jiraIssue));
                titleElm.append(")");
                titleElm.dataset['linkedToJiraIssue'] = 'true';
            }
        }
    }

    setInterval(run, 173);
})
();
