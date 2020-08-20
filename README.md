

#### NOTES:

How do you authenticate / register? Password, OTP, 

Validate view names to not have colons or dots

Draw a map of each element's process return

```js
process_output = {
    // Elements that allow text children
    text: "string",
    // Elements that accpet user input and regex of what input is expected
    input: "regex_string",
    // What view to go next if input matches. Element that accept inputs
    view: "string",
    // Inputs that need saving must have a key
    key: "string",
    // Custom element value if input matches. Element must have a key
    value: "string"
}
```