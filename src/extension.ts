import * as vscode from 'vscode';
import configData from './config.json';

async function validateAndFormatJson(inputText: string): Promise<string> {
	try {
		const parsedJson = JSON.parse(inputText);
		return JSON.stringify(parsedJson, null, 2);  // Pretty prints with 2 spaces indentation
	}
	catch (error: any) {
		console.log('errors:: ' + error);
		return `Invalid JSON: ${error.message}`;
	}

}

async function generateJavaModelClass(inputText: string, className: string): Promise<string> {
	try {
		const parsedJson = JSON.parse(inputText);
		return generateClass(parsedJson, className);
	} catch (error: any) {
		return `Invalid JSON: ${error.message}`;
	}
}

function generateClass(jsonObj: any, className: string): string {
	let importList = 'import java.util.List;\n\n';
	let classDefinition = `public class ${className} {\n`;

	for (const key in jsonObj) {
		const value = jsonObj[key];
		const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
		const fieldType = getJavaType(value, capitalizeFirstLetter(key));

		if (Array.isArray(value)) {
			// Handle arrays without iterating over the array elements (skip the "0", "1", etc. issue)
			classDefinition += `    private ${fieldType} ${fieldName};\n`;
		} else if (typeof value === 'object' && value !== null) {
			// Recursively handle nested objects
			classDefinition += `    private ${fieldType} ${fieldName};\n`;
		} else {
			// Handle primitive types
			classDefinition += `    private ${fieldType} ${fieldName};\n`;
		}
	}

	classDefinition += '\n';

	// Generate getters and setters
	for (const key in jsonObj) {
		const value = jsonObj[key];
		const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
		const fieldType = getJavaType(value, capitalizeFirstLetter(key));

		// Generate getter
		classDefinition += `    public ${fieldType} get${capitalizeFirstLetter(key)}() {\n`;
		classDefinition += `        return ${fieldName};\n`;
		classDefinition += `    }\n\n`;

		// Generate setter
		classDefinition += `    public void set${capitalizeFirstLetter(key)}(${fieldType} ${fieldName}) {\n`;
		classDefinition += `        this.${fieldName} = ${fieldName};\n`;
		classDefinition += `    }\n\n`;
	}

	classDefinition += `}`;

	// Recursively generate classes for nested objects
	for (const key in jsonObj) {
		const value = jsonObj[key];
		if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
			classDefinition += `\n\n${generateClass(value, capitalizeFirstLetter(key))}`;
		}
	}

	if (classDefinition.includes('List')) {
		classDefinition = importList + classDefinition;
	}
	return classDefinition;
}

function getJavaType(value: any, nestedClassName: string): string {
	if (typeof value === 'string') {
		return 'String';
	} else if (typeof value === 'number') {
		return Number.isInteger(value) ? 'int' : 'double';
	} else if (typeof value === 'boolean') {
		return 'boolean';
	} else if (Array.isArray(value)) {
		const arrayType = value.length > 0 ? getJavaType(value[0], nestedClassName) : 'Object';
		return `List<${arrayType}>`;
	} else if (typeof value === 'object' && value !== null) {
		return nestedClassName;
	} else {
		return 'Object';  // Default type
	}
}

function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateLombokClass(jsonString: string, className: string): string {
	try {
		const jsonObj = JSON.parse(jsonString);
		if (!className || !/^[a-zA-Z_$][a-zA-Z\d_$]*$/.test(className)) {
			return 'Invalid Class Name';
		}

		const classes = new Map<string, string>();
		processObject(jsonObj, className, classes);

		return Array.from(classes.values()).join('\n\n');
	} catch (error) {
		return 'Invalid JSON';
	}
}

function processObject(jsonObj: any, className: string, classes: Map<string, string>) {
	let importList = 'import java.util.List;\n\n';

	let classDef = `import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/*
	Make sure to include lombok library in classpath or in pom.xml for maven projects, Example:
	<dependency>
   		<groupId>org.projectlombok</groupId>
   		<artifactId>lombok</artifactId>
	</dependency>
*/

@Data
@AllArgsConstructor
@NoArgsConstructor
		
public class ${className} {\n`;

	for (const key in jsonObj) {
		if (jsonObj.hasOwnProperty(key)) {
			const fieldName = key;
			const fieldValue = jsonObj[key];
			const fieldType = determineFieldType(fieldValue, capitalizeFirstLetter(fieldName), classes);

			classDef += `    private ${fieldType} ${fieldName};\n`;
		}
	}

	classDef += '}';

	if (classDef.includes('List')) {
		classDef = importList + classDef;
	}
	classes.set(className, classDef);
}

function determineFieldType(value: any, nestedClassName: string, classes: Map<string, string>): string {
	if (typeof value === 'string') {
		return 'String';
	} else if (typeof value === 'number') {
		return Number.isInteger(value) ? 'int' : 'double';
	} else if (typeof value === 'boolean') {
		return 'boolean';
	} else if (Array.isArray(value)) {
		const arrayType = determineFieldType(value[0], nestedClassName, classes);
		return `List<${arrayType}>`;
	} else if (typeof value === 'object' && value !== null) {
		// Handle nested object by creating a new class
		processObject(value, nestedClassName, classes);
		return nestedClassName;
	} else {
		return 'Object';
	}
}


export async function activate(context: vscode.ExtensionContext) {

	let newPanel: vscode.WebviewPanel | undefined = undefined;

	console.log('Extension "json util" is now active!');

	const processtest = vscode.commands.registerCommand('jsonutil.processTest', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello VS code from Suresh Nettur - PT!');

		// Create and show panel
		let currentPanel = vscode.window.createWebviewPanel(
			'processTests',
			'JSON Validator, formatter, Java Model Generator',
			vscode.ViewColumn.One,
			{ enableScripts: true, }
		);

		// And set its HTML content
		currentPanel.webview.html = getWebviewContent();

		// handle receiving messages from the webview
		currentPanel.webview.onDidReceiveMessage(async message => {
			if (!currentPanel) {
				return;
			}

			//vscode.window.showInformationMessage('Hello VS code from Suresh Nettur - PT!');

			switch (message.command) {
				case 'alert':
					//console.log('Input given:: ' + message.text);

					if (message.text.length === 0) {
						vscode.window.showErrorMessage(`Please enter data to process.`);
						return;
					}

					let javaModelCode = "Java Model Code - Not Available.";
					let javaModelLombokCode = "Java Lombok Model Code - Not Available.";

					try {
						let formattedJson = await validateAndFormatJson(message.text);
						//console.log('response from validateAndFormatJson:: ' + result);

						if (!formattedJson.startsWith('Invalid JSON')) {
							javaModelCode = await generateJavaModelClass(message.text, message.className);
							javaModelLombokCode = await generateLombokClass(message.text, message.className);
						}

						currentPanel.webview.postMessage({
							type: 'message', formattedJson: formattedJson, javaModelCode: javaModelCode, javaModelLombokCode: javaModelLombokCode
						});

					}
					catch (error: any) {
						console.error('Error processing json:', error);
						vscode.window.showErrorMessage(`Failed to process json. ${error}`);
					}
					return;
			}

		}, undefined, context.subscriptions);

	});

	context.subscriptions.push(processtest);
}

function getWebviewContent() {
	return `<!DOCTYPE html>
  <html>
    <head>
        <style>
			textarea {
  				resize: none;
				padding: 15px;
				font-size: 16px;
				font-family: 'Arial', sans-serif;
				color: #333;
				background: linear-gradient(135deg, #e0f7fa, #e1bee7);
				border: 2px solid #673ab7;
				border-radius: 12px;
				box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
				overflow: auto;
				outline: none;
				transition: all 0.3s ease-in-out;
			}
		    .fancy-input {
				width: 15%;
				padding: 10px 10px 10px 5px;
				font-size: 18px;
				border: 1px solid #ccc;
				border-radius: 5px;
				outline: none;
				background: none;
				background-color: #f7f7f7;
				transition: border-color 0.3s ease-in-out;
		    }
			table {
				font-family: arial, sans-serif;
				border: 0px solid #dddddd;
				border-collapse: collapse;
			}
			td, th {
				border: 0px solid #dddddd;
				text-align: center;
				padding: 0px;
			}
			.fancy-button {
				display: inline-block;
				padding: 12px 24px;
				font-size: 16px;
				font-family: 'Arial', sans-serif;
				font-weight: bold;
				color: #fff;
				background: linear-gradient(135deg, #ff4081, #2196f3);
				border: none;
				border-radius: 30px;
				box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
				cursor: pointer;
				outline: none;
				text-transform: uppercase;
				transition: all 0.3s ease-in-out;
	        }
			h1.fancy {
            	font-family: 'Georgia', serif;
            	font-size: 30px;
            	text-align: center;
				background: linear-gradient(135deg, #36d1dc, #5b86e5);
				color: transparent;
				-webkit-background-clip: text;
				background-clip: text;
				letter-spacing: 3px;
				font-weight: bold;
				text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
				//margin: 5px 0;
				transition: transform 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
				margin-bottom: 0px;
        	}
			h4.fancy {
				font-family: 'Courier New', monospace;
				font-size: 16px;
				color: #ffffff;
				text-align: center;
				letter-spacing: 1.5px;
				transition: all 0.3s ease-in-out;
				margin-top: 0px; 
        	}
			label.fancy-label {
				font-family: 'Arial', sans-serif;
				font-size: 18px;
				font-weight: bold;
				color: #ADD8E6;
				letter-spacing: 1px;
			}
			select.fancy-select {
				width: 100%;
				max-width: 300px;
				padding: 10px 15px;
				font-family: 'Arial', sans-serif;
				font-size: 16px;
				color: #333;
				background-color: #f1f1f1;
				border: none;
				border-radius: 10px;
				box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				background-repeat: no-repeat;
				background-position: right 10px center;
				background-size: 12px;
				cursor: pointer;
				transition: all 0.3s ease;
			}
			select.fancy-select:focus {
				outline: none;
				background-color: #e0e0e0;
				box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
			}
	        option {
    	        padding: 10px;
        	    font-size: 16px;
        	}
        </style>
    </head>
	
	<body>

	<script type="text/javascript">

		const vscode = acquireVsCodeApi(); 

		function clearAll() {
			document.getElementById("txt").value = "";
			document.getElementById("formattedJsonText").value = "";
			document.getElementById("javaModelText").value = "";
			document.getElementById("javaModelLombokText").value = "";
		}

		function displayOut() {
			vscode.postMessage({
				command: "alert", 
				text: document.getElementById("txt").value,
				className: document.getElementById("className").value
			});
		}

	    // Handle the message inside the webview
        window.addEventListener("message", event => {
			document.getElementById("formattedJsonText").value = event.data.formattedJson;
			document.getElementById("javaModelText").value = event.data.javaModelCode;
			document.getElementById("javaModelLombokText").value = event.data.javaModelLombokCode;
			document.getElementById("formattedJsonText").focus();
        });

	</script>

	<form>
  		<table style="width: 100%;" align="center" border="5">
    		<tr>
        		<td>
					<h1 class="fancy">JSON Utility</h1>
					<h4 class="fancy">Validator, Formatter, Java Model generator<h4>
				</td>
    		</tr>

			<tr>
				<th>
					<label class="fancy-label">Java Class Name</label>
					<input type="text" id="className" name="className" placeholder="ClassName" value="ClassName" class="fancy-input">
				</th>
			</tr>
			<tr><td>&nbsp;</td></tr>
			<tr>
        		<td>
					<textarea id="txt" rows="14" cols="95" align="left">{"tag1":"value1","tag2":"value2"}
					</textarea>
				</td>
    		</tr>
			<tr><td>&nbsp;</td></tr>
			<tr>
				<td>
					<input class="fancy-button" type="button" onclick="displayOut()" value=" Process ">
					&nbsp;&nbsp;&nbsp;&nbsp;
					<input class="fancy-button" type="button" onclick="clearAll()" value=" Clear ">
				</td>
			</tr>
			<tr><td>&nbsp;</td></tr>
		</table>

		<table style="width: 100%;" align="center" border="5">
			<tr>
				<td>
					<label class="fancy-label">Formatted JSON</label>
				</td>
				<td>
					<label class="fancy-label">Java Model</label>
				</td>
				<td>
					<label class="fancy-label">Java Lombok Model</label>
				</td>
			</tr>
			<tr>
				<td>
					<textarea id="formattedJsonText" rows="15" cols="40" readonly="readonly"></textarea>
				</td>
				<td>
					<textarea id="javaModelText" rows="15" cols="50" readonly="readonly"></textarea>
				</td>
				<td>
					<textarea id="javaModelLombokText" rows="15" cols="50" readonly="readonly"></textarea>
				</td>
			</tr>
			<tr><td>&nbsp;</td></tr>
  		</table>
	</form>

</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() { }
