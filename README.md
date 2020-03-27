## Simple way to manage your form with custom hook

> Simple example

```jsx
import easyHookForm from 'hook-easy-form';

const form = [
	{
		name: 'firstName',
		type: 'text',
		value: ''
	},
	{
		name: 'lastName',
		type: 'text',
		value: ''
	},
	{
		name: 'age',
		type: 'number',
		value: '',
	}
]

const FormComponent = () => {
	const {	formArray, updateEvent, resetEvent, submitEvent } = MyEasyForm({ initialForm: form, });

	return <div>
		{
			formArray.map(el => <input key={el.name} type={el.type} name={el.name} value={el.value} onChange={updateEvent} />)
		}
		<button onClick={resetEvent}>reset</button>
		<button onClick={submitEvent(submit)}>submit</button>
	</div>
}

```

## Available props 

1. initialForm is array of objects (required)
```javascript
[
	{
		name: string;
		value: any;
		type?: string;
		placeholder?: string;
		label?: string;
		error?: string;
		touched?: boolean;
		validate?: RULES;
		options?: any;
	}
]
```
2. `resetAfterSubmit` property is false by default 

## Available actions

```javascript
	formArray // form = array of objects
	formObject // form = object for non iterable cases
	updateEvent // event for onChange 
	resetEvent // reset form manually
	submitEvent // takes a callback as a param, return to callback formatted object
```
