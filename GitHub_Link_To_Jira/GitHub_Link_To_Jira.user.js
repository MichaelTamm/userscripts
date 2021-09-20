// ==UserScript==
// @name        GitHub Link To Jira
// @version     1.0.2
// @license     MIT
// @author      Michael Tamm
// @namespace   https://github.com/MichaelTamm
// @include     https://github.com/Autovio/autovio-app/*
// @icon        https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg
// @grant       GM_addStyle
// @homepage    https://github.com/MichaelTamm/userscripts/tree/master/GitHub_Link_To_Jira
// @homepageURL https://github.com/MichaelTamm/userscripts/tree/master/GitHub_Link_To_Jira
// @downloadURL https://github.com/MichaelTamm/userscripts/raw/master/GitHub_Link_To_Jira/GitHub_Link_To_Jira.user.js
// @updateURL   https://github.com/MichaelTamm/userscripts/raw/master/GitHub_Link_To_Jira/GitHub_Link_To_Jira.user.js
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

    function $$(elm_or_selector, selector) {
        if (selector) {
            return Array.from(elm_or_selector.querySelectorAll(selector));
        } else {
            return Array.from(document.querySelectorAll(elm_or_selector));
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
        let titleElm = $(".js-issue-title");
        let jiraLinkClassName = "";
        let jiraIssue = "";
        if (titleElm) {
            // If the Jira issue is not in the title, we might be able to extract it from the branch name ...
            const header = $('.gh-header-meta');
            if (header) {
                const commitRefs = $$(header, ".commit-ref");
                if (commitRefs.length === 2) {
                    const branchName = commitRefs[1].textContent;
                    const m = JIRA_ISSUE_REG_EXP.exec(branchName);
                    if (m) {
                        jiraIssue = m[0];
                    }
                }
            }
        } else {
            titleElm = $(".commit-title");
            jiraLinkClassName = "issue-link";
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
                            linkToJiraIssue(jiraIssue, jiraLinkClassName),
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
