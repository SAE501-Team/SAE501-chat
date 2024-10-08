import React from 'react';
import '../Chat.css';

const Chat = () => {
    return (
        <div className="chat-w">
            <div className="chat-goat">
                <img src="/goat1.png" alt="" />

                <div className="goat2">
                    <img src="/goat2.png" alt="" />
                </div>
            </div>

            <div className="chat-show">

                <div className="chat-area">
                    <div className="chat-text"></div>
                </div>

                <div className="chat-br">
                    <input type="text" className="chat-in" placeholder="Type something..." />
                    <button className="chat-send">
                        <img src="chat-submit.svg" alt="Send" />
                    </button>
                </div>
            </div>

        </div>

    );
};

export default Chat;
