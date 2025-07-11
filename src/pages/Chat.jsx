import React, { useEffect, useState } from "react";
import MessageBox from "../components/MessageBox";
import PrevButton from "../components/PrevButton";
import { MoonLoader } from "react-spinners";
import { data } from "autoprefixer";

const Chat = ({ ingredientList }) => {
  // logic
  const endpoint = process.env.REACT_APP_SERVER_ADDRESS;
  const [value, setValue] = useState("");

  // TODO: set함수 추가하기
  const [messages, setMessages] = useState([]); // chatGPT와 사용자의 대화 메시지 배열
  const [isInfoLoading, setIsInfoLoading] = useState(false); // 최초 정보 요청시 로딩
  const [isMessageLoading, setIsMessageLoading] = useState(false); // 사용자와 메시지 주고 받을때 로딩
  const [infoMessages, setInfoMessages] = useState([]);

  const hadleChange = (event) => {
    const { value } = event.target;
    console.log("value==>", value);
    //setValue를 가장 마지막에 진행함.
    setValue(value);
  };

  const hadleSubmit = (event) => {
    event.preventDefault();
    console.log("메시지 보내기");

    const userMessage = {
      role: "user",
      content: value.trim(),
    };
    setMessages((prev) => [...prev, userMessage]); //대화목록 UI 업데이트
    sendMessage(userMessage); //API호출
  };

  const sendMessage = async (userMessage) => {
    // isInfoLoading(true);
    setIsMessageLoading(true);
    try {
      const response = await fetch(`${endpoint}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage,
          messages: [...infoMessages, ...messages],
        }),
      });

      const result = await response.json();

      // chatGPT의 답변 추가
      const { role, content } = result.data;
      const assistantMessage = { role, content };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      // try 혹은 error 구문 실행후 실행되는 곳
      // isInfoLoading(false);
      setIsMessageLoading(false);
    }
  };

  //async await 중 await가 처리된 이후 진행되도록 지정하는 명령어
  //백엔드에게 /recipe AIP 요청
  const sendInfo = async (data) => {
    try {
      const reeponse = await fetch(`${endpoint}/recipe`, {
        //백엔드 res로 넘길 데이터
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientList: data }),
      });
      const result = await reeponse.json();
      //데이터가 없으면 실행취소
      if (!result.data) return;

      //데이터가 정상적이라면
      const resultLasrDataList = result.data.filter(
        //(item, index, array) 이지만 item을 사용안해서 _로 무시
        (_, index, array) => array.length - 1 !== index
      );

      //기초답변
      setInfoMessages(resultLasrDataList);
      // 첫 답변을 UI에 추가하기
      const { role, content } = result.data[result.data.length - 1];
      //prev =배열
      setMessages((prev) => [...prev, { role, content }]);
    } catch (error) {
    } finally {
      // try 혹은 error 구문 실행후 실행되는 곳
      // isInfoLoading(false);
      setIsMessageLoading(false);
    }
  };

  //최상단(가장 처음 진행)에 적어야함
  // 첫번째 용법
  // useEffect(() => {
  //   console.log("모든 srtare가 진행될 때마다 실행");
  // });
  //너무 많이 반응하는 편이라 잘 사용 안함

  //두번쨰 용법
  useEffect(() => {
    // console.log("컴포넌트가 생성되었을 때만 실행");
    console.log("ingredientList", ingredientList);
    sendInfo(ingredientList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //세번째 용법
  // useEffect(() => {
  //   console.log("의존성 배열에 등록한 strate값이 변경될 때마다 신행");
  // }, [value]);

  return (
    <div className="w-full h-full px-6 pt-10 break-keep overflow-auto">
      {isInfoLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MoonLoader color="#46A195" />
          </div>
        </div>
      )}

      {/* START: 로딩 스피너 */}
      {/* START:뒤로가기 버튼 */}
      <PrevButton />
      {/* END:뒤로가기 버튼 */}
      <div className="h-full flex flex-col">
        {/* START:헤더 영역 */}
        <div className="-mx-6 -mt-10 py-7 bg-chef-green-500">
          <span className="block text-xl text-center text-white">
            맛있는 쉐프
          </span>
        </div>
        {/* END:헤더 영역 */}
        {/* START:채팅 영역 */}
        <div className="overflow-auto">
          <MessageBox messages={messages} isLoading={isMessageLoading} />
        </div>
        {/* END:채팅 영역 */}
        {/* START:메시지 입력 영역 */}
        <div className="mt-auto flex py-5 -mx-2 border-t border-gray-100">
          <form
            id="sendForm"
            className="w-full px-2 h-full"
            onSubmit={hadleSubmit}
          >
            <input
              className="w-full text-sm px-3 py-2 h-full block rounded-xl bg-gray-100 focus:"
              type="text"
              name="message"
              value={value}
              onChange={hadleChange}
            />
          </form>
          <button
            type="submit"
            form="sendForm"
            className="w-10 min-w-10 h-10 inline-block rounded-full bg-chef-green-500 text-none px-2 bg-[url('../public/images/send.svg')] bg-no-repeat bg-center"
          >
            보내기
          </button>
        </div>
        {/* END:메시지 입력 영역 */}
      </div>
    </div>
  );
};

export default Chat;
