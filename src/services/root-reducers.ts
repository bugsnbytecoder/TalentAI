import { combineReducers } from 'redux';
import hiremeReducer from './hireme.slice';
import recruiterReducer from './recruiter.slice';

const RootReducer = combineReducers({
  hireme: hiremeReducer,
  recruiter: recruiterReducer,
});

export default RootReducer;
