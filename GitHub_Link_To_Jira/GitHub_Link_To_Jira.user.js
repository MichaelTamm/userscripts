// ==UserScript==
// @name        GitHub Link To Jira
// @version     1.0.1
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

    function $(elm_or_selector, selector) {
        if (selector) {
            return elm_or_selector.querySelector(selector);
        } else {
            return document.querySelector(elm_or_selector);
        }
    }

    function linkToJiraIssue(jiraIssue, className) {
        const a = document.createElement("a");
        a.href = "https://autovio.atlassian.net/browse/" + jiraIssue;
        if (className) {
            a.className = className;
        }
        a.textContent = jiraIssue;
        return a;
    }

    function run() {
        let titleElm = $(".js-issue-title");
        let jiraLinkClassName = "";
        if (!titleElm) {
            titleElm = $(".commit-title");
            jiraLinkClassName = "issue-link";
        }
        if (titleElm && !titleElm.dataset['linkedToJiraIssue']) {
            for (let node = titleElm.firstChild; node; node = node.nextSibling) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const s = node.textContent;
                    const m = /APP-[0-9]+/.exec(s);
                    if (m) {
                        const jiraIssue = m[0];
                        node.replaceWith(
                            s.substr(0, m.index),
                            linkToJiraIssue(jiraIssue, jiraLinkClassName),
                            s.substr(m.index + jiraIssue.length)
                        );
                        titleElm.dataset['linkedToJiraIssue'] = 'true';
                        return;
                    }
                }
            }
        }
    }

    setInterval(run, 173);
})
();
