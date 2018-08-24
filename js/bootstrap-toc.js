/*!
 * Bootstrap Table of Contents v1.0.0 (http://afeld.github.io/bootstrap-toc/)
 * Copyright 2015 Aidan Feldman
 * Licensed under MIT (https://github.com/afeld/bootstrap-toc/blob/gh-pages/LICENSE.md) */

// Modified by A，support nav for more than 2 level
(function($) {
    'use strict';

    window.Toc = {
        helpers: {
            // return all matching elements in the set, or their descendants
            findOrFilter: function($el, selector) {
                // http://danielnouri.org/notes/2011/03/14/a-jquery-find-that-also-finds-the-root-element/
                // http://stackoverflow.com/a/12731439/358804
                var $descendants = $el.find(selector);
                return $el.filter(selector).add($descendants).filter(':not([data-toc-skip])');
            },

            generateUniqueIdBase: function(el) {
                var text = $(el).text();
                var anchor = text.trim().toLowerCase().replace(/[^A-Za-z0-9]+/g, '-');
                return anchor || el.tagName.toLowerCase();
            },

            generateUniqueId: function(el) {
                var anchorBase = this.generateUniqueIdBase(el);
                for (var i = 0; ; i++) {
                    var anchor = anchorBase;
                    if (i > 0) {
                        // add suffix
                        anchor += '-' + i;
                    }
                    // check if ID already exists
                    if (!document.getElementById(anchor)) {
                        return anchor;
                    }
                }
            },

            generateAnchor: function(el) {
                if (el.id) {
                    return el.id;
                } else {
                    var anchor = this.generateUniqueId(el);
                    el.id = anchor;
                    return anchor;
                }
            },

            createNavList: function(level) {
                return $('<ul class="nav navbar-nav level-' + level + '"></ul>')
            },

            createChildNavList: function ($parent, level) {
                var $childList = this.createNavList(level)
                $parent.append($childList)
                return $childList
            },

            generateNavEl: function(anchor, text) {
                var $a = $('<a class="nav-link"></a>');
                $a.attr('href', '#' + anchor);
                $a.text(text);
                var $li = $('<li></li>');
                $li.append($a);
                return $li;
            },

            generateNavItem: function(headingEl) {
                var anchor = this.generateAnchor(headingEl);
                var $heading = $(headingEl);
                var text = $heading.data('toc-text') || $heading.text();
                return this.generateNavEl(anchor, text);
            },

            // Find the first heading level (`<h1>`, then `<h2>`, etc.) that has more than one element. Defaults to 1 (for `<h1>`).
            getTopLevel: function($scope) {
                for (var i = 1; i <= 6; i++) {
                    var $headings = this.findOrFilter($scope, 'h' + i);
                    if ($headings.length > 1) {
                        return i;
                    }
                }

                return 1;
            },

            // returns the elements for the top level, and the next below it
            getHeadings: function($scope, topLevel) {
                var secondaryLevel = topLevel + 1;
                var thirdlyLevel = secondaryLevel + 1;

                var topSelector = 'h' + topLevel;
                var secondarySelector = 'h' + secondaryLevel;
                var thirdlySelector = 'h' + thirdlyLevel;

                return this.findOrFilter($scope, topSelector + ',' + secondarySelector + ',' + thirdlySelector)
            },

            getNavLevel: function(el) {
                return parseInt(el.tagName.charAt(1), 10);
            },

            populateNav: function($topContext, topLevel, $headings) {
                var $context = $topContext;
                var $prevNav;
                var $prevLevel;
                var $prevContext;

                var helpers = this;
                $headings.each(function(i, el) {
                    var $newNav = helpers.generateNavItem(el);
                    var navLevel = helpers.getNavLevel(el);

                    // determine the proper $context
                    if(navLevel === topLevel){
                        $context = $topContext;
                    }else if (navLevel === $prevLevel) {
                        $context = $prevContext;
                    }else if (navLevel > $prevLevel) {
                        $context = helpers.createChildNavList($prevNav,navLevel)
                    }else if (navLevel < $prevLevel) {
                        $context = $prevContext.parent().parent();
                    }

                    $context.append($newNav);

                    $prevNav = $newNav;
                    $prevContext = $context;
                    $prevLevel = navLevel;
                });
            },

            parseOps: function(arg) {
                var opts;
                if (arg.jquery) {
                    opts = {
                        $nav: arg
                    };
                } else {
                    opts = arg;
                }
                opts.$scope = opts.$scope || $(document.body);
                return opts;
            }
        },

        // accepts a jQuery object, or an options object
        init: function(opts) {
            opts = this.helpers.parseOps(opts);

            // ensure that the data attribute is in place for styling
            opts.$nav.attr('data-toggle', 'toc');

            var $topContext = this.helpers.createChildNavList(opts.$nav, 1)
            var topLevel = this.helpers.getTopLevel(opts.$scope);
            var $headings = this.helpers.getHeadings(opts.$scope, topLevel);
            this.helpers.populateNav($topContext, topLevel, $headings);
        }
    };

    $(function() {
        $('nav[data-toggle="toc"]').each(function(i, el) {
            var $nav = $(el);
            Toc.init($nav);
        });
    });
})(jQuery);