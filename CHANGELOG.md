# Change Log

## Release Notes

### 1.0.0

This is the initial release of the JSON Validator, Formatter and Java Model Class Generator extension for Visual Studio Code.

The following features are included in the initial release:

JSON Validation: Automatically validates the provided JSON input and highlights syntax errors in real-time.

Formatted JSON Output: Upon successful validation, the extension formats the JSON input for better readability.

Java Model Class Generation: Generates Java model classes from the given JSON structure.

The generated classes include:
    Fields corresponding to the JSON properties.
    Getters and setters for each field.
    Nested class support for complex JSON structures (objects inside objects).
    Arrays handled as List&lt;type&gt; in Java classes.
    Custom Class Name: Users can specify a custom class name for the generated Java model.
    Default Class Name: A default class name is pre-filled to simplify generation.
    User-Friendly Interface: Input fields for JSON and class name, with real-time feedback.

### 1.0.1

Backward compatibility.

### 1.1.0

Added Lombok code generation.  
Added required imports.

### 1.1.1 and 1.1.2

No changes to the extension.
Updated Readme, Change Log and Package details.

### 1.1.3

Updated Readme, added logo

### 1.2.0 (Future Version)

Planned improvements to include:  
    Support for custom constructors in generated Java classes.  
    More configurable options for formatting, annotations, or additional language support.
