/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Marco Grätsch
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * 
 * @param {jQuery} $
 */
(function($) {
    'use strict';
        
    var filterMode = 'unlink',
        elementClass = 'lsr-link',
        parentClass = 'lsr-link-parent',
        warningClass = 'lsr-warning',
        messageClass = 'lsr-message',
        domainlist = (JSON.parse(localStorage.getItem('domainlist')) || []),
        lang = {},
        debug = false,
        
        
        /**
         * Predefined filters
         */
        filters = {
            unlink: function($el, $parent, url, domain) {
                if ($parent && $parent.length && !$parent.hasClass(parentClass)) {
                    $parent.addClass(parentClass);
                }
                var $span = $('<span title="' + replaceVars(lang.link_removed, domain, url) + '"></span>').text($el.text());
                $span.addClass(elementClass);
                $el.replaceWith($span);
            },
            remove: function($el, $parent, url, domain) {
                var $message = '';
                if (lang.content_removed) {
                    $message = $('<div></div>');
                    $message.addClass(messageClass).text(replaceVars(lang.content_removed, domain, url));
                }
                if ($parent && $parent.length) {
                    $parent.replaceWith($message);
                    return;
                }
                $el.replaceWith($message);
            },
            marker: function($el, $parent, url, domain) {
                if ($parent && $parent.length && !$parent.hasClass(parentClass)) {
                    $parent.addClass(parentClass);
                }
                if (!$el.hasClass(elementClass)) {
                    $el.addClass(elementClass);
                }
            },
            confirm: function($el, $parent, url, domain) {
                $el.off('click').on('click', function(ev) {
                    ev.preventDefault();
                    if (confirm(replaceVars(lang.confirm, domain, url))) {
                        window.location = url;
                    }
                });
            },
            warning: function($el, $parent, url, domain) {
                var $warning = $('<div></div>');
                $parent = $parent || $el.closest('div');
                $warning.addClass(warningClass).text(replaceVars(lang.warning, domain, url));
                $parent.not('has-' + warningClass)
                    .addClass('has-' + warningClass)
                    .prepend($warning);
            }
        },
        
        
        /**
         * Update List Handler
         * 
         * @param {String} url
         * @param {Function} cb
         */
        updateList = function(url, cb) {
            $.get(url, {}, function(data, status, jqXHR) {
                var ts = Math.round(Date.now()/1000);
                localStorage.setItem('domainlist', JSON.stringify(data));
                localStorage.setItem('last-update', ts);
                domainlist = data;
                cb(data, ts, url, status);
            }, 'json');
        },
        
        
        /**
         * Check if an update should be performed
         * 
         * @param {String} interval
         * @return {Boolean}
         */
        checkUpdates = function(interval) {
            var lastUpdate = localStorage.getItem('last-update') || null,
                intervalTime = 0,
                now = Math.round(Date.now()/1000);
            
            if (interval === 'off') {
                if (!localStorage.getItem('domainlist')) {
                    return true;
                }
                return false;
            }
            
            if (!localStorage.getItem('domainlist')) {
                return true;
            }
            if (!lastUpdate) {
                return true;
            }
            
            switch (interval) {
                case 'hourly':
                    intervalTime = (60*60);
                    break;
                    
                case 'daily':
                    intervalTime = (60*60*24);
                    break;
                    
                case 'weekly':
                    intervalTime = (60*60*24*7);
                    break;
                    
                case 'monthly':
                    intervalTime = (60*60*24*30);
                    break;
            }
            
            if (now >= lastUpdate + intervalTime) {
                return true;
            }
            return false;
        },
        
        
        /**
         * Replace variables in strings
         * 
         * @param {String} text
         * @param {String} domain
         * @param {String} url
         * @return {String}
         */
        replaceVars = function(text, domain, url) {
            return text.replace('##domain##', domain).replace('##url##', url);
        },
        
        
        /**
         * Check if the URL is a link to a specific domain
         * 
         * @param {String} url
         * @param {String} domain
         * @return {Boolean}
         */
        match = function(url, domain) {
            if (url.indexOf('.' + domain) !== -1 || url.indexOf('//' + domain) !== -1) {
                if (debug) {
                    console.log('Match found: Domain: ' + domain + ', URL: ' + url);
                }
                return true;
            }
            return false;
        },
        
        
        /**
         * Filter an element
         * 
         * @param {jQuery} $el
         * @param {jQuery} $parent
         * @param {String} domain
         * @param {Function} cb
         */
        filter = function($el, $parent, domain, cb) {
            var url = $el.attr('href');
            if (url) {
                if (match(url, domain)) {
                    cb($el, $parent, url, domain);
                }
                return;
            }
            
            $el.find('a,link').each(function() {
                filter($(this), $el, domain, cb);
            });
        },
        
        
        /**
         * Default onUpdateList-Handler
         * 
         * @param {Array} data
         * @param {Number} ts
         * @param {String} url
         * @param {String} status
         */
        onUpdateList = function(data, ts, url, status) {
            if (debug) {
                console.log('Blacklist updated at ' + (new Date(ts*1000)).toLocaleString() + ' from ' + url);
                console.log('List contains actually ' + data.length + ' domains');
            }
        },
        
        
        /**
         * Default onFilterMatch-Handler
         * 
         * @param {jQuery} $el
         * @param {jQuery} $parent
         * @param {String} url
         * @param {String} domain
         */
        onFilterMatch = function($el, $parent, url, domain) {
            if (!filters[filterMode]) {
                if (debug) {
                    console.log('Invalid filter-mode: ' + filterMode + ', using default (unlink)');
                }
                filterMode = 'unlink';
            }
            filters[filterMode]($el, $parent, url, domain);
        },
        
        
        /**
         * Default Options
         */
        defaultOptions = {
            domainlist: 'https://cdn.rawgit.com/magdev/leistungsschutzgelderpresser/master/domains.json',
            updateInterval: 'weekly',
            forceUpdate: false,
            debug: false,
            onFilterMatch: onFilterMatch,
            onUpdateList: onUpdateList,
            filterMode: 'unlink',
            parentSelector: null,
            elementClass: 'lsr-link',
            parentClass: 'lsr-link-parent',
            warningClass: 'lsr-warning',
            messageClass: 'lsr-message',
            lang: {
                link_removed: 'Link removed',
                content_removed: 'Content removed',
                warning: 'WARNING! Contains LSR-related Links',
                confirm: 'The link goes to ##domain##! Are you sure you want to follow this link?'
            }
        };
    
    
    /**
     * jQuery LSR-Filter
     * 
     * @param {Object} options
     * @return {jQuery}
     */
    $.fn.lsr = function(options) {
        var opts = $.extend(defaultOptions, options);
        
        filterMode = opts.filterMode;
        elementClass = opts.elementClass;
        parentClass = opts.parentClass;
        warningClass = opts.warningClass;
        messageClass = opts.messageClass;
        lang = opts.lang;
        debug = opts.debug;
        
        if (checkUpdates(opts.updateInterval) || opts.forceUpdate) {
            updateList(opts.domainlist, opts.onUpdateList);
        }
        
        return this.each(function() {
            var $this = $(this),
                $parent = $(this).closest(opts.parentSelector);
            
            domainlist.forEach(function(domain) {
                filter($this, $parent, domain, opts.onFilterMatch);
            });
        });
    };
    
    
    // Apply filter to elements using data-attributes
    $('[data-filter="lsr"]').each(function() {
        $(this).lsr(this.dataset);
    });
    
})(jQuery);