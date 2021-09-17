// ==UserScript==
// @name        GitHub Link To Jira
// @version     1.0.0
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

    const titleSelector = ".js-issue-title";

    function $(elm_or_selector, selector) {
        if (selector) {
            return elm_or_selector.querySelector(selector);
        } else {
            return document.querySelector(elm_or_selector);
        }
    }

    function encodeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    }

    function linkToJiraIssue(jiraIssue) {
        return `<a href="https://autovio.atlassian.net/browse/${jiraIssue}">${jiraIssue}</a>`;
    }

    function run() {
        const titleElm = $(titleSelector);
        if (!$(titleElm, "a")) {
            const titleText = titleElm.textContent;
            const m = /APP-[0-9]+/.exec(titleText);
            if (m) {
                const jiraIssue = m[0];
                titleElm.innerHTML =
                    encodeHtml(titleText.substr(0, m.index)) +
                    linkToJiraIssue(jiraIssue) +
                    encodeHtml(titleText.substr(m.index + jiraIssue.length));
            }
        }
    }

    setInterval(run, 173);
})
();
