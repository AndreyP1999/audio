export default function CustonSelect({ text, options, setFillter }) {
    return (


        
        <div className="selectdiv">
            <label>
                <span style={{color:"red"}}>{text}</span>
                <select defaultValue="null" onChange={setFillter}>

                    {options.map((el, index) => {
                        return (<option key={index} value={el}>{index + 1}</option>)
                    })}
                </select>
            </label>
        </div>
    )
}