---
title: "React Redux Toolkit"
seoTitle: "React Redux Toolkit"
seoDescription: "React Redux Toolkit"
datePublished: Wed Mar 06 2024 10:18:18 GMT+0000 (Coordinated Universal Time)
cuid: cltfnblko000609l6dzlo0caz
slug: react-redux-toolkit
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1709720268088/28ccb1b7-4f2a-4564-9b4a-4ad0fd273013.png
tags: reactjs, redux, redux-toolkit

---

### What is the redux toolkit?

Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It provides utilities to simplify common Redux use cases, such as store setup, reducer creation, and asynchronous logic handling.

### Function and Utils

Redux Toolkit includes various functions and utilities to streamline Redux development, such as `configureStore, createSlice`, `createAsyncThunk`, and `createEntityAdapter`.

### Configure Store

`configureStore` is a function provided by Redux Toolkit to set up a Redux store with sensible defaults and additional middleware.

```javascript
import { configureStore } from '@reduxjs/toolkit'; 
import rootReducer from './reducers';

const store = configureStore({
 reducer: rootReducer, 
 devTools: process.env.NODE_ENV !== 'production' 
});

export default store;
```

### Provider

`Provider` access the Redux store through a React Application

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### createSlice

`createSlice` to create Redux state slices with reducers and action creators.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

### useDispatch

`useDispatch` for accessing the dispatch function

```javascript
import React from 'react';
import { useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

const Counter = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default Counter;
```

### useSelector

`useSelector` for accessing the Redux store state

```javascript
import React from 'react';
import { useSelector } from 'react-redux';

const CounterDisplay = () => {
  const count = useSelector(state => state.counter.value);

  return <div>Count: {count}</div>;
};

export default CounterDisplay;
```

### createAsyncThunk

* generates async action creator
    

* take action type string as a token
    

### ActionType

it generates three action types a pending, a fulfilled, and a rejected action type.

### Async function

an async function as the second argument to `createAsyncThunk` for asynchronous operation. you can dispatch actions, perform async operations (like API calls), and handle any errors that may occur.

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser } from '../api/userAPI';

export const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const response = await fetchUser(userId);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {},
    status: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
```