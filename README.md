# JSON Utility - Validator, Formatter and Java Model Generator

This VSCode extension provides an efficient way to validate, format, and generate Java model classes from JSON input. It simplifies the workflow for developers dealing with JSON data and Java projects by ensuring the JSON structure is valid and converting it into clean, well-structured Java classes.

**Authors**: Suresh Nettur, Akhil Dusi, and Unnati Nettur.

## Features

- **JSON Validator**: Automatically checks the given JSON input for syntax errors and highlights any issues, ensuring that your JSON is valid.
- **JSON Formatter**: Once the JSON is validated, the extension provides a neatly formatted version of the JSON for better readability and usability.
- **Java Model Generator**: If the JSON validation passes, the extension generates corresponding Java model classes based on the structure of the JSON. This includes fields, getters, setters, and support for nested objects and arrays.

## Requirements

Prerequisites to be installed:

- **Visual Studio Code**: This extension runs inside VSCode, so make sure you have it installed. You can download it from https://code.visualstudio.com/.
- **Node.js**: The extension relies on Node.js for certain operations, such as JSON parsing and formatting. You can download Node.js from https://nodejs.org/.
- **Java Development Kit (JDK)**: If you plan to generate Java model classes, you should have a working JDK installed on your system. The generated classes will be in plain Java, but the JDK helps with testing and further development. You can download the JDK from https://www.oracle.com/java/technologies/javase-downloads.html.


## Installation

  1. Download and install the extension from the Visual Studio Code Marketplace.
  2. Open Visual Studio Code.
  3. Go to the Extensions View (Ctrl+Shift+X or Cmd+Shift+X on Mac).
  4. Search for "JSON Validator, Formatter and Java Model Generator".
  5. Click Install to add the extension to your workspace.
  6. Once installed, Use the command palette (Ctrl+Shift+P or Cmd+Shift+P on Mac) and start typing "JSON ... Validator, Formatter, Java Model Generator" to run the commands for validation, formatting, and Java class generation.


## Usage

  1. **Validate JSON**: Simply paste or type your JSON input, and click Process button, the extension will immediately validate it.

  2. **Format JSON**: Once validated, the extension will display the formatted version of the JSON for easy reading or shows errors where to fix.

  3. **Generate Java Classes**: If all validations pass, the extension generates Java model classes that match the structure of the JSON, supporting both primitive types and nested objects.

&#9;**Input JSON**:  
&#9;{  
&#9;&#9;"name": "John Doe",  
&#9;&#9;"age": 30,  
&#9;&#9;"address": {  
&#9;&#9;&#9;"city": "New York",  
&#9;&#9;&#9;"zipcode": "10001"  
&#9;&#9;},  
&#9;&#9;"skills": ["Java", "TypeScript"]  
&#9;}  

**Input Class Name**: Person

**Generated Java Class**:  
import java.util.List;  

public class Person {  
&#9;private String name;  
&#9;private int age;  
&#9;private Address address;  
&#9;private List<String> skills;  

    // Getters and Setters  
}

public class Address {  
&#9;private String city;  
&#9;private String zipcode;  

    // Getters and Setters  
}

**with Lombok**:  
import lombok.Data;  
import lombok.AllArgsConstructor;  
import lombok.NoArgsConstructor;

/*
	Make sure to include lombok library in classpath or in pom.xml for maven projects,  
  Example:  
	\<dependency\>  
      \<groupId\>org.projectlombok\</groupId\>  
   		\<artifactId\>lombok\</artifactId\>  
	\</dependency\>  
*/

@Data  
@AllArgsConstructor  
@NoArgsConstructor  

public class Address {  
&#9;private String city;  
&#9;private String zipcode;  
}

import java.util.List;

import lombok.Data;  
import lombok.AllArgsConstructor;  
import lombok.NoArgsConstructor;

@Data  
@AllArgsConstructor  
@NoArgsConstructor  

public class Person {  
&#9;private String name;  
&#9;private int age;  
&#9;private Address address;  
&#9;private List&lt;String&gt; skills;  
}

## Known Issues

Handling of highly complex nested JSON structures may result in deeply nested Java classes, which might require further optimization in future versions.  
Currently, only basic Java class structure (fields, getters, and setters) is supported.   
Advanced Java features (such as constructors or annotations) will be considered in future updates.


## License

This extension is licensed under the [MIT License](LICENSE).
See the LICENSE file for details.

## Disclaimer

- **Ethical Usage**: This tool is designed for ethical development and testing purposes only. Do not use it for any unethical or inappropriate activities.
- **PII/PHI Handling**: Avoid including personally identifiable information (PII) or protected health information (PHI) in the input spec. The developers are not responsible for any misuse of the extension.

### Support

For issues or questions, visit the GitHub repository or contact us via the Visual Studio Code Marketplace.