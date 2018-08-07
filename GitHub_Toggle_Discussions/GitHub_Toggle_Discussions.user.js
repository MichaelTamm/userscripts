// ==UserScript==
// @name        GitHub Toggle Discussions
// @version     1.0.1
// @license     MIT
// @author      Michael Tamm
// @namespace   https://github.com/MichaelTamm
// @include     https://github.com/*
// @icon        https://assets-cdn.github.com/pinned-octocat.svg
// @grant       GM_addStyle
// @homepage    https://github.com/MichaelTamm/userscripts/tree/master/GitHub_Toggle_Discussions
// @homepageURL https://github.com/MichaelTamm/userscripts/tree/master/GitHub_Toggle_Discussions
// @downloadURL https://github.com/MichaelTamm/userscripts/raw/master/GitHub_Toggle_Discussions/GitHub_Toggle_Discussions.user.js
// @updateURL   https://github.com/MichaelTamm/userscripts/raw/master/GitHub_Toggle_Discussions/GitHub_Toggle_Discussions.user.js
// @supportURL  https://github.com/MichaelTamm/userscripts/issues
// ==/UserScript==
(() => {
    "use strict";

    GM_addStyle(`
        .ghtd-button { float: right; padding-top: 6px; padding-left: 6px; }
        .ghtd-hidden { display: none !important; }
    `);

    const discussionSelector = ".js-comment-container.has-inline-notes";
    const checkIcon = `<svg class="octicon octicon-check" height="16" viewBox="0 0 12 16" width="12"><path d="M12 5L4 13 0 9l1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5z"/></svg>`;

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

    function closest(elm, selector) {
        while (elm) {
            if (elm.matches && elm.matches(selector)) {
                return elm;
            }
            elm = elm.parentNode;
        }
    }

    function toggleDiscussion(discussion) {
        for (let selector of [".blob-wrapper", ".review-comments", ".js-inline-comments-container"]) {
            const container = $(discussion, selector);
            if (container) {
                if (container.classList.contains("ghtd-hidden")) {
                    container.classList.remove("ghtd-hidden");
                } else {
                    container.classList.add("ghtd-hidden");
                }
            }
        }
    }

    function handleClick(e) {
        let elm = e.target;
        while (elm) {
            if (elm.classList && elm.classList.contains("ghtd-button")) {
                const discussion = closest(elm, discussionSelector);
                toggleDiscussion(discussion);
                return;
            }
            elm = elm.parentNode;
        }
    }

    let _currentUser;

    function currentUser() {
        if (!_currentUser) {
            _currentUser = $("header .user-nav img.avatar").alt.substr(1);
        }
        return _currentUser;
    }

    function authorOfLastComment(discussion) {
        const comments = $$(discussion, ".review-comment");
        if (!comments.length) {
            return;
        }
        const lastComment = comments[comments.length - 1];
        const author = $(lastComment, "a.author").innerText;
        return author;
    }

    function run() {
        for (const discussion of $$(discussionSelector)) {
            if (!$(discussion, ".ghtd-button")) {
                const button = document.createElement("div");
                button.className = "ghtd-button";
                button.innerHTML = checkIcon;
                const fileHeader = $(discussion, ".file-header");
                fileHeader.insertBefore(button, fileHeader.firstChild);
                if (authorOfLastComment(discussion) === currentUser()) {
                    // Mark discussion ...
                    $(button, "svg").style = "fill:green";
                    // Collapse discussion ...
                    toggleDiscussion(discussion);
                }
            }
        }
    }

    $("body").addEventListener("click", handleClick);
    setInterval(run, 173);

})();
