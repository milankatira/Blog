---
title: "Caching in React – How to Use the useMemo and use callback Hooks"
datePublished: Fri Apr 12 2024 15:01:53 GMT+0000 (Coordinated Universal Time)
cuid: cluwsqssd000g08jv2cdoh8pq
slug: caching-in-react-how-to-use-the-usememo-and-use-callback-hooks
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1712933839394/e5020b2c-38b8-4006-88c6-a6df22f9814b.png

---

**Introduction**

Caching is a technique used to store data in a temporary memory area for faster access. In React applications, caching can significantly improve performance by reducing the time required to recompute values that do not change frequently. Two essential hooks for implementing caching in React are `useMemo` and `useCallback`.

**useMemo Hook**

The `useMemo` hook is used to cache the result of a function. It accepts two arguments:

* **Dependency Array:** An array of values that the function depends on.
    
* **Callback Function:** The function whose result should be cached.
    

The `useMemo` hook returns the cached value if the dependency array values have not changed. If any dependency value changes, the function is re-executed, and a new value is returned.

**Example:**

```typescript
import React, { useMemo } from "react";

interface ExpensiveComponentProps {
    value: number;
}

const ExpensiveComponent = React.memo(({ value }: ExpensiveComponentProps) => {
    const computeExpensiveValue = (value: number): number => {
        return value ** 2;
    };

    const memoizedValue = useMemo(() => computeExpensiveValue(value), [value]);
    return <div>Expensive Value: {memoizedValue}</div>;
});

export default ExpensiveComponent;
```

the `useMemo` hook will only re-execute the calculation when `value` change.

**use callback Hook**

The `useCallback` hook is used to cache a function itself. It accepts two arguments:

* **Callback Function:** The function that should be cached.
    
* **Dependency Array:** An array of values that the function depends on.
    

The `useCallback` hook returns a memoized version of the function, which is guaranteed to be the same instance as long as the dependency values do not change.

**Example:**

```typescript
  const increment = useCallback(() => {
    setCode((c) => c + 1);
  }, [value]);
```

In this example, the `useCallback` hook will only create a new instance of the function when `value` changes.

**Benefits of Caching**

Caching with `useMemo` and `useCallback` offers several benefits:

* **Improved Performance:** By caching values and functions, React can avoid unnecessary re-calculations and lookups.
    
* **Reduced Re-renders:** If a cached value does not change, the child components that depend on it will not re-render.
    
* **Improved User Experience:** A more responsive and faster application enhances the user experience.
    

**When to Use Caching**

Caching is particularly useful when the following conditions are met:

* The value or function is computationally expensive to calculate.
    
* The value or function is used multiple times within a component.
    
* The dependency values of the value or function are unlikely to change frequently.
    

**Conclusion**

`useMemo` and `useCallback` are powerful hooks for implementing caching in React applications. By effectively utilizing these hooks, developers can optimize performance, reduce re-renders, and improve the overall user experience.