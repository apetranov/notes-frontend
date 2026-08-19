import { useState } from "react"

export default function Togglable(props) {
    const [visible, setVisible] = useState(false);

    const hiddenWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setVisible(!visible);
    }

  return (
    <div>
        <div style={hiddenWhenVisible}>
            <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
            {props.children}
            <button onClick={toggleVisibility}>cancel</button>
        </div>
    </div>
  )
}
