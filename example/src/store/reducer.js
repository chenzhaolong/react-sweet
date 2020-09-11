/**
 * @file reducer
 */

export function AppleReducer(state, action) {
  switch (action.type) {
    case 'add':
      return {...state, apple1: action.payload};
    case 'dul':
      return {...state, apple2: action.payload};
    case 'mul':
      return {...state, apple3: action.payload};
    default:
      return state;
  }
}

export function BananaReducer(state, action) {
  switch (action.type) {
    case 'add1':
      return {...state, banana1: action.payload};
    case 'dul1':
      return {...state, banana2: action.payload};
    case 'mul1':
      return {...state, banana3: action.payload};
    default:
      return state;
  }
}

export function GrayReducer(state, action) {
  switch (action.type) {
    case 'add2':
      return {...state, gray1: action.payload};
    case 'dul2':
      return {...state, gray2: action.payload};
    case 'mul2':
      return {...state, gray3: action.payload};
    default:
      return state;
  }
}