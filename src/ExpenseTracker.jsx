import "./ExpenseTracker.css";
import { useState,useEffect } from "react";
import Light from "/DarkMoon.png";
import Dark from "/Light.png";


function ExpenseTracker() {
  const [showform, setShowform] = useState(false);
  const [amount,setAmount] = useState(0);
  const [description,setDescription] = useState("");
  const [selected,setSelected] = useState("expense");
  const [query,setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
});
  const [list,setList] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved? JSON.parse(saved):[];
  });

  const income = list
  .filter(item => item.type === "income")
  .reduce((sum, item) => sum + Number(item.amount), 0);

  const expense = list
  .filter(item => item.type === "expense")
  .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - expense;

  function handleSelected(e){
    setSelected(e.target.value);
  }
  function handleAddTransaction(){
    if(description === "") return;


    const newItem = {
      id: Date.now(),
      type:selected,
      text:description,
      amount: Number(amount),
    };

    setList(prev => [...prev,newItem])

    setAmount("");
    setDescription("");
    setSelected("expense");
    setShowform(false);
  }
  const filtered = list.filter((item) => item.text.toLowerCase().includes(query.toLowerCase()));
  
  useEffect(() => {
    localStorage.setItem("transactions",JSON.stringify(list));
  },[list])
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
}, [darkMode]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      
        <button className="darkModeBtn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <img src={Light} />:<img src={Dark} className="img"/>}
        </button>
      
      <header>Expense Tracker</header>

      <div className="balance">
        <span>Balance: ${balance}</span>
        <button onClick={() => setShowform(!showform)}>
          {showform ? "CANCEL" : "ADD"}
        </button>
      </div>

      {showform && (
        <div className="add">
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="radio">
            <input type="radio" id="expense" name="money" value="expense" required  checked={selected === "expense"} onChange={handleSelected}/>
            <label htmlFor="expense">Expense</label>
            <input type="radio" id="income" name="money" value="income" required checked={selected === "income"} onChange={handleSelected}/>
            <label htmlFor="income">Income</label>
          </div>

          <button onClick={handleAddTransaction}>Add Transaction</button>
        </div>
      )}

      <div className="amount">
        <div>
          <span>Expense</span>
          <div style={{color:"red",fontSize:"30px",fontWeight:600}} >${expense}</div>
        </div>
        <div>
          <span>Income</span>
          <div style={{color:"green",fontSize:"30px",fontWeight:600}} >${income}</div>
        </div>
      </div>

      {list.length > 0 &&
       (<>
        <div className="transactions">Transactions</div>
        <input type="search" placeholder="Search" onChange={(e) => setQuery(e.target.value)}/>
        </>)}

      <ul>
        {filtered.map((item) => (
          <li className="listItem" key={item.id} style={{borderRight:"5px solid",borderRightColor:item.type==="expense"? "red":"green",marginBottom:"10px"}}>
            <span>{item.text}</span>
            <span>${item.amount}</span>
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default ExpenseTracker;
