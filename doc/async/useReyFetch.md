### useReyFetch:

用途：两个请求之间存在依赖关系时，可以通过该钩子获取两个依赖请求之间的数据；

语法：

```
const {response, loading, start， isError} = useRelyFetch(options, deps);
返回值：
response:响应体；
   repsonse = {mainData: 主函数的响应体，relyData: 依赖函数的响应体}
loading：加载状态;
start:触发函数
   start({mainParams: 主函数参数，relyParams：依赖函数参数})
isError: 是否出错；   
   
options参数：
{
    main: (params) => Promise<any>; // 主函数， params就是start的mainParams
    rely: (params) => Promise<any>; // 依赖函数，如果没有paramsFn，params为{mainData，relyParams}，如果有则以paramsFn的返回值为主
    initValue：{mainData，relyData}
    paramsFn: (params) => any; // 依赖函数的参数函数，主要用来处理rely函数的请求参数，返回值就是rely的入参，params = {mainData，relyParams}
    onSuccess: (response, setResponse) => void; // rely函数响应成功时的函数，其中response为{mainData，relyData}，setResponse更新函数，setResponse(main的返回，rely的返回)
    onError?: (error, type, setResponse) => void; // main和rely函数失败的处理函数，error为错误堆栈，type为main或者rely，setResponse同上
    closeLoading: // 是否在请求中不开启loading，默认为false
    deps: 依赖项
} 
```

demo:

```
function CheckRely(props) {
  const { response, start, loading } = useRelyFetch(
    {
      main(params) {
        console.log('mainParams', params);
        return fetch1(params)
          .then(d => {
            return { a: d.b + 10 };
          });
      },
      rely(params) {
        console.log('relyParams', params);
        return fetch2(params.id);
      },
      paramsFn(params) {
        return {id: props.id, status: 'yes'}
      },
      onSuccess(data, setData) {
        console.log('success', data);
        setData({a: 'main' + data.mainData.a}, {c: 'rely' + data.relyData.c});
      },
      onError(error, type, setData) {
        console.log('error', error);
        setData('error')
      },
      initValue: { mainData: {}, relyData: {} }
    }, [props.id]);
  return <div>
    <p>状态{loading ? 'loading' : 'complete'}</p>
    <p>main结果：{response.mainData.a}</p>
    <p>rely结果：{response.relyData.c}</p>
    <button onClick={e => {
      start({ mainParams: 1, relyParams: 2 });
    }}>点击
    </button>
  </div>;
}
```