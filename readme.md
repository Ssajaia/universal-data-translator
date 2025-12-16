Universal Data Translator

https://img.shields.io/badge/Universal-Data%2520Translator-blue

https://img.shields.io/badge/version-2.0.0-green
https://img.shields.io/badge/license-MIT-orange
https://img.shields.io/badge/formats-4-yellow

Real-time auto-converting data format translator for developers, engineers, and data professionals. Seamlessly convert between JSON, YAML, XML, and TOML with intelligent auto-detection and validation.

✨ Features
🔄 Real-time Conversion
Instant translation between data formats as you type

Auto-detection of input format (JSON, YAML, XML, TOML)

Smart format switching - change formats and watch data transform instantly

Two-way conversion with swap functionality

📋 Format Support
Format	Icon	Description	Status
JSON	{ }	JavaScript Object Notation	✅ Full Support
YAML	📄	YAML Ain't Markup Language	✅ Full Support
XML	<>	Extensible Markup Language	✅ Full Support
TOML	⚙️	Tom's Obvious Minimal Language	✅ Full Support
🛡️ Validation & Error Handling
Robust validation for each format with detailed error messages

Never-wrong philosophy - clear indication when conversion fails

Visual feedback with color-coded status indicators

Comprehensive error reporting with specific line numbers and issues

🎨 User Experience
Beautiful, modern interface with gradient backgrounds and smooth animations

Responsive design that works on desktop, tablet, and mobile

Copy to clipboard buttons with visual feedback

Character count for input and output

Example data for quick testing

Auto-swap functionality between input/output

🚀 Quick Start
Option 1: Direct Use
Simply open index.html in any modern web browser - no installation required!

Option 2: Live Demo
Try the live demo here (Add your deployment link)

Option 3: Local Development
bash
# Clone the repository
git clone https://github.com/yourusername/universal-data-translator.git

# Navigate to the project directory
cd universal-data-translator

# Open in your browser
open index.html
# or
start index.html
# or
xdg-open index.html
📖 How to Use
Basic Conversion
Enter data in the left panel

Select input format (or use auto-detect)

Choose output format in the right panel

Watch real-time conversion happen automatically

Advanced Features
Auto-detect: Click the magic wand to automatically detect your input format

Swap formats: Click the swap button to reverse input and output

Load examples: Click any example button to load sample data

Copy results: Use the copy buttons to copy input or output to clipboard

Keyboard Shortcuts
Shortcut	Action
Ctrl + Enter	Convert data
Ctrl + S	Swap formats
Ctrl + C	Copy selected text
Tab	Navigate between elements
🏗️ Architecture
File Structure
text
universal-data-translator/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Core logic and parsers
└── README.md           # This documentation
Core Components
1. Format Detection Engine
javascript
// Intelligent format detection algorithm
detectFormat(data) → 'json' | 'yaml' | 'xml' | 'toml' | 'unknown'
Uses pattern matching and validation

Handles edge cases and malformed data

Provides confidence scoring for ambiguous formats

2. Parser/Serializer System
Each format has dedicated parser and serializer:

JSON: Native JSON.parse() / JSON.stringify()

YAML: Custom parser with indentation awareness

XML: DOM-based parser with attribute handling

TOML: Key-value parser with table support

3. Validation Pipeline
javascript
validateInput(data, format) → { valid: boolean, errors: Array }
Multi-stage validation

Detailed error reporting

Recovery suggestions

🔧 Technical Implementation
Parsers & Converters
YAML Parser
javascript
function parseYaml(yamlText) {
  // Handles:
  // - Key-value pairs
  // - Nested objects
  // - Arrays (both simple and complex)
  // - Comments and whitespace
  // - Multi-line strings
}
XML Converter
javascript
function xmlToJson(xmlString) {
  // Converts:
  // - Elements to objects
  // - Attributes to special properties
  // - Text content
  // - Nested structures
  // - Arrays of same-name elements
}
TOML Processor
javascript
function parseToml(tomlText) {
  // Supports:
  // - Key-value assignments
  // - Tables and array tables
  // - Inline tables
  // - Nested structures via dot notation
  // - Various data types
}
Error Handling System
The application implements a multi-layered error handling strategy:

Input Validation: Check format compliance before parsing

Parsing Validation: Validate during conversion

Output Validation: Verify output format correctness

User Feedback: Clear, actionable error messages

javascript
try {
  validateInput(data);
  parsedData = parseFormat(data);
  output = serializeFormat(parsedData);
  validateOutput(output);
} catch (error) {
  showDetailedError(error);
}
🎯 Use Cases
Development & Debugging
API Testing: Convert between JSON and XML for different API endpoints

Configuration Management: Switch between YAML and TOML for different tools

Data Migration: Convert legacy XML data to modern JSON format

Education & Learning
Format Comparison: See how the same data looks in different formats

Syntax Learning: Understand format differences through live conversion

Troubleshooting: Identify formatting issues with validation feedback

Documentation
Examples Generation: Create multiple format examples from single source

Configuration Examples: Show configuration in different formats for documentation

📱 Responsive Design
The application is fully responsive across all devices:

Device	Layout	Features
Desktop	Three-column layout	Full feature set
Tablet	Stacked panels	All functionality
Mobile	Single column	Optimized touch interface
🎨 Design Philosophy
Visual Design Principles
Clarity: Clean, uncluttered interface with clear visual hierarchy

Feedback: Immediate visual feedback for all user actions

Consistency: Uniform styling and interaction patterns

Accessibility: High contrast, keyboard navigation, screen reader support

Color Scheme
Primary: #4285f4 (Google Blue) - Actions and highlights

Success: #34a853 (Google Green) - Validation and success states

Warning: #fbbc05 (Google Yellow) - Warnings and auto-detect

Error: #ea4335 (Google Red) - Errors and alerts

Background: Gradient from #f5f7fa to #c3cfe2

🔍 Validation Examples
Valid JSON
json
{
  "name": "Valid Example",
  "count": 42,
  "active": true,
  "tags": ["one", "two", "three"]
}
Invalid YAML (with error)
yaml
name: Missing Quote
value: "unclosed quote
list:
  - item1
    - nested: wrong # Wrong indentation
The translator will show:

text
Error: Invalid YAML structure
Line 2: Unclosed string
Line 4: Incorrect indentation
📊 Performance
Instant conversion for documents up to 10,000 lines

Optimized parsers with O(n) complexity

Debounced input to prevent excessive conversions

Memory efficient with streaming validation

🤝 Contributing
We welcome contributions! Here's how you can help:

Reporting Issues
Check if the issue already exists

Provide sample data that reproduces the issue

Include browser and OS information

Feature Requests
Describe the use case

Suggest implementation approach

Consider edge cases

Code Contributions
Fork the repository

Create a feature branch

Add tests for new functionality

Submit a pull request

Development Setup
bash
# Install live server for development
npm install -g live-server

# Run development server
live-server --port=3000
📝 Roadmap
Planned Features
Binary Format Support (MessagePack, BSON, CBOR, Protocol Buffers)

Schema Validation (JSON Schema, XML Schema)

Batch Processing (Multiple files at once)

Command Line Interface (CLI version)

API Endpoint (REST API for integration)

Format History (Recent conversions)

Theme Support (Dark mode, high contrast)

In Progress
Core Converters (JSON ↔ YAML ↔ XML ↔ TOML)

Auto-detection with confidence scoring

Real-time Conversion

Comprehensive Error Handling

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Inspired by the need for quick data format conversions during development

Built with pure HTML, CSS, and JavaScript - no external dependencies

Thanks to all contributors and testers

⭐ Support
If you find this tool useful, please consider:

Giving it a star on GitHub

Sharing it with your colleagues

Reporting any issues you encounter

Contributing code or documentation

Built with ❤️ for developers who work with multiple data formats.
