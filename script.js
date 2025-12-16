// DOM Elements
const inputData = document.getElementById('inputData');
const outputData = document.getElementById('outputData');
const inputFormat = document.getElementById('inputFormat');
const outputFormat = document.getElementById('outputFormat');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const autoDetectBtn = document.getElementById('autoDetectBtn');
const copyInputBtn = document.getElementById('copyInputBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const errorPanel = document.getElementById('errorPanel');
const errorContent = document.getElementById('errorContent');
const inputValidation = document.getElementById('inputValidation');
const outputValidation = document.getElementById('outputValidation');
const inputCharCount = document.getElementById('inputCharCount');
const outputCharCount = document.getElementById('outputCharCount');
const loader = document.getElementById('loader');
const exampleBtns = document.querySelectorAll('.example-btn');

// Example data for each format
const examples = {
    json: `{
  "name": "Alice Johnson",
  "age": 28,
  "isStudent": false,
  "courses": ["Math", "Computer Science", "Physics"],
  "address": {
    "city": "Boston",
    "zip": "02101"
  }
}`,
    yaml: `name: Alice Johnson
age: 28
isStudent: false
courses:
  - Math
  - Computer Science
  - Physics
address:
  city: Boston
  zip: "02101"`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>Alice Johnson</name>
  <age>28</age>
  <isStudent>false</isStudent>
  <courses>
    <course>Math</course>
    <course>Computer Science</course>
    <course>Physics</course>
  </courses>
  <address>
    <city>Boston</city>
    <zip>02101</zip>
  </address>
</person>`,
    toml: `name = "Alice Johnson"
age = 28
isStudent = false

[[courses]]
name = "Math"

[[courses]]
name = "Computer Science"

[[courses]]
name = "Physics"

[address]
city = "Boston"
zip = "02101"`
};

// Initialize character counters
updateCharCount();

// Initialize the app with a conversion
setTimeout(() => {
    validateInput();
    convertData();
}, 100);

// Event Listeners
inputData.addEventListener('input', () => {
    updateCharCount();
    validateInput();
    // Auto-convert whenever input changes
    convertData();
});

outputData.addEventListener('input', updateCharCount);

convertBtn.addEventListener('click', convertData);
swapBtn.addEventListener('click', swapFormats);

// Auto-convert when input format changes
inputFormat.addEventListener('change', () => {
    validateInput();
    convertData();
});

// Auto-convert when output format changes
outputFormat.addEventListener('change', convertData);

autoDetectBtn.addEventListener('click', () => {
    detectAndSetFormat();
    convertData();
});

copyInputBtn.addEventListener('click', () => copyToClipboard(inputData, copyInputBtn));
copyOutputBtn.addEventListener('click', () => copyToClipboard(outputData, copyOutputBtn));

exampleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const format = this.getAttribute('data-example');
        inputData.value = examples[format];
        inputFormat.value = format;
        validateInput();
        convertData();
    });
});

// Functions
function updateCharCount() {
    if (inputData && inputCharCount) {
        inputCharCount.textContent = `${inputData.value.length} characters`;
    }
    if (outputData && outputCharCount) {
        outputCharCount.textContent = `${outputData.value.length} characters`;
    }
}

function detectFormat(data) {
    const trimmed = data.trim();

    if (!trimmed) return 'unknown';

    // Check for JSON
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
            JSON.parse(trimmed);
            return 'json';
        } catch (e) {
            // Not valid JSON
        }
    }

    // Check for XML
    if (trimmed.startsWith('<?xml') || (trimmed.startsWith('<') && trimmed.includes('</'))) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(trimmed, "application/xml");
            const parseError = xmlDoc.getElementsByTagName("parsererror");
            if (parseError.length === 0) {
                return 'xml';
            }
        } catch (e) {
            // Not valid XML
        }
    }

    // Check for YAML vs TOML
    const lines = trimmed.split('\n');
    let yamlScore = 0;
    let tomlScore = 0;

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        // YAML patterns
        if (/^[\w-]+:\s*\S/.test(line) || /^-\s+\S/.test(line) || /^\s+\w+:\s*\S/.test(line)) {
            yamlScore++;
        }

        // TOML patterns
        if (/^\w+\s*=\s*["'\d\[\{]/.test(trimmedLine) ||
            /^\[\[[\w\.]+\]\]/.test(trimmedLine) ||
            /^\[[\w\.]+\]/.test(trimmedLine)) {
            tomlScore++;
        }
    }

    if (yamlScore > tomlScore && yamlScore > lines.length * 0.2) {
        return 'yaml';
    } else if (tomlScore > yamlScore && tomlScore > lines.length * 0.2) {
        return 'toml';
    }

    return 'unknown';
}

function detectAndSetFormat() {
    const detected = detectFormat(inputData.value.trim());
    if (detected !== 'unknown') {
        inputFormat.value = detected;
        showMessage(`Auto-detected format: ${detected.toUpperCase()}`, 'info');
        validateInput();
    } else {
        showError('Could not auto-detect format. Please select manually.');
    }
}

function validateInput() {
    const format = inputFormat.value === 'auto' ? detectFormat(inputData.value.trim()) : inputFormat.value;
    const data = inputData.value.trim();

    // Clear previous validation
    if (inputValidation) {
        inputValidation.className = 'validation-status';
    }
    if (errorPanel) {
        errorPanel.classList.add('error-hidden');
    }

    if (!data) {
        if (inputValidation) {
            inputValidation.className = 'validation-status invalid';
            inputValidation.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>No input data</span>';
        }
        return false;
    }

    try {
        switch(format) {
            case 'json':
                JSON.parse(data);
                if (inputValidation) {
                    inputValidation.className = 'validation-status valid';
                    inputValidation.innerHTML = '<i class="fas fa-check-circle"></i><span>Valid JSON</span>';
                }
                return true;
            case 'yaml':
                // Simple YAML validation
                if (!validateYaml(data)) {
                    throw new Error('Invalid YAML structure');
                }
                if (inputValidation) {
                    inputValidation.className = 'validation-status valid';
                    inputValidation.innerHTML = '<i class="fas fa-check-circle"></i><span>Valid YAML</span>';
                }
                return true;
            case 'xml':
                // Basic XML validation
                if (!data.startsWith('<?xml') && !data.startsWith('<')) {
                    throw new Error('Invalid XML: Must start with <?xml or a tag');
                }
                // Try to parse with DOMParser for more thorough validation
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "application/xml");
                const parseError = xmlDoc.getElementsByTagName("parsererror");
                if (parseError.length > 0) {
                    throw new Error('Invalid XML structure');
                }
                if (inputValidation) {
                    inputValidation.className = 'validation-status valid';
                    inputValidation.innerHTML = '<i class="fas fa-check-circle"></i><span>Valid XML</span>';
                }
                return true;
            case 'toml':
                // Simple TOML validation
                if (!validateToml(data)) {
                    throw new Error('Invalid TOML structure');
                }
                if (inputValidation) {
                    inputValidation.className = 'validation-status valid';
                    inputValidation.innerHTML = '<i class="fas fa-check-circle"></i><span>Valid TOML</span>';
                }
                return true;
            case 'unknown':
                if (inputValidation) {
                    inputValidation.className = 'validation-status invalid';
                    inputValidation.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Unknown format</span>';
                }
                return false;
            default:
                return false;
        }
    } catch (error) {
        if (inputValidation) {
            inputValidation.className = 'validation-status invalid';
            inputValidation.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>Invalid ${format.toUpperCase()}</span>`;
        }
        showError(`Validation Error (${format.toUpperCase()}): ${error.message}`);
        return false;
    }
}

function validateYaml(yamlText) {
    // Simple YAML validation - check basic structure
    const lines = yamlText.split('\n');
    let indentStack = [0];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Check for valid YAML patterns
        const validPatterns = [
            /^[\w-]+:\s*\S/,      // key: value
            /^[\w-]+:\s*$/,       // key: (start of nested object)
            /^-\s+\S/,            // - list item
            /^-\s*$/,             // - (empty list item)
            /^\s*#/,              // comment
            /^\s*$/,              // empty line
            /^\s+\w+:\s*\S/,      // indented key: value
            /^\s+-\s+\S/          // indented list item
        ];

        let isValid = false;
        for (const pattern of validPatterns) {
            if (pattern.test(line)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            return false;
        }
    }

    return true;
}

function validateToml(tomlText) {
    // Simple TOML validation - check basic structure
    const lines = tomlText.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines and comments
        if (!line || line.startsWith('#')) continue;

        // Check for valid TOML patterns
        const validPatterns = [
            /^[\w_]+\s*=\s*["'\d\[\{\-]/,  // key = value
            /^\[[\w\._]+\]/,               // [table]
            /^\[\[[\w\._]+\]\]/,           // [[array table]]
            /^#/,                          // comment
            /^".*"\s*=\s*.*/,              // "quoted key" = value
            /^'.*'\s*=\s*.*/               // 'quoted key' = value
        ];

        let isValid = false;
        for (const pattern of validPatterns) {
            if (pattern.test(line)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            return false;
        }
    }

    return true;
}

function showError(message) {
    if (errorContent) {
        errorContent.textContent = message;
    }
    if (errorPanel) {
        errorPanel.classList.remove('error-hidden');
    }
}

function showMessage(message, type = 'info') {
    // Create a temporary message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'info' ? 'var(--primary-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function hideError() {
    if (errorPanel) {
        errorPanel.classList.add('error-hidden');
    }
}

function parseYaml(yamlText) {
    // Simple YAML parser for basic structures
    const lines = yamlText.split('\n');
    const result = {};
    const stack = [{obj: result, indent: -1}];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Calculate indentation
        const indent = line.search(/\S/);

        // Pop stack until we find parent with less indentation
        while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
            stack.pop();
        }

        const current = stack[stack.length - 1].obj;

        // Check for list item
        if (trimmed.startsWith('- ')) {
            const value = trimmed.substring(2).trim();
            if (!Array.isArray(current)) {
                // Convert to array if not already
                const key = Object.keys(current).pop();
                if (key && !Array.isArray(current[key])) {
                    current[key] = [current[key]];
                }
            }

            // Handle list items
            if (value.includes(': ')) {
                // Nested object in list
                const [key, val] = value.split(': ').map(s => s.trim());
                const newObj = {[key]: val};
                if (Array.isArray(current)) {
                    current.push(newObj);
                } else {
                    // Find the array
                    for (const key in current) {
                        if (Array.isArray(current[key])) {
                            current[key].push(newObj);
                            break;
                        }
                    }
                }
            } else {
                // Simple list item
                if (Array.isArray(current)) {
                    current.push(value);
                } else {
                    // Find the array
                    for (const key in current) {
                        if (Array.isArray(current[key])) {
                            current[key].push(value);
                            break;
                        }
                    }
                }
            }
        }
        // Check for key-value pair
        else if (trimmed.includes(': ')) {
            const [key, value] = trimmed.split(': ').map(s => s.trim());

            // Check if value is an array start
            if (value === '' && i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
                current[key] = [];
                stack.push({obj: current[key], indent});
            }
            // Check if value is an object start
            else if (value === '') {
                current[key] = {};
                stack.push({obj: current[key], indent});
            }
            // Simple key-value
            else {
                // Convert string values
                let finalValue = value;

                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    finalValue = value.substring(1, value.length - 1);
                }
                // Convert numbers
                else if (!isNaN(value) && value.trim() !== '') {
                    finalValue = Number(value);
                }
                // Convert booleans
                else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                    finalValue = value.toLowerCase() === 'true';
                }

                current[key] = finalValue;
            }
        }
        // Handle indented content (nested objects/arrays)
        else if (trimmed.endsWith(':')) {
            const key = trimmed.substring(0, trimmed.length - 1).trim();
            current[key] = {};
            stack.push({obj: current[key], indent});
        }
    }

    return result;
}

function jsonToYaml(jsonObj, indent = 0) {
    if (typeof jsonObj !== 'object' || jsonObj === null) {
        return JSON.stringify(jsonObj);
    }

    if (Array.isArray(jsonObj)) {
        let yaml = '';
        for (const item of jsonObj) {
            yaml += '  '.repeat(indent) + '- ';
            if (typeof item === 'object' && item !== null) {
                if (Array.isArray(item)) {
                    yaml += '\n' + jsonToYaml(item, indent + 1);
                } else {
                    yaml += '\n' + jsonToYaml(item, indent + 1);
                }
            } else {
                yaml += (typeof item === 'string' ? item : JSON.stringify(item)) + '\n';
            }
        }
        return yaml;
    }

    let yaml = '';
    for (const key in jsonObj) {
        const value = jsonObj[key];
        yaml += '  '.repeat(indent) + key + ': ';

        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                yaml += '\n' + jsonToYaml(value, indent);
            } else {
                yaml += '\n' + jsonToYaml(value, indent + 1);
            }
        } else {
            yaml += (typeof value === 'string' ? value : JSON.stringify(value)) + '\n';
        }
    }

    return yaml;
}

function xmlToJson(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    function parseNode(node) {
        const obj = {};

        // Handle attributes
        if (node.attributes && node.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                obj['@attributes'][attr.nodeName] = attr.nodeValue;
            }
        }

        // Handle child nodes
        const childNodes = node.childNodes;
        let hasElementChildren = false;

        for (let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i];

            if (child.nodeType === Node.ELEMENT_NODE) {
                hasElementChildren = true;
                const childName = child.nodeName;

                if (!obj[childName]) {
                    obj[childName] = parseNode(child);
                } else {
                    // Convert to array if multiple children with same name
                    if (!Array.isArray(obj[childName])) {
                        obj[childName] = [obj[childName]];
                    }
                    obj[childName].push(parseNode(child));
                }
            } else if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text) {
                    obj['#text'] = text;
                }
            }
        }

        // If no element children, just return text content
        if (!hasElementChildren && obj['#text']) {
            return obj['#text'];
        }

        return obj;
    }

    const root = xmlDoc.documentElement;
    const result = {};
    result[root.nodeName] = parseNode(root);

    return result;
}

function jsonToXml(jsonObj, rootName = 'data') {
    function buildXml(obj, nodeName) {
        if (typeof obj !== 'object' || obj === null) {
            return `<${nodeName}>${obj}</${nodeName}>`;
        }

        let xml = `<${nodeName}>`;

        for (const key in obj) {
            if (key === '@attributes') {
                // Skip attributes for this simple implementation
                continue;
            } else if (key === '#text') {
                xml += obj[key];
            } else if (Array.isArray(obj[key])) {
                for (const item of obj[key]) {
                    xml += buildXml(item, key);
                }
            } else {
                xml += buildXml(obj[key], key);
            }
        }

        xml += `</${nodeName}>`;
        return xml;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n${buildXml(jsonObj, rootName)}`;
}

function parseToml(tomlText) {
    // Simple TOML parser for basic structures
    const result = {};
    const lines = tomlText.split('\n');
    let currentTable = result;
    let currentArrayTable = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines and comments
        if (!line || line.startsWith('#')) continue;

        // Handle table headers
        if (line.startsWith('[')) {
            if (line.startsWith('[[')) {
                // Array table
                const tableName = line.substring(2, line.length - 2).trim();
                if (!result[tableName]) {
                    result[tableName] = [];
                }
                currentArrayTable = [];
                result[tableName].push(currentArrayTable);
                currentTable = currentArrayTable;
            } else {
                // Regular table
                const tableName = line.substring(1, line.length - 1).trim();
                const parts = tableName.split('.');
                currentTable = result;

                for (const part of parts) {
                    if (!currentTable[part]) {
                        currentTable[part] = {};
                    }
                    currentTable = currentTable[part];
                }
                currentArrayTable = null;
            }
            continue;
        }

        // Handle key-value pairs
        if (line.includes('=')) {
            const [key, value] = line.split('=').map(s => s.trim());

            // Parse value
            let parsedValue;

            // Strings
            if (value.startsWith('"') && value.endsWith('"') ||
                value.startsWith("'") && value.endsWith("'")) {
                parsedValue = value.substring(1, value.length - 1);
            }
            // Numbers
            else if (!isNaN(value)) {
                parsedValue = Number(value);
            }
            // Booleans
            else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                parsedValue = value.toLowerCase() === 'true';
            }
            // Arrays
            else if (value.startsWith('[') && value.endsWith(']')) {
                const arrayStr = value.substring(1, value.length - 1);
                parsedValue = arrayStr.split(',').map(s => {
                    const trimmed = s.trim();
                    if (!isNaN(trimmed)) return Number(trimmed);
                    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                        return trimmed.substring(1, trimmed.length - 1);
                    }
                    return trimmed;
                });
            }
            // Inline tables (simple objects)
            else if (value.startsWith('{') && value.endsWith('}')) {
                const tableStr = value.substring(1, value.length - 1);
                const pairs = tableStr.split(',').map(p => p.trim());
                parsedValue = {};
                for (const pair of pairs) {
                    const [k, v] = pair.split('=').map(s => s.trim());
                    parsedValue[k] = v.startsWith('"') && v.endsWith('"') ?
                        v.substring(1, v.length - 1) : Number(v);
                }
            }
            else {
                parsedValue = value;
            }

            // Handle nested keys
            const keyParts = key.split('.');
            let target = currentTable;

            for (let j = 0; j < keyParts.length - 1; j++) {
                if (!target[keyParts[j]]) {
                    target[keyParts[j]] = {};
                }
                target = target[keyParts[j]];
            }

            target[keyParts[keyParts.length - 1]] = parsedValue;
        }
    }

    return result;
}

function jsonToToml(jsonObj, prefix = '') {
    let toml = '';

    for (const key in jsonObj) {
        const value = jsonObj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                // Check if array of objects (for array tables)
                if (value.length > 0 && typeof value[0] === 'object') {
                    for (const item of value) {
                        toml += `[[${fullKey}]]\n`;
                        toml += jsonToToml(item, '');
                    }
                } else {
                    // Simple array
                    const arrayStr = value.map(v =>
                        typeof v === 'string' ? `"${v}"` : v
                    ).join(', ');
                    toml += `${key} = [${arrayStr}]\n`;
                }
            } else {
                // Object - create a table
                toml += `[${fullKey}]\n`;
                toml += jsonToToml(value, '');
            }
        } else {
            // Simple value
            const formattedValue = typeof value === 'string' ? `"${value}"` : value;
            toml += `${key} = ${formattedValue}\n`;
        }
    }

    return toml;
}

async function convertData() {
    // Validate input first
    if (!validateInput()) {
        showError("Cannot convert: Input data is invalid");
        if (outputData) {
            outputData.value = "// Cannot convert: Input data is invalid\n// Please fix the input validation errors above.";
        }
        return;
    }

    // Show loader
    if (loader) loader.style.display = 'block';
    if (convertBtn) convertBtn.style.opacity = '0.5';

    // Small delay to show loader (for better UX)
    setTimeout(() => {
        try {
            const input = inputData.value.trim();
            const fromFormat = inputFormat.value === 'auto' ? detectFormat(input) : inputFormat.value;
            const toFormat = outputFormat.value;

            if (fromFormat === 'unknown') {
                throw new Error('Cannot detect input format. Please select format manually.');
            }

            // If same format, just copy with pretty formatting
            if (fromFormat === toFormat) {
                let formatted;
                switch(fromFormat) {
                    case 'json':
                        formatted = JSON.stringify(JSON.parse(input), null, 2);
                        break;
                    case 'yaml':
                        formatted = input; // YAML already formatted
                        break;
                    case 'xml':
                        // Try to format XML
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(input, "application/xml");
                        const serializer = new XMLSerializer();
                        formatted = serializer.serializeToString(xmlDoc);
                        break;
                    case 'toml':
                        formatted = input; // TOML already formatted
                        break;
                    default:
                        formatted = input;
                }
                outputData.value = formatted;
            } else {
                // Parse input based on format
                let parsedData;

                switch(fromFormat) {
                    case 'json':
                        parsedData = JSON.parse(input);
                        break;
                    case 'yaml':
                        // Use our simple YAML parser
                        parsedData = parseYaml(input);
                        break;
                    case 'xml':
                        parsedData = xmlToJson(input);
                        break;
                    case 'toml':
                        parsedData = parseToml(input);
                        break;
                    default:
                        throw new Error(`Unsupported input format: ${fromFormat}`);
                }

                // Convert to output format
                let output;

                switch(toFormat) {
                    case 'json':
                        output = JSON.stringify(parsedData, null, 2);
                        break;
                    case 'yaml':
                        output = jsonToYaml(parsedData);
                        break;
                    case 'xml':
                        output = jsonToXml(parsedData, 'data');
                        break;
                    case 'toml':
                        output = jsonToToml(parsedData);
                        break;
                    default:
                        throw new Error(`Unsupported output format: ${toFormat}`);
                }

                // Set output
                if (outputData) {
                    outputData.value = output;
                }
            }

            // Validate output
            if (outputValidation) {
                outputValidation.className = 'validation-status valid';
                outputValidation.innerHTML = `<i class="fas fa-check-circle"></i><span>Valid ${toFormat.toUpperCase()} conversion</span>`;
            }

            hideError();
            updateCharCount();

        } catch (error) {
            showError(`Conversion Error: ${error.message}`);
            if (outputData) {
                outputData.value = `// Conversion failed: ${error.message}\n\n// Make sure your input data is valid and in the correct format.`;
            }
            if (outputValidation) {
                outputValidation.className = 'validation-status invalid';
                outputValidation.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>Conversion failed</span>`;
            }
        } finally {
            // Hide loader
            if (loader) loader.style.display = 'none';
            if (convertBtn) convertBtn.style.opacity = '1';
        }
    }, 100);
}

function swapFormats() {
    const tempFormat = inputFormat.value;
    inputFormat.value = outputFormat.value;
    outputFormat.value = tempFormat;

    const tempData = inputData.value;
    inputData.value = outputData.value;
    outputData.value = tempData;

    validateInput();
    convertData();
}

function copyToClipboard(textarea, button) {
    if (!textarea || !textarea.value) return;

    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // Visual feedback
            const originalText = button.innerHTML;
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';

            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = originalText;
            }, 2000);

            showMessage('Copied to clipboard!', 'info');
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        showMessage('Failed to copy to clipboard', 'error');
    }
}
