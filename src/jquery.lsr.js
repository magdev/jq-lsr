(function($) {
    'use strict';
        
    var filterMode = 'unlink',
        domainlist = (JSON.parse(localStorage.getItem('domainlist')) || []),
        
        
        /**
         * Predefined filters
         */
        filters = {
            unlink: function($el, $parent) { 
                $el.replaceWith($el.text()); 
            },
            remove: function($el, $parent) { 
                if ($parent && $parent.length) {
                    $parent.replaceWith('');
                    return;
                }
                $el.replaceWith(''); 
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
         * Check if the URL is a link to a specific domain
         */
        match = function(url, domain) {
            return url.indexOf(domain) !== -1;
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
        onUpdateList = function(data, ts, url, status) {},
        
        
        /**
         * Default onFilterMatch-Handler
         * 
         * @param {jQuery} $el
         * @param {jQuery} $parent
         * @param {String} url
         * @param {String} domain
         */
        onFilterMatch = function($el, $parent, url, domain) {
            if (filters[filterMode]) {
                filters[filterMode]($el, $parent);
            }
        },
        
        
        /**
         * Default Options
         */
        defaultOptions = {
            domainlist: 'https://cdn.rawgit.com/magdev/leistungsschutzgelderpresser/master/domains.json',
            updateInterval: 'weekly',
            onFilterMatch: onFilterMatch,
            onUpdateList: onUpdateList,
            forceUpdate: false,
            filterMode: 'unlink',
            parentSelector: null
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
    
})(jQuery);