# jQuery LSR-Filter

A jQuery-Plugin to perform actions on links to the knights of the stupid german law called "Leistungsschutzrecht 
für Presseverlage". [Learn more](https://github.com/magdev/leistungsschutzgelderpresser/blob/master/README.md)

This plugin uses [this repository](https://github.com/magdev/leistungsschutzgelderpresser) to read the domain-blacklist.
To use another blacklist set the URL using the _domainlist_ option.

## Install

### Using [bower](http://bower.io)

```bash
bower install jq-lsr --save
```

```html
<!-- in <head> -->
<link href="path/to/bower_components/jq-lsr/dist/jquery.lsr.min.css" rel="stylesheet"/>

<!-- before </body> -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="path/to/bower_components/jq-lsr/dist/jquery.lsr.min.js"></script>
``` 

### Using [RawGit CDN](https://rawgit.com)

```html
<!-- in <head> -->
<link href="https://cdn.rawgit.com/magdev/jq-lsr/master/jquery.lsr.min.css" rel="stylesheet"/>

<!-- before </body> -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://cdn.rawgit.com/magdev/jq-lsr/master/dist/jquery.lsr.min.js"></script>
```



## Usage

The filter can be applied to a and link elements or containers. If the selected target is an anchor-tag, 
additional actions can be applied to parent elements using the parentSelector option. If the selected 
target is a container, the parent element is always the container. In the latter case you should be careful 
with the filterMode remove!

[Fiddle with jq-lsr](http://jsfiddle.net/magdev/r0d6az8x/1/)


### Basic example

Unlink all matched links on the page
```javascript
$('a').lsr();
```

### Using data-* attributes

Confirm all matched links in a container
```html
<div data-filter="lsr" data-filter-mode="confirm">
    <!-- content -->
</div>
```


### More advanced examples

Remove Paragraphs within a container which contain matched links 
```javascript
$('.container a').lsr({
    filterMode: 'remove',
    parentSelector: 'p'
});
```

Remove an entire container which contains matched links
```javascript
$('.container').lsr({
    filterMode: 'remove'
});
```


### Use a custom FilterMatch handler

Disable all matched links within a container and display a warning alert
```javascript
$('.container').lsr({
    onFilterMatch: function($el, $parent, url, domain) {
        $el.off('click').click(function(ev) {
            ev.preventDefault();
            alert('You really shouln\'t read this crap!');
        });
    }
});
```


### Perform an action on blacklist updates

Log blacklist updates to the console
```javascript
$('a').lsr({
    onUpdateList: function(data, ts, url, status) {
        console.log(data);
        console.log(ts);
        console.log(url);
        console.log(status);
    }
});
```


## Options

```javascript
{
    // Source-URL pointing to a blacklist, will be stored locally
    domainlist: 'https://cdn.rawgit.com/magdev/leistungsschutzgelderpresser/master/domains.json',
    
    // Update interval, can be off, hourly, daily, weekly or monthly
    updateInterval: 'weekly',
    
    // Force an update
    forceUpdate: false,
    
    // Enable debug-mode
    debug: false,
    
    // Handler for matched links
    onFilterMatch: onFilterMatch,
    
    // Do something after the list has been updated
    onUpdateList: onUpdateList,
    
    // Predefined filters, can be unlink, marker, warning, remove or confirm
    filterMode: 'unlink',
    
    // Apply action to a parent element
    parentSelector: null,
    
    // Class to add to links
    elementClass: 'lsr-link',
    
    // Class to add to parent elements
    parentClass: 'lsr-link-parent',
    
    // Class for warning message
    warningClass: 'lsr-warning',
    
    // Class for message on removed content
    messageClass: 'lsr-message',
    
    // Language specific strings
    // All strings may contain the placeholders ##domain## and ##url##
    lang: {
        // Tooltip on unlinked strings
        link_removed: 'Link removed',
        
        // Message for removed contents, set to null for no message
        content_removed: 'Content removed',
        
        // Warning message
        warning: 'WARNING! Contains LSR-related Links',
        
        // Confirmation message
        confirm: 'The link goes to ##domain##! Are you sure you want to follow this link?'
    }
}
```


## To-Do

  * Automated tests
  * Apply styles to examples
  * Error-Handling



## License

This software is released under the [MIT-License](LICENSE.md)
