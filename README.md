# jQuery LSR-Filter

A jQuery-Plugin to perform actions on links to the knights of the stupid german law called "Leistungsschutzrecht für Presseverlage". [Learn more](https://github.com/magdev/leistungsschutzgelderpresser)

## Usage

### Basic example

```javascript
// Apply to all links on the page
$('a').lsr();
```

### Options

```json
{
    // Source-URL poiting to a blacklist, will be stored locally
    domainlist: 'https://cdn.rawgit.com/magdev/leistungsschutzgelderpresser/master/domains.json',
    
    // Update interval, can be hourly, daily, weekly, monthly
    updateInterval: 'weekly',
    
    // Force an update
    forceUpdate: false,
    
    // Handler for matched links
    onFilterMatch: onFilterMatch,
    
    // Do something after the list has been updated
    onUpdateList: onUpdateList,
    
    // Predefined filters, can be unlink, marker, remove
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

[see example/usage.html](example/usage.html)

## License

This software is released under the [MIT-License](LICENSE.md)
