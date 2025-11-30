# Loader Component Usage Guide

The Loader component is a reusable component that displays a loading spinner with customizable options.

## Installation

The Loader component is already available in the project at:
```
import Loader from '../../components/Loader/Loader';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | string | 'medium' | Size of the loader ('small', 'medium', 'large') |
| color | string | 'primary' | Color of the loader ('primary', 'secondary', 'white') |
| fullScreen | boolean | false | Whether to display the loader as a fullscreen overlay |
| inline | boolean | false | Whether to display loader inline (horizontal layout, good for buttons) |
| message | string | '' | Optional text to display beside (inline) or below (default) the spinner |

## Usage Examples

### Basic Usage
```jsx
import Loader from '../../components/Loader/Loader';

// Simple loader
<Loader />

// Small loader with message
<Loader size="small" message="Loading..." />

// Fullscreen loader with custom message
<Loader 
  size="large" 
  color="white" 
  fullScreen={true} 
  message="Please wait..." 
/>

// Inline loader inside a button
<Button disabled={isLoading}>
  {isLoading ? (
    <Loader size="small" color="white" inline message="Submitting..." />
  ) : (
    'Submit'
  )}
</Button>
```

### In a Form Submission Context
```jsx
import React, { useState } from 'react';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';

const MyForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle response
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      
      {loading ? (
        <Loader size="small" message="Submitting..." />
      ) : (
        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      )}
    </form>
  );
};
```

### In a Data Fetching Context
```jsx
import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader/Loader';

const DataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // const response = await api.getData();
      // setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading data..." />;
  }

  return (
    <div>
      {/* Render your data here */}
    </div>
  );
};
```

## Customization

The Loader component uses CSS modules for styling. You can customize the appearance by modifying:
- `Loader.module.css` - Contains all the styling rules

### CSS Classes
- `.loader` - Container for the spinner and message
- `.spinner` - The spinning element
- `.message` - Text message below the spinner
- `.fullScreen` - Styles for fullscreen overlay

## Best Practices

1. Always provide visual feedback when performing asynchronous operations
2. Use appropriate size and color for the context
3. Consider using fullScreen loader for major operations that block the entire UI
4. Include meaningful messages when possible to improve user experience
5. Combine with disabled states on buttons to prevent double submissions