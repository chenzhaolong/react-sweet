### useOffset：

用途：获取元素的offset的值

调用形式：

```
const {element, offset} = useOffset([deps])
// deps是依赖项
// offset是元素的偏移量，{offsetWidth, offsetHeigth, offsetLeft, offsetTop}
// element是指向dom元素
```
demo：

```
function CheckOffset(props) {
  const [width, setWidth] = useState(100);
  const {element, offset} = useOffset([width, props.id]);
  useEffect(() => {
    console.log('offset', offset);
    console.log('width', width);
  });
  return (
    <div style={{width: width + 'px', height: '300px', marginTop: `${props.id}px`}}
         ref={ele => element.current = ele}
    >
      <li>offsetTop-{offset.offsetTop}</li>
      <li>offsetLeft-{offset.offsetLeft}</li>
      <li>offsetWidth-{offset.offsetWidth}</li>
      <li>offsetHeight-{offset.offsetHeight}</li>
      <button onClick={e => {
        setWidth(ele => ele + 100)
      }}>改变width</button>
    </div>
  )
}
```