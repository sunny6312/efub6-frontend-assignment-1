import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Home, User, Bell, Mail, Bookmark, Search, Trash2, ArrowLeft, Twitter } from 'lucide-react';

// 가상 유저 정보 (내 프로필 데이터)
const CURRENT_USER = {
  userId: "efub_4th_toy",
  userName: "송지민",
  handle: "@efub_4th_toy"
};

function App() {
  // 전체 트윗 상태 관리 (로컬스토리지에 데이터가 있으면 가져오고, 없으면 기본 더미 데이터 사용)
  const [tweets, setTweets] = useState(() => {
    const saved = localStorage.getItem('tweets');
    return saved ? JSON.parse(saved) : [
      { id: 1, userId: "elonmusk", userName: "Elon Musk", text: "Supercharger network is expanding!", createdAt: "8h" },
      { id: 2, userId: "efub_4th_toy", userName: "송지민", text: "리액트로 만드니까 훨씬 재밌네요! 🚀", createdAt: "2h" }
    ];
  });

  // 트윗 데이터가 변경될 때마다 브라우저 로컬스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem('tweets', JSON.stringify(tweets));
  }, [tweets]);

  // [POST] 새로운 트윗 작성 기능
  const addTweet = (text) => {
    const newTweet = {
      id: Date.now(), // 고유한 ID 생성
      userId: CURRENT_USER.userId,
      userName: CURRENT_USER.userName,
      text: text,
      createdAt: "Just now"
    };
    setTweets([newTweet, ...tweets]); // 최신 글이 맨 위로 오도록 추가
  };

  // [DELETE] 트윗 삭제 기능
  const deleteTweet = (id) => {
    if (window.confirm("트윗을 삭제하시겠습니까?")) {
      setTweets(tweets.filter(t => t.id !== id));
    }
  };

  return (
    <Router>
      <div className="app-container">
        {/* [좌측] 네비게이션 바 (라우팅 링크) */}
        <aside className="sidebar">
          <div className="logo"><Twitter size={30} fill="white" color="white" /></div>
          <nav>
            <Link to="/" className="nav-item"><Home /> <span>Home</span></Link>
            <Link to="/profile" className="nav-item"><User /> <span>Profile</span></Link>
            <div className="nav-item"><Bell /> <span>Notifications</span></div>
            <div className="nav-item"><Mail /> <span>Messages</span></div>
            <div className="nav-item"><Bookmark /> <span>Bookmarks</span></div>
          </nav>
          <button className="post-btn">Post</button>
        </aside>

        {/* [중앙] 메인 화면 구역 (주소에 따라 컴포넌트 교체) */}
        <main className="main-content">
          <Routes>
            {/* 메인 화면: 전체 트윗 보기 */}
            <Route path="/" element={<HomePage tweets={tweets} onPost={addTweet} onDelete={deleteTweet} />} />
            {/* 세부 화면: 트윗 개별 보기 */}
            <Route path="/tweet/:id" element={<TweetDetailPage tweets={tweets} onDelete={deleteTweet} />} />
            {/* 프로필 화면: 사용자 정보 및 내 트윗 보기 */}
            <Route path="/profile" element={<ProfilePage tweets={tweets} user={CURRENT_USER} onDelete={deleteTweet} />} />
          </Routes>
        </main>

        {/* [우측] 사이드바 레이아웃 */}
        <aside className="widgets">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search" />
          </div>
        </aside>
      </div>
    </Router>
  );
}

// ==========================================
// 하위 페이지 컴포넌트 분리
// ==========================================

// 1. 메인 화면 (전체 트윗 보기 & 작성)
function HomePage({ tweets, onPost, onDelete }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!text.trim()) return;
    onPost(text);
    setText(""); // 입력창 초기화
  };

  return (
    <div className="page">
      <header className="page-header"><h2>Home</h2></header>
      <div className="tweet-input-box">
        <div className="avatar"></div>
        <div className="input-area">
          <textarea 
            placeholder="What is happening?!" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={!text.trim()}>Post</button>
        </div>
      </div>
      <div className="tweet-list">
        {tweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} onDelete={onDelete} onClick={() => navigate(`/tweet/${tweet.id}`)} />
        ))}
      </div>
    </div>
  );
}

// 2. 프로필 화면 (사용자 정보 및 내 트윗 필터링)
function ProfilePage({ tweets, user, onDelete }) {
  const myTweets = tweets.filter(t => t.userId === user.userId); // 내가 쓴 글만 필터링
  const navigate = useNavigate();

  return (
    <div className="page">
      <header className="page-header">
        <ArrowLeft onClick={() => navigate(-1)} className="back-icon" />
        <h2>{user.userName}</h2>
      </header>
      <div className="profile-info">
        <div className="banner"></div>
        <div className="profile-details">
          <div className="large-avatar"></div>
          <h3>{user.userName}</h3>
          <p className="handle">{user.handle}</p>
          <p className="bio">안녕하세요! 리액트로 구현한 프로필 화면입니다. ✨</p>
        </div>
      </div>
      <div className="tweet-list">
        {myTweets.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#71767b' }}>작성한 트윗이 없습니다.</p>
        ) : (
          myTweets.map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} onDelete={onDelete} onClick={() => navigate(`/tweet/${tweet.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}

// 3. 세부 화면 (개별 트윗 디테일 보기)
function TweetDetailPage({ tweets, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const tweet = tweets.find(t => t.id === Number(id));

  if (!tweet) return <div className="page" style={{ padding: '20px' }}>트윗을 찾을 수 없습니다.</div>;

  return (
    <div className="page">
      <header className="page-header">
        <ArrowLeft onClick={() => navigate(-1)} className="back-icon" />
        <h2>Post</h2>
      </header>
      <div className="tweet-detail">
        <div className="user-info">
          <div className="avatar"></div>
          <div>
            <strong>{tweet.userName}</strong>
            <p className="handle">@{tweet.userId}</p>
          </div>
        </div>
        <p className="detail-text">{tweet.text}</p>
        <span className="time">{tweet.createdAt} · X Web App</span>
      </div>
    </div>
  );
}

// 공통 컴포넌트: 피드에 보여지는 트윗 카드
function TweetCard({ tweet, onDelete, onClick }) {
  return (
    <div className="tweet-card" onClick={onClick}>
      <div className="avatar"></div>
      <div className="card-content">
        <div className="card-header">
          <span className="name" style={{ fontWeight: 'bold', marginRight: '5px' }}>{tweet.userName}</span>
          <span className="handle">@{tweet.userId} · {tweet.createdAt}</span>
          {/* 내가 작성한 트윗일 때만 삭제 버튼 활성화 */}
          {tweet.userId === "efub_4th_toy" && (
            <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(tweet.id); }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <p className="text" style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{tweet.text}</p>
      </div>
    </div>
  );
}

export default App;