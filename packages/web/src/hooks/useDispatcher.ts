import { Reducer, useImmerReducer } from 'use-immer';

export class IDispatcher<T>{
  // readonly Dispatch: React.Dispatch;
  constructor(readonly Dispatch: React.Dispatch<T>) {
  }
}
export function useDispatcher<S = any, A = any>
  (Dispatchable: typeof IDispatcher, initialState: S, initialAction?: ((initial: any) => S)): [S, IDispatcher<A>] {
  const reducer: Reducer<S, A> = () => { };
  const [state, dispatch] = useImmerReducer<S, A>(reducer, initialState, initialAction);
  const dispatcher = new Dispatchable(dispatch);
  return [state, dispatcher]; //as [S, Dispatchable];
}

/* interface ImpMe<T> {
  name: T;
};

class AnyClass implements ImpMe<number> {
  constructor(readonly name) { }
}


function fun(C: FunctionConstructor) {
  return new C(0);

}
fun(AnyClass); */