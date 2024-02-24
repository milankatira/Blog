## Zod is a TypeScript-first schema declaration and validation library. It allows you to define schemas for your data and validate them against those schemas.

1. **Defining Schemas:**
    
    With Zod, you can define schemas for your data structures
    

```javascript
import { z } from 'zod';

const userSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
});
```

## 1. **Validating Data**:
    
    Once you have defined your schema, you can use it to validate data objects. If the data object matches the schema, the validation will pass; otherwise, it will throw an error indicating the validation failure.
    

```javascript
const userData = {
  name: 'Milan katira',
  age: '23',
  email: 'milankatira26@gmail.com',
};

try {
    userSchema.parse(userData);
    console.log('Data is valid!');
} catch (error) {
    console.error('Validation failed:', error.errors);
}
```

## 2. **Throw an exception**
    

```javascript
const userData = {
  name: 'Milan katira',
  age: '23',
  email: 'milankatira26@gmail.com',
};

try {
  userSchema.parse(userData);
  console.log('Data is valid!');
} catch (error) {
  console.error('Validation failed:', error.errors);
}
```

```javascript
error = [
  {
    code: 'invalid_type',

    expected: 'number',

    received: 'string',

    path: (1)['age'],

    message: 'Expected number, received string',
  },
];
```

## **Practical Use Cases**:

## Form Validation: 
Zod can validate form data in web applications. You can define a schema that describes the expected structure of the form data and then validate user input against that schema.
    
## API Payload Validation: 
When building APIs, you often need to validate request payloads. Zod can be used to define schemas for incoming JSON payloads and validate them before processing the requests.
    
## Configuration Validation: 
In Node.js applications, you might have configuration files that need to be validated before the application starts. Zod can help define schemas for configuration objects and validate them during application initialization.
