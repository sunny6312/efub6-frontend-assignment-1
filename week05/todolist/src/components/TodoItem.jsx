import React from 'react';
import styled, { css } from 'styled-components';
import { MdDone, MdDelete } from 'react-icons/md';

const Remove = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dee2e6;
  font-size: 24px;
  cursor: pointer;
  opacity: 0;
  &:hover {
    color: #ff6b6b;
  }
`;

const TodoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  &:hover {
    ${Remove} {
      opacity: 1;
    }
  }
`;

const CheckCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid #ced4da;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  cursor: pointer;
  ${props => props.done && css`
    border: 1px solid #38d9a9;
    color: #38d9a9;
  `}
`;

const Text = styled.div`
  flex: 1;
  font-size: 21px;
  color: #495057;
  ${props => props.done && css`
    color: #ced4da;
    text-decoration: line-through;
  `}
`;

// React.memo로 컴포넌트를 감쌉니다.
const TodoItem = React.memo(({ id, done, text, onRemove, onToggle }) => {
  console.log(`TodoItem 리렌더링: ${text}`); // 확인용 로그

  return (
    <TodoItemBlock>
      {/* 힌트 1: CheckCircle 클릭 시 onToggle(id) 호출, done 상태 전달 */}
      <CheckCircle done={done} onClick={() => onToggle(id)}>
        {done && <MdDone />}
      </CheckCircle>

      {/* 힌트 2: Text에 done 상태 전달하고 text 표시 */}
      <Text done={done}>{text}</Text>

      {/* 힌트 3: Remove 클릭 시 onRemove(id) 호출 */}
      <Remove onClick={() => onRemove(id)}>
        <MdDelete />
      </Remove>
    </TodoItemBlock>
  );
});

export default TodoItem;