## hook-easy-form
Simple way to manage your form with custom hook

## Installation

```bash
npm install hook-easy-form
```

## Usage

Simple form

```jsx
import easyHook from 'hook-easy-form';

const form = [
	{
		name: 'firstName',
		value: '',
		options: {
			type: 'text',
		},
	},
	{
		name: 'lastName',
		value: '',
		options: {
			type: 'text',
		}
	},
	{
		name: 'age',
		value: '',
		options: {
			type: 'number',
		}
	},
]

const FormComponent = () => {
	const {	formArray, updateEvent, resetEvent, submitEvent } = easyHook({ initialForm: form, });

	return <div>
		{formArray.map(el => <input
			key={el.name} 
			name={el.name}
			type={el.options.type} 
			value={el.value}
			onChange={updateEvent}
			/>
		)}
		<button onClick={resetEvent}>reset</button>
		<button onClick={submitEvent(submit)}>submit</button>
	</div>
}
```

Simple form with validation

```jsx
import easyHook from 'hook-easy-form';

const form = [
	{
		name: 'firstName',
		value: '',
		options: {
			type: 'text',
		},
		validate: {
			required: v => v.trim() === '' ? 'required' : '',
		}
	},
	{
		name: 'lastName',
		value: '',
		options: {
			type: 'text',
		}
		validate: {
			required: v => v.trim() === '' ? 'required' : '',
		}
	},
	{
		name: 'age',
		value: '',
		options: {
			type: 'number',
		}
		validate: {
			required: v => v.trim() === '' ? 'required' : '',
			availableAge: v => v > 0 && v < 100 ? '' : 'Invalid'
		}
	},
]

const FormComponent = () => {
	const {	formArray, updateEvent, resetEvent, submitEvent } = easyHook({ initialForm: form });

	return <div>
		{formArray.map(el => <div>
			<input
				key={el.name} 
				name={el.name}
				type={el.options.type} 
				value={el.value}
				onChange={updateEvent}
			/>
			{el.touched && el.error && <span>{el.error}</span>}
		</div>
		)}
		<button onClick={resetEvent}>reset</button>
		<button onClick={submitEvent(submit)}>submit</button>
	</div>
}
```


## Hook props

* __initialForm__ is array of objects (required)

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| name | `string` | `-` | true | Name of input, unique identifier of each field |
| value | `any` | undefined | false | Value for this object |
| error | `string` | ` ` | false | String error |
| touched | `boolean` | false | false | The value indicates whether it has been changed before |
| validate | `object of rules` | undefined | false | Object with functions for validate |
| options | `object` | undefined | false | Object for rest user properties, it can be - type, placeholder, label, some options etc |


* __resetAfterSubmit__

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| resetAfterSubmit | `boolean` | false | false | Property for reset form after success submit |

## Hook actions API

```javascript
	formArray // form = array of objects
	formObject // form = object for non iterable cases
	updateEvent // event for onChange 
	resetEvent // reset form manually
	submitEvent // takes a callback as a param, return to callback formatted object
	setErrorManually, // takes a name and error string as a params, and immediately set error for current name
	setValueManually, // takes a name and value as a params, and immediately set value for current name
```

## Contribute

1. Fork it: `git clone https://github.com/softonic/axios-retry.git`
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Added some feature'`
4. Check the build: `npm run build`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D