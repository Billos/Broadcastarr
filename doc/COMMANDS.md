# Commands

Defining the scraping and interception is now done with a Command pattern.

The organization of the commands is as follows:
Broadcastarr will run root scenarios (index and intercept).
A scenario will run a set of commands.

The root scenario is run by an Orchestrator, is basically runs a virtual command RunScenario.

## Navigation commands

Those commands are used to navigate through the website

### Click

Click on an element

**Parameters:**

- `selector` (String, required): The CSS selector of the element to click.
- `safe` (Boolean, optional): If true, ensures the element is safe to click.

### Counter

Count the number of elements

**Parameters:**

- `root` (String, optional): The root element to start counting from.
- `selector` (String, required): The CSS selector of the elements to count.
- `store` (String, optional): The variable to store the count.

### FillInput

Fill an input

**Parameters:**

- `selector` (String, required): The CSS selector of the input element.
- `value` (String, required): The value to fill in the input.

### GetValues

Get the values of elements

**Parameters:**

- `root` (String, optional): The root element to start getting values from.
- `values` (Array, required): List of objects with the following properties:
  - `selector` (String, required): The CSS selector of the element.
  - `attribute` (String, optional): The attribute to get the value from.
  - `replacements` (Array, optional): List of replacements to apply.
  - `store` (String, optional): The variable to store the value.
  - `canFail` (Boolean, optional): If true, allows the command to fail.
  - `elementExists` (Boolean, optional): If true, checks if the element exists.
  - `valueIfFailed` (String, optional): The value to use if the command fails.

### GoToPage

Go to a page

**Parameters:**

- `url` (String, required): The URL of the page to navigate to.

### InterceptResponse

Intercept a network response

**Parameters:**

- `filters` (Object, required): The filters to apply to the interception.
  - `urlRegex` (String, optional): The regex to match the URL.
  - `method` (String, optional): The HTTP method to intercept.
- `timeout` (Number, required): The timeout for the interception.
- `extracts` (Array, required): List of objects with the following properties:
  - `source` (String, required): The source of the value to extract.
  - `key` (String, optional): The key to extract the value from.
  - `replacements` (Array, optional): List of replacements to apply.
  - `store` (String, required): The variable to store the extracted value.

### Sleep

Sleep for a given time

**Parameters:**

- `duration` (String, required): The duration to sleep.

## Scenario commands

Those commands are related to the scenarios

### RunScenario

You might want to have sequences of Commands that will be called by multiple scenarios (e.g. login, cookie acceptance...)

**Parameters:**

- `scenario` (String, required): The name of the scenario to run.

### SetValues

Set some values in the data context that will be used by the other commands

**Parameters:**

- `values` (Array, required): List of objects with the following properties:
  - `store` (String, required): The variable to store the value.
  - `value` (String, required): The value to set.
  - `isDate` (Boolean, optional): If true, the value is a date.
  - `isEmptyArray` (Boolean, optional): If true, the value is an empty array.
  - `dateFormat` (String, optional): The format of the date.

### AssertGroup

Assert the group details

**Parameters:**

- `category` (String, required): The category of the group.
- `country` (String, required): The country of the group.
- `name` (String, required): The name of the group.

## Broadcasting specific commands

Those commands are related to the broadcasting engine.

### AssertBroadcast

Given a category, country, name and a date, assert that the broadcast exists, if it does not, it will be created

## Data context

The data context is created by the Orchestrator and is passed to the commands.
Each command can modify the data context and the modifications will be passed to the next command.
However the data context have different scopes.

### Global

The global scope is shared by all the commands in the scenario, and cannot be modified by the commands.

### Execution

The execution scope is shared by all the scenarios and sub-scenarios.

### Scenario

The scenario scope is shared by all the commands in the scenario, and cannot be modified by the commands.
The RunScenario command creates an empty context that will be passed to the scenario run.

### Command

The command scope is a scope designed to be used by a single command.
It is created by the RunScenario command and passed to the command that will be run.

### Return

The return scope is a scope designed to be used by a single command.
