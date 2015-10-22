#Dualler - Simple Dual list box

##Synopsis

This is a simple Dual list box that simply uses jQuery and does *not* require Bootstrap.  I would like to acknowledge Geodan's Dual-list-box control as an excellent prototype for this plugin.

##Usage

First off you should create a simple `<select id="select-box">` tag. After which you can initialize the dual list box as a jQuery plugin like so:

`$('#select-box').Dualler();`

##Demo
Want to see it in action? [Here you go...](http://mkadlec.github.io/dualler-demo/)

##Options / API

| Option       | Type    | Default    | Description |
| ------------ | ------- | ---------- | ----------- |
| `value`      | String  | id         | Unique value of dual list box container. |
| `title`      | String  | Example    | The title of the listbox heading. |
| `moveAllBtn` | Boolean | true       | Whether to display the move all button (from left to right or vice-versa). |
| `maxAllBtn`  | UInt    | 500        | Integer to determine from which length to display the warning message below. |
| `store-values` | Boolean | false       | Store the values in the right box in a hidden field as a comma separated string. Defaults to false. |
| `sort`  | Boolean    | false        | Whether to sort the listboxes after each selection. |
| `warning`    | String  | 'Selecting...'      | Warning message that is displayed when trying to move large amounts of elements. |


Will update more soon.
