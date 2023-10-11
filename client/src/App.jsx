import { useState, useEffect } from 'react';
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

// let arr = [
//   {type:"user", post:"our quesn"},
//   {type:"bot", post:"bot ka ans"},
//   // ek 3rd type loader ka bhi ho jaayega, until our api fetches the data 
// ]

function App() {
  const[input, setInput] = useState("");
  const[posts, setPosts] = useState([]);

  useEffect(()=>{
    document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight;
  },[posts]);                           // posts is dependency array 

  const fetchBotResponse = async () => {
    const {data} = await axios.post("https://shy-lime-elk-vest.cyclic.cloud", {input}, {     // localhost:4000 ko idhar replace kra hai
      headers : {
        "Content-Type": "application/json", 
      }, 
    });
    return data;                            // bot ka response data mein store ho jaayega 
  };

  const onSubmit = ()=>{
    if(input.trim() === "") return;
    updatePosts(input);
    updatePosts("loading...", false, true);
    setInput("");                                             // input box ko firse empty kr denge 
    fetchBotResponse().then((res)=>{
      console.log(res);
      updatePosts(res.bot.trim(), true);
    });
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if(index < text.length){
        setPosts(prevState => {
          let lastItem = prevState.pop();
          if(lastItem.type !== "bot"){
            prevState.push({
              type : "bot",                                 // if not bot, then we ae pushing bot response 
              post: text.charAt(index-1)
            })
          }else{
            prevState.push({
              type : "bot",                       
              post: lastItem.post + text.charAt(index-1)
            })
          }
          return [...prevState];
        });
        index++;
      }else{
        clearInterval(interval);
      }
    }, 10);                                       // interval time is 10 millisecond in between every char
  }

  const updatePosts = (post, isBot, isLoading ) => {
    if(isBot){                                 // bot ka response char by char type hote dikhana haiii
      autoTypingBotResponse(post);
    }else{
      setPosts(prevState => {
        return [...prevState, {type: isLoading? "loading":"user", post}];    // we returns an array in which we send an object for newState
      });
    }
    
  };

  const onKeyUp = (e) => {
    if(e.key === "Enter" || e.which === 13){
      onSubmit();
    }
  }

  return (
    <div>
      <nav className='navbar'>
        {/* <div className='xyz'>Welcome to chatgpt World !!! </div> */}
        <div className='xyz'>Feel free to ask anything !!! </div>
      </nav>

      <main className='chatGPT-app'>
        <section className='chat-container'>

          <div className='layout'>
            {posts.map((post,index)=>(
              <div 
                key={index}
                className={`chat-bubble ${post.type === "bot" || post.type === "loading" ? "bot" : ""}`}
              >

                <div className='avatar'>
                  <img src={post.type === "bot" || post.type === "loading" ? bot : user}/>
                </div>

                {post.type === "loading" ? 
                  ( <div className='loader'> <img src={loadingIcon} /> </div> ) 
                    : 
                  ( <div className='post'>{post.post}</div> )
                }

              </div>
            ))}
          </div>

        </section>

        <footer className='foot'>
          <input
            value={input}                                // server  input naam se jaanega   
            className='composebar'
            autoFocus
            type="text"   
            placeholder='How can i help you !'
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={onKeyUp}
          />

          <div className='send-button' onClick={onSubmit}>
            <img src={send} />
          </div>
        </footer>

      </main>
    </div>
  );
}

export default App;