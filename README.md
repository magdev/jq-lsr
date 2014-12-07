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
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="path/to/bower_components/jq-lsr/dist/jquery.lsr.min.js"></script>
``` 

### Using [RawGit CDN](https://rawgit.com)

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://cdn.rawgit.com/magdev/jq-lsr/master/dist/jquery.lsr.min.js"></script>
```



## Usage

The filter can be applied to a and link elements or containers. If the selected target is an anchor-tag, 
additional actions can be applied to parent elements using the parentSelector option. If the selected 
target is a container, the parent element is always the container. In the latter case you should be careful 
with the filterMode remove!


### Basic example

Unlink all matched links on the page
```javascript
$('a').lsr();
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
    
    // Handler for matched links
    onFilterMatch: onFilterMatch,
    
    // Do something after the list has been updated
    onUpdateList: onUpdateList,
    
    // Predefined filters, can be unlink, marker, remove or confirm
    filterMode: 'unlink',
    
    // Apply action to a parent element
    parentSelector: null,
    
    // Class to add to links
    elementClass: 'lsr-link',
    
    // Class to add to parent elements
    parentClass: 'lsr-link-parent'
}
```



## Examples

Download the package, unpack and open [example/usage.html](example/usage.html) for default options and 
[example/custom.html](example/custom.html) in a browser.



## To-Do

  * Automated tests
  * Apply styles to examples
  * 



## License

This software is released under the [MIT-License](LICENSE.md)
